  ---                                                                                         
  Hook 执行模式总览
  ┌──────────────────────┬───────────────────────┬────────────────┐                                                                                 
  │         Hook         │       执行方式        │ 有无返回值处理 │
  ├──────────────────────┼───────────────────────┼────────────────┤
  │ before_prompt_build  │ 同步，顺序执行        │ 有             │
  ├──────────────────────┼───────────────────────┼────────────────┤
  │ llm_input            │ 异步，fire-and-forget │ 无             │
  ├──────────────────────┼───────────────────────┼────────────────┤
  │ before_message_write │ 同步，顺序执行        │ 有             │
  ├──────────────────────┼───────────────────────┼────────────────┤
  │ before_tool_call     │ 同步，顺序执行        │ 有             │
  ├──────────────────────┼───────────────────────┼────────────────┤
  │ after_tool_call      │ 异步，fire-and-forget │ 无             │
  └──────────────────────┴───────────────────────┴────────────────┘

  ---
  before_prompt_build — prependContext 的去向

  AgentWard 返回 { prependContext: "警告文本" } 后：

  hooks.ts:172-189
  多个插件的 prependContext 用 \n\n 拼接合并
      ↓
  attempt.ts:2736-2739
  effectivePrompt = `${prependContext}\n\n${effectivePrompt}`
      ↓
  注入到发给 LLM 的 Prompt 里

  结论：prependContext 不会显示在 UI，也不打印到 gateway，它是悄悄注入到 LLM 上下文里的，只有 LLM 能看到。AgentWard用它来告知助手"工具调用权限已被撤销"。

  ---
  before_tool_call — blockReason 的去向

  AgentWard 返回 { block: true, blockReason: "警告文本" } 后：

  pi-tools.before-tool-call.ts:173-177
  { blocked: true, reason: blockReason }
      ↓
  pi-tools.before-tool-call.ts:212-214
  throw new Error(reason)   ← blockReason 变成一个 JS Error
      ↓
  pi-agent-core 捕获这个异常
      ↓
  生成一条 role="toolResult" 的消息，content = 错误信息
      ↓
  before_message_write 可以再次拦截这条 toolResult
      ↓
  写入 session JSONL → 显示在 UI 对话界面

  结论：blockReason 最终以 toolResult 错误消息的形式出现在 UI 对话里，助手能读到它，用户也能看到。这就是为什么 AgentWard 的
  formatToolCallWarning() 要在 blockReason 里写"停止任务、告知用户"这类指令——助手读到这条 toolResult 后会照着执行。

  ---
  before_message_write — block/替换消息的去向

  block: true 时：

  session-tool-result-guard.ts:150-162
  applyBeforeWriteHook() 返回 null
      ↓
  guardedAppend() 检查为 null
      ↓
  消息不写入 JSONL，不发送到 UI
      ↓
  这条消息从会话中彻底消失

  返回替换消息时：

  result.message 替换原消息
      ↓
  继续传给下一个插件的 Hook
      ↓
  最终写入 JSONL → 显示在 UI

  结论：这解释了 AgentWard 的两个行为——
  - coverContaminatedResponse=true 时，原助手响应被 block:true 丢弃，替换成警告消息显示在 UI
  - blockHarmfulInput=true 时，toolResult 内容被替换为警告文本，助手看到的是替换后的内容

  ---
  你观察到的现象解释

  "部分打印在 gateway" — 这是 AgentWard 自己调用 getLogger() 打印的日志，与 Hook 返回值无关，是插件主动写日志。

  "部分显示在 UI" — 这是 before_tool_call 的 blockReason 经过 throw new Error() → toolResult 消息这条链路最终渲染到对话界面的。

  两者的来源完全不同：

  gateway 日志  ← getLogger().warn(...)        插件主动打印
  UI 告警消息   ← blockReason → Error → toolResult → JSONL → UI

  ---
  完整数据流一张图

  before_prompt_build
    └─ prependContext ──────────────────────→ 注入 LLM Prompt（用户不可见）

  before_tool_call
    └─ block:true + blockReason
         └─ throw new Error(blockReason)
              └─ toolResult 消息 ────────────→ 写入 JSONL → UI 对话显示

  before_message_write（toolResult）
    ├─ block:true ──────────────────────────→ 消息丢弃，UI 不显示
    └─ 替换 message ────────────────────────→ 替换内容写入 JSONL → UI 显示

  before_message_write（assistant）
    ├─ block:true ──────────────────────────→ 助手响应丢弃
    └─ 替换 message（警告文本）───────────────→ 警告显示在 UI

  getLogger().warn() ────────────────────────→ gateway 控制台日志（仅运维可见）
  send_message() ────────────────────────────→ 飞书消息推送（若启用）

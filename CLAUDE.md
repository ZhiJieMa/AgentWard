# AgentWard — 项目说明

## 项目简介

AgentWard 是 **OpenClaw**（AI Agent 平台）的五层安全防护插件。它通过 OpenClaw 插件 SDK 拦截 Agent 事件，在运行时执行安全策略。

## 技术栈

| 层级      | 技术                                                    |
|---------|-------------------------------------------------------|
| 语言      | TypeScript（ESM，`"type": "module"`）                    |
| 运行时     | Node.js（worker_threads 用于同步 LLM 调用）                   |
| 插件宿主    | OpenClaw（`openclaw/plugin-sdk`）                       |
| LLM 客户端 | `@mariozechner/pi-ai`、`@mariozechner/pi-coding-agent` |
| 工具库     | lodash-es、p-limit、chalk                               |

## 项目结构

```
index.ts                  ← 插件入口，注册所有 Hook
config.ts                 ← PluginConfig 类 + ConfigSchema（手动类型校验，无 Zod）
core/
  state.ts                ← 每个会话的 SessionState；持有阻断标志、警告队列、LLM 上下文
  warnings.ts             ← Warning 类 + 各注入点的格式化函数
  commands.ts             ← /agentward 斜杠命令处理器
layers/
  foundation-scan.ts      ← 扫描 skills 目录和配置文件中的恶意内容（规则 + 语义）
  input-sanitization.ts   ← 检测工具结果中的注入/有害内容
  cognition-protection.ts ← 检测异常的内存文件写入行为
  decision-alignment.ts   ← 监控助手响应的决策对齐性
  exec-control.ts         ← 检测工具调用中的危险 Shell 命令
worker/
  model-worker-manager.ts ← PersistentWorker（SharedArrayBuffer + Atomics 同步 IPC）
  model-worker.ts         ← Worker 线程：同步执行 LLM 调用
util/
  logger.ts               ← 结构化日志（文件 + 控制台）
  crypto-util.ts          ← Worker IPC 载荷的 AES 加解密
  map.ts                  ← Provider 基础 URL / API 类型映射表
```

## 五层安全防护

1. **FoundationScan** — `before_prompt_build`：每次构建 Prompt 前扫描 `skills/` 目录和 OpenClaw 配置，检测恶意 Skill 或安全误配置。
2. **InputSanitization** — `before_message_write`（toolResult）：检测工具结果中的注入/有害内容；可阻断、追加警告或覆盖助手响应。
3. **CognitionProtection** — `before_tool_call`：检测异常的内存文件写入模式。
4. **DecisionAlignment** — `before_message_write`（assistant，`stopReason=toolUse`）：通过 Worker 调用 LLM 检查助手决策是否对齐。
5. **ExecControl** — `before_tool_call`：正则检测危险 Shell 命令。

## 阻断级别

| 级别 | 作用范围          | 触发条件                                                |
|----|---------------|-----------------------------------------------------|
| 1  | 仅本次工具调用       | ExecControl / CognitionProtection 的 instant_warning |
| 2  | 临时（直到下一次助手响应） | temp_block_tool_call                                |
| 3  | 永久（直到用户下一次输入） | block_tool_call                                     |

## 关键模式

- **SessionState** 以 `ctx.sessionKey` 为键存储在 `plugin.status: Map<string, SessionState>` 中，每次 `before_prompt_build` 时重置阻断标志。
- **警告队列**（`warning_queue` / `warning_head` 指针）：警告累积后在下一次 `before_tool_call` 时统一写入 `blockReason`。
- **Worker IPC**：`PersistentWorker` 使用 `SharedArrayBuffer` + `Atomics.wait/notify` 实现主线程的同步 LLM 调用，载荷经 AES 加密后写入临时文件。
- **配置**：`PluginConfig.fromPluginConfig()` 手动做类型收窄（无 Zod），每个字段在构造函数中有安全默认值。
- **主动通知**：若 `enableProactiveNotifications` 为 true 且检测到飞书会话，则通过 `openclaw message send` 发送警告。

## 构建与运行

这是一个插件，在 OpenClaw 内部运行，不独立启动。无需构建步骤，OpenClaw 通过扩展加载器直接加载 `index.ts`。

```bash
# 运行 foundation-scan 测试
node test/foundation-scan/run-detect-malicious-skills.mjs test/foundation-scan
node test/foundation-scan/run-detect-misconfiguration.mjs test/foundation-scan
```

## 环境变量

- `AGENT_WARD_API_KEY`（默认）— DecisionAlignment / FoundationScan 语义检测所用 LLM 的 API Key。可通过插件配置的 `llm.apiKeyEnv` 修改变量名。

## 代码规范

- 提交格式：`<type>: <description>`（feat、fix、refactor、docs、chore、perf）
- 无测试框架，测试为 `test/` 下的普通 `.mjs` 脚本
- 文件命名：源文件使用 camelCase
- 错误处理：每层显式 try/catch 并调用 logger，不静默吞掉错误
- 不可变性：启动时用 `structuredClone` 克隆配置；SessionState 内的状态变更是有意为之的

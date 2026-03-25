export class Warning {
  type: string;
  description: string;
  details: string;
  constructor(type: string, description: string, details: string = "") {
    this.type = type;
    this.description = description;
    this.details = details;
  }
}

export const PROFANITY_DETECTED = new Warning(
  "Profanity Detected",
  "The system detected inappropriate language in the tool response.",
  ""
);

export const INJECTION_DETECTED = new Warning(
  "Injection Detected",
  "The system detected potential prompt injection in the tool response.",
  ""
);

export const DANGEROUS_COMMAND_DETECTED = new Warning(
  "Dangerous Command Detected",
  "The system detected a potentially dangerous command in the tool call.",
  ""
);

export const INFINITE_LOOP_DETECTED = new Warning(
  "Infinite Loop Detected",
  "The system detected a potential infinite loop in the command.",
  ""
);

export const MALICIOUS_SKILL_DETECTED = new Warning(
  "Malicious Skill Detected",
  "The system detected malicious instructions in skill files.",
  ""
);

export const MISCONFIGURATION_DETECTED = new Warning(
  "Misconfiguration Detected",
  "The system detected risky security-related configuration in workspace files.",
  ""
);

export const DECISION_MISALIGN = new Warning(
  "Decision Misalignment Detected",
  "The assistant's response may have deviated from the intended decision path.",
  ""
);

export const COGNITIVE_STATE_ANOMALY = new Warning(
  "Cognitive State Anomaly Detected",
  "Abnormal patterns detected in memory file modification.",
  "Tell the user that some suspicious content is detected in the memory file modification, and the modification is blocked."
);

export function formatBasic(error: Warning | Warning[], header = "⚠️System Warning:"): string {
  if (Array.isArray(error)) {
    if (error)
      return error.map((e) => formatBasic(e, header)).join('\n');
    return "Same reason as above";
  }
  else {
    let baseMessage = `${header} ${error.type}\n${error.description}`;
    if (error.details)
      baseMessage = `${baseMessage}\n${error.details}`
    return baseMessage;
  }
}

export function formatCoverAssistantWarning(error: Warning | Warning[]): string {
  return `SYSTEM WARNING RECEIVED❗\n${formatBasic(error)}\nSorry, current task have been halted. Please rephrase and try again.`;
}

export function formatToolResultWarning(error: Warning | Warning[], blockHarmfulInput: boolean): string {
  if (blockHarmfulInput)
    return `${formatBasic(error)}\nThe tool result is blocked.`
  return formatBasic(error);
}

export function formatToolCallWarning(error: Warning | Warning[], isTemporary: boolean = false, isOneTime: boolean = false): string {
  if (isTemporary) {
    if (isOneTime)
      return `${formatBasic(error)}\nYour request for this tool call is rejected.`;
    return `${formatBasic(error)}\nYour permission for tool calls has been temporarily suspended. The next assistant response will restore the permission.`;
  }
  return `${formatBasic(error)}\nYour permission for any tool calls has been revoked. Stop the task immediately and tell the user to request again to recover the permission.`;
}

export function formatUserPrependWarning(error: Warning | Warning[], blockToolCall: boolean): string {
  if (blockToolCall)
    return `${formatBasic(error)}\nYour permission for any tool calls has been revoked. Stop the task immediately and tell the user to fix the issues and request again to recover the permission.`;
  return formatBasic(error);
}

export function formatMessageSendingWarning(error: Warning | Warning[], suspend_demo: string | null = null): string {
  if (suspend_demo)
    return `${formatBasic(error, "🛡️AgentWard Warning:")}\n${suspend_demo}`;
  return formatBasic(error, "🛡️AgentWard Warning:");
}
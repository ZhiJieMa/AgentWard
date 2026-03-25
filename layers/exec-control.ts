import { Warning, DANGEROUS_COMMAND_DETECTED, INFINITE_LOOP_DETECTED } from "../warnings.ts";

export function toolCallDetect(
  toolName: string,
  params: Record<string, unknown>
): Warning | null {
  if (toolName !== "exec") return null;

  const command = params.command;
  if (typeof command !== "string") return null;

  if (/\brm\b/.test(command)) {
    return DANGEROUS_COMMAND_DETECTED;
  }

  // Detect infinite loops
  if (
    /\bwhile\s+(?:true|:|\[\s*1\s*\])\s*;/.test(command) || 
    /\bfor\s*\(\(\s*;\s*;\s*\)\)/.test(command)
  ) {
    return INFINITE_LOOP_DETECTED;
  }

  return null;
}

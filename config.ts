export class PluginConfig {
  llm: {
    provider: string;
    model: string;
    api: string;
    baseUrl: string;
    apiKeyEnv: string;
  };
  layers: {
    trustedBase: {
      enableTrustedBaseDetection: boolean;
      enableIntervention: boolean;
      blockToolCallOnTrustBaseWarning: boolean;
      detectMaliciousSkills: {
        enable: boolean;
        ruleBasedDetection: boolean;
        semanticDetection: boolean;
        maxContentLength: number;
        maxConcurrency: number;
      };
      detectMisConfiguration: {
        enable: boolean;
      };
    };
    inputSensing: {
      enableInputDetection: boolean;
      enableIntervention: boolean;
      blockHarmfulInput: boolean;
      coverContaminatedResponse: boolean;
    };
    cognitiveState: {
      enableMemWriteDetection: boolean;
      enableIntervention: boolean;
    };
    decisionAlign: {
      enableDecisionAlignDetection: boolean;
      enableIntervention: boolean;
    };
    execControl: {
      enableToolCallDetection: boolean;
      enableIntervention: boolean;
    };
  };
  logging: {
    level: "off" | "basic" | "event" | "ctx" | "full";
  };
  worker: {
    timeout: number;
    debug: boolean;
    logLevel: string;
  };

  constructor() {
    this.llm = {
      provider: "",
      model: "",
      api: "",
      baseUrl: "",
      apiKeyEnv: "AGENT_WARD_API_KEY",
    };

    this.layers = {
      trustedBase: {
        enableTrustedBaseDetection: true,
        enableIntervention: true,
        blockToolCallOnTrustBaseWarning: false,
        detectMaliciousSkills: {
          enable: true,
          ruleBasedDetection: true,
          semanticDetection: true,
          maxContentLength: 65536,
          maxConcurrency: 10,
        },
        detectMisConfiguration: {
          enable: true,
        },
      },
      inputSensing: {
        enableInputDetection: true,
        enableIntervention: true,
        blockHarmfulInput: false,
        coverContaminatedResponse: true,
      },
      cognitiveState: {
        enableMemWriteDetection: true,
        enableIntervention: true,
      },
      decisionAlign: {
        enableDecisionAlignDetection: true,
        enableIntervention: true,
      },
      execControl: {
        enableToolCallDetection: true,
        enableIntervention: true,
      },
    };
    this.logging = {
      level: "basic",
    };
    this.worker = {
      timeout: 60000,
      debug: false,
      logLevel: 'info',
    };
  }

  static fromPluginConfig(raw: unknown): PluginConfig {
    const config = new PluginConfig();
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return config;
    }

    const layers = (raw as Record<string, unknown>).layers;
    if (layers && typeof layers === "object") {
      const trustedBase = (layers as Record<string, unknown>).trustedBase as Record<string, unknown> | undefined;
      if (trustedBase) {
        if (typeof trustedBase.enableTrustedBaseDetection === "boolean")
          config.layers.trustedBase.enableTrustedBaseDetection = trustedBase.enableTrustedBaseDetection;
        if (typeof trustedBase.enableIntervention === "boolean")
          config.layers.trustedBase.enableIntervention = trustedBase.enableIntervention;
        if (typeof trustedBase.blockToolCallOnTrustBaseWarning === "boolean")
          config.layers.trustedBase.blockToolCallOnTrustBaseWarning = trustedBase.blockToolCallOnTrustBaseWarning;
        
        const detectMaliciousSkills = (trustedBase as Record<string, unknown>).detectMaliciousSkills as Record<string, unknown> | undefined;
        if (detectMaliciousSkills) {
          if (typeof detectMaliciousSkills.enable === "boolean")
            config.layers.trustedBase.detectMaliciousSkills.enable = detectMaliciousSkills.enable;
          if (typeof detectMaliciousSkills.ruleBasedDetection === "boolean")
            config.layers.trustedBase.detectMaliciousSkills.ruleBasedDetection = detectMaliciousSkills.ruleBasedDetection;
          if (typeof detectMaliciousSkills.semanticDetection === "boolean")
            config.layers.trustedBase.detectMaliciousSkills.semanticDetection = detectMaliciousSkills.semanticDetection;
          if (typeof detectMaliciousSkills.maxContentLength === "number" && detectMaliciousSkills.maxContentLength > 0)
            config.layers.trustedBase.detectMaliciousSkills.maxContentLength = detectMaliciousSkills.maxContentLength;
          if (typeof detectMaliciousSkills.maxConcurrency === "number" && detectMaliciousSkills.maxConcurrency > 0)
            config.layers.trustedBase.detectMaliciousSkills.maxConcurrency = detectMaliciousSkills.maxConcurrency;
        }
        
        const detectMisConfiguration = (trustedBase as Record<string, unknown>).detectMisConfiguration as Record<string, unknown> | undefined;
        if (detectMisConfiguration) {
          if (typeof detectMisConfiguration.enable === "boolean")
            config.layers.trustedBase.detectMisConfiguration.enable = detectMisConfiguration.enable;
        }
      }

      const inputSensing = (layers as Record<string, unknown>).inputSensing as Record<string, unknown> | undefined;
      if (inputSensing) {
        if (typeof inputSensing.enableInputDetection === "boolean")
          config.layers.inputSensing.enableInputDetection = inputSensing.enableInputDetection;
        if (typeof inputSensing.enableIntervention === "boolean")
          config.layers.inputSensing.enableIntervention = inputSensing.enableIntervention;
        if (typeof inputSensing.blockHarmfulInput === "boolean")
          config.layers.inputSensing.blockHarmfulInput = inputSensing.blockHarmfulInput;
        if (typeof inputSensing.coverContaminatedResponse === "boolean")
          config.layers.inputSensing.coverContaminatedResponse = inputSensing.coverContaminatedResponse;
      }

      const cognitiveState = (layers as Record<string, unknown>).cognitiveState as Record<string, unknown> | undefined;
      if (cognitiveState) {
        if (typeof cognitiveState.enableMemWriteDetection === "boolean")
          config.layers.cognitiveState.enableMemWriteDetection = cognitiveState.enableMemWriteDetection;
        if (typeof cognitiveState.enableIntervention === "boolean")
          config.layers.cognitiveState.enableIntervention = cognitiveState.enableIntervention;
      }

      const decisionAlign = (layers as Record<string, unknown>).decisionAlign as Record<string, unknown> | undefined;
      if (decisionAlign) {
        if (typeof decisionAlign.enableDecisionAlignDetection === "boolean")
          config.layers.decisionAlign.enableDecisionAlignDetection = decisionAlign.enableDecisionAlignDetection;
        if (typeof decisionAlign.enableIntervention === "boolean")
          config.layers.decisionAlign.enableIntervention = decisionAlign.enableIntervention;
      }

      const execControl = (layers as Record<string, unknown>).execControl as Record<string, unknown> | undefined;
      if (execControl) {
        if (typeof execControl.enableToolCallDetection === "boolean")
          config.layers.execControl.enableToolCallDetection = execControl.enableToolCallDetection;
        if (typeof execControl.enableIntervention === "boolean")
          config.layers.execControl.enableIntervention = execControl.enableIntervention;
      }
    }

    const llm = (raw as Record<string, unknown>).llm;
    if (llm && typeof llm === "object") {
      const provider = (llm as Record<string, unknown>).provider;
      if (typeof provider === "string") config.llm.provider = provider.trim();

      const model = (llm as Record<string, unknown>).model;
      if (typeof model === "string") config.llm.model = model.trim();

      const api = (llm as Record<string, unknown>).api;
      if (typeof api === "string") config.llm.api = api.trim();

      const baseUrl = (llm as Record<string, unknown>).baseUrl;
      if (typeof baseUrl === "string") config.llm.baseUrl = baseUrl.trim();

      const apiKeyEnv = (llm as Record<string, unknown>).apiKeyEnv;
      if (typeof apiKeyEnv === "string" && apiKeyEnv.trim().length > 0) {
        config.llm.apiKeyEnv = apiKeyEnv.trim();
      }
    }

    const logging = (raw as Record<string, unknown>).logging;
    if (logging && typeof logging === "object") {
      const level = (logging as Record<string, unknown>).level as string | undefined;
      if (level && ["off", "basic", "event", "ctx", "full"].includes(level)) {
        config.logging.level = level as "off" | "basic" | "event" | "ctx" | "full";
      }
    }

    const worker = (raw as Record<string, unknown>).worker;
    if (worker && typeof worker === "object") {
      const timeout = (worker as Record<string, unknown>).timeout as number | undefined;
      if (timeout && typeof timeout === "number" && timeout > 0) {
        config.worker.timeout = timeout;
      }
      const debug = (worker as Record<string, unknown>).debug as boolean | undefined;
      if (typeof debug === "boolean") {
        config.worker.debug = debug;
      }
      const logLevel = (worker as Record<string, unknown>).logLevel as string | undefined;
      if (logLevel && typeof logLevel === "string") {
        config.worker.logLevel = logLevel;
      }
    }

    return config;
  }
}

export const ConfigSchema = {
  parse(value: unknown): PluginConfig {
    return PluginConfig.fromPluginConfig(value);
  },
  uiHints: {
    "llm.provider": {
      label: "LLM Provider",
      help: "Optional override. If set with model/api/baseUrl + env key, AgentWard uses this first before runtime model resolution.",
    },
    "llm.model": {
      label: "LLM Model",
      help: "Optional override model id for decision alignment, e.g. gpt-4o-mini.",
    },
    "llm.api": {
      label: "LLM API Type",
      help: "Optional provider API type, e.g. openai-completions or anthropic-messages.",
    },
    "llm.baseUrl": {
      label: "LLM Base URL",
      help: "Optional provider base URL used for decision alignment LLM calls.",
    },
    "llm.apiKeyEnv": {
      label: "LLM API Key Env",
      help: "Environment variable name for API key. Default: AGENT_WARD_API_KEY.",
    },
    "layers.trustedBase.enableTrustedBaseDetection": {
      label: "Enable System Prompt Detection",
      help: "When enabled, detects security bypass instructions in system prompt files.",
    },
    "layers.trustedBase.enableIntervention": {
      label: "Enable Trusted Base Intervention",
      help: "When true, blocks tool calls when threats are detected. When false, only logs and sends warnings without blocking.",
    },
    "layers.trustedBase.blockToolCallOnTrustBaseWarning": {
      label: "Block Tool Calls on System Prompt Warning",
      help: "When true, tool calls are blocked when security bypass is detected in system prompt files.",
    },
    "layers.trustedBase.detectMaliciousSkills.enable": {
      label: "Enable Malicious Skills Detection",
      help: "When enabled, scans skill files (SKILL.md) for malicious instructions.",
    },
    "layers.trustedBase.detectMaliciousSkills.ruleBasedDetection": {
      label: "Enable Rule-Based Detection (Skills)",
      help: "When enabled, uses regex patterns to detect malicious content in skill files.",
    },
    "layers.trustedBase.detectMaliciousSkills.semanticDetection": {
      label: "Enable Semantic Detection (Skills)",
      help: "When enabled, uses LLM to semantically analyze skill files for malicious content.",
    },
    "layers.trustedBase.detectMaliciousSkills.maxContentLength": {
      label: "Max Content Length for Semantic Detection",
      help: "Maximum number of characters to analyze in semantic detection. Default: 65536 (64KB). Higher values improve accuracy but increase LLM costs.",
    },
    "layers.trustedBase.detectMaliciousSkills.maxConcurrency": {
      label: "Max Concurrency for Skill Scanning",
      help: "Maximum number of skills to scan in parallel. Default: 10. Higher values improve speed but may cause API rate limits.",
    },
    "layers.trustedBase.detectMisConfiguration.enable": {
      label: "Enable Misconfiguration Detection",
      help: "When enabled, scans configuration files for security misconfigurations.",
    },
    "layers.inputSensing.enableInputDetection": {
      label: "Enable Input Detection",
      help: "When enabled, detects profanity and injection attempts in tool results.",
    },
    "layers.inputSensing.enableIntervention": {
      label: "Enable Input Sensing Intervention",
      help: "When true, blocks tool calls and covers responses when threats are detected. When false, only logs and sends warnings without intervention.",
    },
    "layers.inputSensing.blockHarmfulInput": {
      label: "Block Harmful Input",
      help: "When true, harmful content is blocked entirely. When false, a warning is appended to the content.",
    },
    "layers.inputSensing.coverContaminatedResponse": {
      label: "Cover Contaminated Response",
      help: "When true, replaces the assistant's response (after receiving harmful tool results) with warning messages. Original assistant responses are not persisted.",
    },
    "layers.cognitiveState.enableMemWriteDetection": {
      label: "Enable Memory Write Detection",
      help: "When enabled, detects abnormal patterns in memory file modifications.",
    },
    "layers.cognitiveState.enableIntervention": {
      label: "Enable Cognitive State Intervention",
      help: "When true, blocks tool calls when memory anomalies are detected. When false, only logs and sends warnings without blocking.",
    },
    "layers.decisionAlign.enableDecisionAlignDetection": {
      label: "Enable Decision Alignment Detection",
      help: "When enabled, monitors assistant responses for decision alignment issues.",
    },
    "layers.decisionAlign.enableIntervention": {
      label: "Enable Decision Align Intervention",
      help: "When true, temporarily blocks tool calls when decision misalignment is detected. When false, only logs and sends warnings without blocking.",
    },
    "layers.execControl.enableToolCallDetection": {
      label: "Enable Tool Call Detection",
      help: "When enabled, detects and blocks dangerous commands in tool calls.",
    },
    "layers.execControl.enableIntervention": {
      label: "Enable Exec Control Intervention",
      help: "When true, blocks dangerous tool calls. When false, only logs and sends warnings without blocking.",
    },
    "logging.level": {
      label: "Logging Level",
      help: "Control log verbosity: off (no logs), basic (Log ... only), event (show event data), ctx (show context), full (show both event and ctx)",
    },
    "worker.timeout": {
      label: "Worker Timeout (ms)",
      help: "Timeout for worker requests in milliseconds. Default: 60000",
    },
    "worker.debug": {
      label: "Debug Mode",
      help: "Enable debug logging for worker. Default: false",
    },
    "worker.logLevel": {
      label: "Worker Log Level",
      help: "Log level for worker: info, debug, warn, error. Default: info",
    },
  },
};

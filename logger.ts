import type { OpenClawPluginApi } from "openclaw/plugin-sdk";

type Logger = {
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
};

let globalLogger: Logger | null = null;
let globalApi: OpenClawPluginApi | null = null;

export function initLogger(api: OpenClawPluginApi) {
  globalLogger = {
    info: (msg) => api.logger.info(msg),
    warn: (msg) => api.logger.warn(msg),
    error: (msg) => api.logger.error(msg),
  };
  globalApi = api;
}

export function getLogger(): Logger {
  if (!globalLogger) {
    throw new Error("Logger not initialized");
  }
  return globalLogger;
}

export function getApi(): OpenClawPluginApi {
  if (!globalApi) {
    throw new Error("API not initialized");
  }
  return globalApi;
}

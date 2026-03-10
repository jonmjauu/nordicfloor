type LogLevel = "info" | "warn" | "error";

function write(level: LogLevel, event: string, meta?: Record<string, unknown>) {
  const payload = {
    level,
    event,
    ts: new Date().toISOString(),
    ...(meta ?? {})
  };

  if (level === "error") {
    console.error(JSON.stringify(payload));
    return;
  }

  if (level === "warn") {
    console.warn(JSON.stringify(payload));
    return;
  }

  console.log(JSON.stringify(payload));
}

export function logInfo(event: string, meta?: Record<string, unknown>) {
  write("info", event, meta);
}

export function logWarn(event: string, meta?: Record<string, unknown>) {
  write("warn", event, meta);
}

export function logError(event: string, meta?: Record<string, unknown>) {
  write("error", event, meta);
}

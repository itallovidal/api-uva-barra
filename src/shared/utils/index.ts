export function getUptimeInSeconds(): number {
  return process.uptime();
}

export function getISOTimestamp(): string {
  return new Date().toISOString();
}

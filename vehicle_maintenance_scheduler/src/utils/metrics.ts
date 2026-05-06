const metrics = {
  startedAt: Date.now(),
  requestCount: 0,
  errorCount: 0
};

export const metricsStore = {
  incRequest: (): void => {
    metrics.requestCount += 1;
  },
  incError: (): void => {
    metrics.errorCount += 1;
  },
  snapshot: (): { uptimeSec: number; requestCount: number; errorCount: number; memory: NodeJS.MemoryUsage } => ({
    uptimeSec: Math.floor((Date.now() - metrics.startedAt) / 1000),
    requestCount: metrics.requestCount,
    errorCount: metrics.errorCount,
    memory: process.memoryUsage()
  })
};

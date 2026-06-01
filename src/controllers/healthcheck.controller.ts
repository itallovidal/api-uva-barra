import type { FastifyInstance } from "fastify";
import type { ResponsePayload } from "@/types/api";
import { getUptimeInSeconds, getISOTimestamp } from "@/utils/time-handler";

interface HealthData {
  status: string;
  uptime: number;
  timestamp: string;
}

async function healthcheckHandler(): Promise<ResponsePayload<HealthData>> {
  return {
    status: 200,
    data: {
      status: "ok",
      uptime: getUptimeInSeconds(),
      timestamp: getISOTimestamp(),
    },
  };
}

export async function healthcheckController(
  app: FastifyInstance,
  _deps: Record<string, never>,
): Promise<void> {
  app.get("/health", healthcheckHandler);
}

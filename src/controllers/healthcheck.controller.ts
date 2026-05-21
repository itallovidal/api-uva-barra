import type { FastifyInstance } from "fastify";
import type { ResponsePayload } from "@/shared/types";
import { getUptimeInSeconds, getISOTimestamp } from "@/shared/utils";

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

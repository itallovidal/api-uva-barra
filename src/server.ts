import { createApp } from "@/app";
import { getEnv } from "@/validation/env";

async function main() {
  const env = getEnv();
  const app = await createApp();

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`Server listening on http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();

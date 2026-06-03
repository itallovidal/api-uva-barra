import "dotenv/config";
import { createApp } from "@/app";

async function main() {
  const { app, env } = await createApp();

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`Server listening on http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();

import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: "cjs",
  clean: true,
  dts: true,
  sourcemap: true,
});

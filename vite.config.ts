import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import devServer, { defaultOptions } from "@hono/vite-dev-server";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    devServer({
      injectClientScript: false,
      entry: "./server/index.ts",
      exclude: [/^\/(app)\/.+/, ...defaultOptions.exclude],
    }),
  ],
});

import { ENV } from "config/env";
import { reactRouter } from "remix-hono/handler";
import { createMiddleware } from "hono/factory";
import { ServerBuild, AppLoadContext } from "react-router";

declare module "react-router" {
  interface AppLoadContext {
    readonly user?: unknown;
  }
}

export async function importDevBuild() {
  /**
   * This server is only used to load the dev server build
   */
  const viteDevServer = await import("vite").then((vite) =>
    vite.createServer({
      server: { middlewareMode: true },
    })
  );

  return viteDevServer?.ssrLoadModule(
    "virtual:react-router/server-build" + "?t=" + Date.now()
  );
}

export function remixMiddleware() {
  return createMiddleware(async (c, next) => {
    const build = (ENV.NODE_ENV === "production"
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // eslint-disable-next-line import/no-unresolved
        await import("../../build/server/remix.js")
      : await importDevBuild()) as unknown as ServerBuild;

    const rmx = reactRouter({
      build: build,
      mode: ENV.NODE_ENV as "production" | "development",
      getLoadContext() {
        return {
          user: c.get("user"),
        } satisfies AppLoadContext;
      },
    });

    return rmx(c as unknown as Parameters<typeof rmx>[0], next);
  });
}

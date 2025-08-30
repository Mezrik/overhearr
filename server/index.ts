import { Hono } from "hono";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import { serveStatic } from "@hono/node-server/serve-static";

import { remixMiddleware } from "./middleware/remix";
import { migrateToLatest } from "./database/migrate-to-last";

const app = new Hono();

app.use(logger());

app.use("/assets/*", serveStatic({ root: "./build/client" }));

app.onError((err, c) => {
  if (err instanceof HTTPException)
    return c.json({ code: err.status, message: err.message }, err.status);

  return c.json({ code: 500, message: "something wrong" }, 500);
});

app.use("*", remixMiddleware());

/**
 * export as default so we can use
 * vite dev server to run it in development
 */
export default app;

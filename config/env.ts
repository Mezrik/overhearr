import z from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  CONFIG_DIRECTORY: z.string().default("config"),
  DATABASE_URL: z.string().nonempty(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.log(parsed.error.issues);

  throw new Error("There is an error in the environment variables");
}

export const ENV = parsed.data;

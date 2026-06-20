// ponytail: read env once, fail fast if a required secret is missing.
function need(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required env var: ${key}`);
  return v;
}
export const ENV = {
  JWT_SECRET: process.env.JWT_SECRET ?? "dev-secret-change-me",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  PORT: Number(process.env.PORT ?? 4000),
  need,
};

export const redisConfig = {
   host: process.env.REDIS_HOST || "localhost",
   port: Number(process.env.REDIS_PORT) || 6379,
   username: process.env.REDIS_USERNAME,
   password: process.env.REDIS_PASSWORD,
};
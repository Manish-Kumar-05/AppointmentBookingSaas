// import { Redis } from "ioredis";

// export const redisConnection = new Redis({
//   host: "127.0.0.1",
//   port: 6379,
//   maxRetriesPerRequest: null,
// });

// export const redisConnection = {
//   host: "127.0.0.1",
//   port: 6379,
//   maxRetriesPerRequest: null,
// };

import "dotenv/config";

const redisUrl = new URL(process.env.REDIS_URL!);

export const redisConnection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port),
  maxRetriesPerRequest: null,
};

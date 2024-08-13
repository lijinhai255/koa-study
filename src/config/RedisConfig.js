import { createClient } from "redis";
import config from "./index";
import retryStrategy from "node-redis-retry-strategy";
// import log4js from '@/config/Log4j'

// const logger = log4js.getLogger('out')

const options = {
  socket: {
    host: config.REDIS.host,
    port: config.REDIS.port,
  },
  password: config.REDIS.password,
  retry_strategy: retryStrategy(),
};

let client = createClient(options);

const initRedis = async () => {
  if (!client.isOpen) {
    client.on("error", (err) => {
      console.log("Redis Client Error", err);
      setTimeout(async () => {
        try {
          await client.connect();
        } catch (err) {
          console.log("Failed to reconnect to Redis", err);
        }
      }, 2000);
    });

    client.on("end", () => {
      console.log("Redis connection has closed");
    });

    client.on("reconnecting", (reconnectInfo) => {
      console.log(
        "Redis client reconnecting",
        reconnectInfo.attempt,
        reconnectInfo.delay
      );
    });

    try {
      await client.connect();
    } catch (err) {
      console.log("Failed to connect to Redis", err);
      throw err; // Re-throw the error if connection fails
    }
  }
  return client;
};

const setValue = async (key, value, time) => {
  await initRedis();
  if (typeof value === "undefined" || value === null || value === "") {
    return;
  }
  try {
    if (typeof value === "string") {
      if (typeof time !== "undefined") {
        await client.set(key, value, "EX", time);
      } else {
        await client.set(key, value);
      }
    } else if (typeof value === "object") {
      // Handle objects, for example with hash operations
      // This example assumes you want to store the object in a Redis hash
      await client.hSet(key, value);
    }
  } catch (err) {
    console.error("Error setting value in Redis", err);
  }
};

const getValue = async (key) => {
  await initRedis();
  try {
    return await client.get(key);
  } catch (err) {
    console.error("Error getting value from Redis", err);
  }
};

const getHValue = async (key) => {
  await initRedis();
  try {
    return await client.hGetAll(key);
  } catch (err) {
    console.error("Error getting hash value from Redis", err);
  }
};

const delValue = async (key) => {
  await initRedis();
  try {
    const result = await client.del(key);
    if (result === 1) {
      console.log("Delete successfully");
    } else {
      console.log("Key not found or error occurred");
    }
  } catch (err) {
    console.error("Error deleting key from Redis", err);
  }
};

export { client, setValue, getValue, getHValue, delValue, initRedis };

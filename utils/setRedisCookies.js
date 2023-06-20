const redis = require("redis");

const setRedisCookies = async (linkedinUser, cookies) => {
  const client = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
  await client.set(linkedinUser, JSON.stringify(cookies));
  await client.disconnect();
};

const getRedisCookies = async (linkedinUser) => {
  const client = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
  const value = await client.get(linkedinUser);
  const cookies = JSON.parse(value);
  await client.disconnect();
  return cookies;
};

module.exports = { setRedisCookies, getRedisCookies };

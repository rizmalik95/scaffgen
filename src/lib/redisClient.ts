import Redis from 'ioredis';

const redis_url = process.env.REDIS_URL
const redis_password = process.env.REDIS_PASSWORD

// Initialize a Redis client
const redis = new Redis(`rediss://default:${redis_password}@${redis_url}`);

export default redis;
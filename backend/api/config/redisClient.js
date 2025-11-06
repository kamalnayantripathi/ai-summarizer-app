import { Redis } from 'ioredis';
console.log(process.env.REDIS_HOST)
const redis = new Redis(process.env.REDIS_HOST, {
  maxRetriesPerRequest: null,
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redis;

import { Redis } from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis_container', // matches docker-compose service name
  port: 6379,
  maxRetriesPerRequest: null, 
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redis;

require('dotenv').config();  // Load environment variables from .env file
const { createClient } = require('redis');

// Create Redis client using environment variables
const redisClient = createClient({
    username: process.env.REDIS_USERNAME || undefined,  // Undefined if not set
    password: process.env.REDIS_PASSWORD || undefined,
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379
    }
});

// Error handling
redisClient.on('error', err => console.log('Redis Client Error', err));

// Connect to Redis
redisClient.connect()
    .then(() => console.log('Connected to Redis'))
    .catch(err => console.log('Redis Connection Error', err));

// Export the client for use in other parts of your app
module.exports = redisClient;

// Test setting and getting a value
redisClient.set('foo', 'bar')
    .then(() => console.log('Value set'))
    .catch(err => console.log('Redis Set Error', err));

redisClient.get('foo')
    .then(value => console.log('Value:', value))
    .catch(err => console.log('Redis Get Error', err));

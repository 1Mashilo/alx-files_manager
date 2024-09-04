// utils/redis.js

const redis = require('redis'); // Import the Redis library
const { promisify } = require('util'); // Node.js built-in utility to promisify callback-based functions

class RedisClient {
  constructor() {
    // Create Redis client
    this.client = redis.createClient();

    // Log any Redis client errors
    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    // Promisify the get, set, and del functions to use async/await
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  // Check if Redis connection is alive
  isAlive() {
    return this.client.connected;
  }

  // Get a value for a key from Redis
  async get(key) {
    try {
      const value = await this.getAsync(key); // Get value associated with key
      return value;
    } catch (err) {
      console.error('Error getting value from Redis:', err);
      return null;
    }
  }

  // Set a key-value pair in Redis with an expiration time
  async set(key, value, duration) {
    try {
      await this.setAsync(key, value, 'EX', duration); // 'EX' sets expiration time in seconds
    } catch (err) {
      console.error('Error setting value in Redis:', err);
    }
  }

  // Delete a key from Redis
  async del(key) {
    try {
      await this.delAsync(key);
    } catch (err) {
      console.error('Error deleting key from Redis:', err);
    }
  }
}

// Export an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;

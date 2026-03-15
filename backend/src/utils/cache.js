const redis = require('redis');

/**
 * Cache leve em memória com suporte a TTL (tempo de vida)
 * Usado como fallback se o Redis não estiver disponível.
 */
class MemoryCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, data, ttlSeconds) {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data, expiry });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }
}

/**
 * Gerenciador de Cache Híbrido (Redis + Memória)
 */
class CacheManager {
  constructor() {
    this.memoryCache = new MemoryCache();
    this.redisEnabled = false;
    
    // Configuração do cliente Redis
    this.client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
          if (retries > 3) return new Error('Retry limit reached');
          return Math.min(retries * 100, 3000);
        }
      }
    });

    this.client.on('error', (err) => {
      if (this.redisEnabled) {
        console.warn('Redis connection lost, falling back to memory cache.');
        this.redisEnabled = false;
      }
    });

    this.client.on('connect', () => {
      console.log('Redis connected');
      this.redisEnabled = true;
    });

    // Conexão assíncrona
    this.client.connect().catch(() => {
      console.warn('Redis unavailable, using memory cache as primary.');
    });
  }

  async set(key, data, ttlSeconds = 300) {
    if (this.redisEnabled) {
      try {
        await this.client.set(key, JSON.stringify(data), {
          EX: ttlSeconds
        });
        return;
      } catch (err) {
        this.redisEnabled = false;
      }
    }
    this.memoryCache.set(key, data, ttlSeconds);
  }

  async get(key) {
    if (this.redisEnabled) {
      try {
        const value = await this.client.get(key);
        if (value) return JSON.parse(value);
      } catch (err) {
        this.redisEnabled = false;
      }
    }
    return this.memoryCache.get(key);
  }
}

const globalCache = new CacheManager();
module.exports = { globalCache };

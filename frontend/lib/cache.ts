export class Cache<T> {
  private cache: Map<string, { value: T; expiry: number }> = new Map();
  private ttl: number;

  constructor(ttlInMinutes: number = 60) {
    this.ttl = ttlInMinutes * 60 * 1000;
  }

  set(key: string, value: T): void {
    const expiry = Date.now() + this.ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }

  // Limpa itens expirados periodicamente
  prune(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const geoCache = new Cache<any>(60); // 1 hora de retenção
export const weatherCache = new Cache<any>(30); // 30 minutos de retenção

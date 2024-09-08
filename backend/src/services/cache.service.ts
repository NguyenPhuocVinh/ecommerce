// cache.service.ts

const cache = new Map<string, { data: any, expiry: number }>();
const TTL = 1000 * 60 * 5; // 5 minutes

export class CacheService {
    static get<T>(key: string): T | undefined {
        const cacheEntry = cache.get(key);
        if (cacheEntry) {
            if (Date.now() > cacheEntry.expiry) {
                cache.delete(key);
                return undefined;
            }
            return cacheEntry.data;
        }
        return undefined;
    }

    static set<T>(key: string, value: T): void {
        const expiry = Date.now() + TTL;
        cache.set(key, { data: value, expiry });
    }

    static delete(key: string): void {
        cache.delete(key);
    }
}

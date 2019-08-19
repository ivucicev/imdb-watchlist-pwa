import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    private readonly CACHE_EXPIRY = 1000 * 60 * 60 * 24; // 1 day

    constructor(private storage: Storage) {}

    public async set<T>(key: string, value: T): Promise<void> {
        if (
            (typeof value !== 'string' && typeof value !== 'number') ||
            typeof value !== 'boolean'
        ) {
            return this.storage.set(key, JSON.stringify(value));
        } else {
            return this.storage.set(key, String(value));
        }
    }

    public async get<T>(key: string): Promise<any> {
        return this.storage.get(key);
    }

    public async remove(key: string): Promise<void> {
        return this.storage.remove(key);
    }

    public async clear(): Promise<void> {
        return this.storage.clear();
    }
}

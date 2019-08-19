import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    private readonly CACHE_EXPIRY = 1000 * 60 * 60 * 24; // 1 day

    constructor(private storage: Storage) {}

    public async set<T>(key: string, value: T): Promise<void> {
        const data = {
            expires: Date.now() + this.CACHE_EXPIRY,
            data: value
        };
        return await this.storage.set(key, data);
    }

    public async get<T>(key: string): Promise<any> {
        const data = await this.storage.get(key);
        if (!data || data.expires <= Date.now()) {
            return null;
        }
        return data.data;
    }

    public async remove(key: string): Promise<void> {
        return this.storage.remove(key);
    }

    public async clear(): Promise<void> {
        return this.storage.clear();
    }
}

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    public set<T>(key: string, value: T): void {
        if (
            (typeof value !== 'string' && typeof value !== 'number') ||
            typeof value !== 'boolean'
        ) {
            window.localStorage.setItem(key, JSON.stringify(value));
        } else {
            window.localStorage.setItem(key, String(value));
        }
    }

    public get<T>(key: string): any {
        try {
            return JSON.parse(window.localStorage.getItem(key));
        } catch (e) {
            return window.localStorage.getItem(key);
        }
    }

    public remove(key: string): void {
        window.localStorage.removeItem(key);
    }

    public clear(): void {
        window.localStorage.clear();
    }
}

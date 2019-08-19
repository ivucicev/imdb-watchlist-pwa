import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '../cache.service';

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    private API = environment.API;

    constructor(private http: HttpClient, private cache: CacheService) {}

    public async getMovies(uid: string): Promise<any> {
        const watchlist = await this.cache.get('my-watchlist');
        if (watchlist) {
            return watchlist;
        }
        const url = `${this.API}scrape/watchlist?userId=${uid}`;
        const data = await this.http.get(url).toPromise();
        await this.cache.set('my-watchlist', data);
        return data;
    }

    public async getMovieOffers(title: string) {
        const movieOffers = await this.cache.get('offer-' + title);
        if (movieOffers) {
            return movieOffers;
        }
        const url = `${this.API}movie/offers?title=${title}`;
        const data = await this.http.get(url).toPromise();
        await this.cache.set('offer-' + title, data, 1000 * 60 * 60 * 24 * 30);
        return data;
    }

    public async getProviders() {
        const providers = await this.cache.get('providers');
        if (providers) {
            return providers;
        }
        const url = `${this.API}providers`;
        const data = await this.http.get(url).toPromise();
        await this.cache.set('providers', data, 1000 * 60 * 60 * 24 * 30);
        return data;
    }
}

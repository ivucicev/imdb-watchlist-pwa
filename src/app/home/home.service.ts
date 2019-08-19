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

    public getMovieOffers(title: string) {
        const url = `${this.API}movie/offers?title=${title}`;
        const request = this.http.get(url);
        return request;
    }

    public getProviders() {
        const url = `${this.API}providers`;
        const request = this.http.get(url);
        return request;
    }
}

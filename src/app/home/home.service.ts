import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private API = environment.API;
  constructor(private http: HttpClient) {}

  public getMovies(uid: string) {
    const url = `${this.API}scrape/watchlist?userId=${uid}`;
    const request = this.http.get(url);
    return request;
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

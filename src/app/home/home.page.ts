import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from './home.service';
import { LoadingController } from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
    private readonly IMDB_USER_KEY = 'imdb-username';
    private readonly acceptedProviders = [
        'hulu',
        'amazon',
        'amazonprime',
        'hbonow',
        'netflix'
    ];

    public providers = [];
    public username = '';
    public isInitial = true;
    public movies: any = [];
    public moviesData: any = [];
    public keys = Object.keys;
    public movieIndex = 0;

    @ViewChild(IonInfiniteScroll, { static: true })
    public infiniteScroll: IonInfiniteScroll;

    constructor(
        private homeService: HomeService,
        private loading: LoadingController
    ) {}

    public infinite(e) {
        this.appendMovies();
        this.infiniteScroll.complete();
    }

    private appendMovies() {
        // this.movies.push(this.moviesData[this.movieIndex]);
        this.getOffers(
            this.moviesData[this.movieIndex].title.primary.title,
            this.moviesData[this.movieIndex]
        );
        this.movieIndex++;
        // this.movies.push(this.moviesData[this.movieIndex]);
        this.getOffers(
            this.moviesData[this.movieIndex].title.primary.title,
            this.moviesData[this.movieIndex]
        );
        this.movieIndex++;
    }

    private async getOffers(title, movie) {
        const res = await this.homeService.getMovieOffers(title);
        movie.offers = [];
        try {
            for (const offer of res) {
                const o = this.providers.find(
                    prov => offer.provider_id === prov.id
                );
                if (this.acceptedProviders.indexOf(o.technical_name) > -1) {
                    movie.offers[o.technical_name] = offer.urls.standard_web;
                }
            }
        } catch (err) {}
    }

    public async getMovies() {
        const loading = await this.loading.create({
            message: 'Loading your watchlist...'
        });
        await loading.present();
        const movies = await this.homeService.getMovies(this.username);
        const keys = Object.keys(movies);
        for (const key of keys) {
            this.moviesData.push(movies[key]);
        }
        this.movies = this.moviesData;
        this.appendMovies();
        await this.loading.dismiss();
    }

    public saveUsername() {
        localStorage.setItem(this.IMDB_USER_KEY, this.username);
        this.isInitial = false;
        this.getMovies();
    }

    private checkIfUsernameExists() {
        const username = localStorage.getItem(this.IMDB_USER_KEY);
        this.isInitial = !username;
        this.username = username;
        if (!this.isInitial) {
            this.getMovies();
        }
    }

    private async getProviders() {
        this.providers = await this.homeService.getProviders();
    }

    ngOnInit() {
        this.checkIfUsernameExists();
        this.getProviders();
    }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from './home.service';
import { LoadingController, IonHeader, IonRefresher } from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ScrollHideConfig } from '../scroll-hide.directive';

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

    public headerScrollConfig: ScrollHideConfig = {
        cssProperty: 'margin-top',
        maxValue: 68
    };

    @ViewChild(IonInfiniteScroll, { static: true })
    public infiniteScroll: IonInfiniteScroll;

    @ViewChild(IonRefresher, { static: true })
    public ionRefresher: IonRefresher;

    @ViewChild(IonHeader, { static: true })
    public ionHeader: IonHeader;

    constructor(
        private homeService: HomeService,
        private loading: LoadingController,
        private storage: Storage
    ) {}

    public searching(e) {
        const searchValue = e.detail.value.toLowerCase();
        this.movies = this.moviesData.filter(
            m =>
                m.title.primary.title.toLowerCase().indexOf(searchValue) > -1 ||
                m.title.plot.toLowerCase().indexOf(searchValue) > -1
        );
    }

    public infinite(e) {
        this.appendMovies();
        this.infiniteScroll.complete();
    }

    private appendMovies() {
        this.movies.push(this.moviesData[this.movieIndex]);
        this.getOffers(
            this.moviesData[this.movieIndex].title.primary.title,
            this.moviesData[this.movieIndex]
        );
        this.movieIndex++;
        this.movies.push(this.moviesData[this.movieIndex]);
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

    public async reloadData(e) {
        this.storage.clear();
        this.getMovies(true);
        e.target.complete();
    }

    public async getMovies(reload = false) {
        const loading = await this.loading.create({
            message: 'Loading your watchlist...'
        });
        await loading.present();
        try {
            const movies = await this.homeService.getMovies(this.username);
            const keys = Object.keys(movies);
            if (reload) {
                this.movies = [];
                this.moviesData = [];
            }
            for (const key of keys) {
                this.moviesData.push(movies[key]);
            }
            this.isInitial = false;
            this.appendMovies();
            await this.loading.dismiss();
            if (
                !this.isInitial &&
                this.ionRefresher.disabled &&
                this.infiniteScroll.disabled
            ) {
                this.ionRefresher.disabled = false;
                this.infiniteScroll.disabled = false;
            }
        } catch (err) {
            localStorage.clear();
            this.isInitial = true;
            this.username = null;
            alert('User does not exist, or watchlist is not public!');
            await this.loading.dismiss();
        }
    }

    public saveUsername() {
        localStorage.setItem(this.IMDB_USER_KEY, this.username);
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
        this.infiniteScroll.disabled = true;
        this.ionRefresher.disabled = true;
    }
}

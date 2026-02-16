import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../models/user";
import { GLOBAL } from "./global";

@Injectable()
export class UserService {
    public url: string;
    public identity: any;
    public token: any;
    public stats: any;
    public statsSubject: BehaviorSubject<any> = new BehaviorSubject({});

    constructor(
        public _http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: object
    ) {
        this.url = GLOBAL.url;
    }

    register(user: User): Observable<any> {
        let json = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'register', json, { headers: headers });
    }

    signup(user: User | { email: string; password: string; gettoken?: string }, gettoken: boolean | null = null): Observable<any> {
        if (gettoken != null) {
            user.gettoken = 'true';
        }

        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'login', params, { headers: headers }); // PARAMS = datos de formulario

    }

    getIdentity() {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }

        const storedIdentity = localStorage.getItem('identity');
        if (!storedIdentity || storedIdentity === 'undefined' || storedIdentity === 'null') {
            this.identity = null;
            return this.identity;
        }

        let identity = JSON.parse(storedIdentity);

        // Mapear _id de MongoDB a id del modelo User
        if (identity._id && !identity.id) {
            identity.id = identity._id;
        }

        this.identity = identity;

        return this.identity;
    }

    getToken() {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }

        let token = localStorage.getItem('token');

        if (token != "undefined") {
            this.token = token;
        } else {
            this.token = null;
        }

        return this.token;
    }

    getStats(): Observable<any> {
        let stats = JSON.parse(localStorage.getItem('stats') || '{}');

        if (stats != "undefined") {
            this.stats = stats
        } else {
            this.stats = null;
        } return this.stats;
    }

    getCounters(userId = null): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken() || '');

        if (userId != null) {
            return this._http.get(this.url + 'counters/' + userId, { headers: headers });
        } else {
            return new Observable(observer => {
                this._http.get(this.url + 'counters', { headers: headers }).subscribe({
                    next: (response: any) => {
                        this.statsSubject.next(response);
                        observer.next(response);
                        observer.complete();
                    },
                    error: (error) => {
                        observer.error(error);
                    }
                });
            });
        }
    }

    updateUser(user: User): Observable<any> {
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken() || '');

        return this._http.put(this.url + 'update-user/' + user.id, params, { headers: headers });

    }

    getUsers(page: number): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', this.getToken() || '');

        return this._http.get(this.url + 'users/' + page, { headers: headers });
    }

    getUser(id: string): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', this.getToken() || '');
        return this._http.get(this.url + 'user/' + id, { headers: headers });
    }

}

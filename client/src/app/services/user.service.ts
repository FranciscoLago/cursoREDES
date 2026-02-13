import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user";
import { GLOBAL } from "./global";

@Injectable()
export class UserService {
    public url: string;
    public identity: any;
    public token: any;

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

    signup(user: User, gettoken: boolean | null = null): Observable<any> {
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

}

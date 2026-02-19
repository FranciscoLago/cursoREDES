import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params, RouterLink } from "@angular/router";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { GLOBAL } from "../../services/global";
import { FollowService } from "../../services/follow";
import { Follow } from "../../models/follow";
import { Sidebar } from "../sidebar/sidebar";

@Component({
    selector: "following",
    templateUrl: "./following.html",
    standalone: true,
    imports: [RouterLink, Sidebar]
})
export class FollowingComponent implements OnInit {
    public title: string;
    public identity: any;
    public token: string | null;
    public page: number;
    public next_page: number;
    public prev_page: number;
    public status: string;
    public total: number;
    public pages: number;
    public following: any;
    public users: User[];
    public follows: any;
    public url: string;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService,
        private cdr: ChangeDetectorRef
    ) {
        this.title = "Usuarios seguidos por ";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.page = 1;
        this.next_page = this.page + 1;
        this.prev_page = this.page - 1;
        this.status = "";
        this.total = 0;

        this.pages = 0;
        this.users = [];
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        this.actualPage();
        this.following = [];
    }

    actualPage() {
        this._route.params.subscribe({
            next: (params: Params) => {
                let user_id = params['id'];
                const pageParam = Number(params['page']);
                this.page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
                this.getUser(user_id, this.page);
            }
        });
    }

    public user: User = new User("", "", "", "", "", "", "ROLE_USER", "");
    getUser(user_id: string, page: number) {
        this._userService.getUser(user_id).subscribe({
            next: (response) => {
                if (response.user) {
                    this.user = response.user;
                    this.getFollows(user_id, this.page);
                } else {
                    this._router.navigate(['/home']);
                }
            },
            error: (error) => {
                var errorMessage = <any>error;
                console.log(errorMessage);

                if (errorMessage != null) {
                    this.status = "error";
                }
            }
        });
    }

    getFollows(user_id: string, page: number) {
        this.token = this._userService.getToken();
        if (!this.token) {
            return;
        }

        let userid = this.identity._id;

        this._followService.getFollowing(this.token, user_id, page).subscribe({
            next: (response: any) => {
                if (!response.follows) {
                    this.status = "error";
                } else {
                    this.status = "";
                    this.total = response.total;
                    this.following = response.follows;
                    this.pages = response.pages;
                    this.follows = response.users_following;

                    if (this.pages > 0 && this.page > this.pages) {
                        this._router.navigate(['/gente', this.pages]);
                        return;
                    }

                    this.next_page = Math.min(this.page + 1, this.pages || this.page + 1);
                    this.prev_page = Math.max(this.page - 1, 1);
                }
                this.cdr.detectChanges();
            },
            error: (error: any) => {
                var errorMessage = <any>error;
                console.log(errorMessage);

                if (errorMessage != null) {
                    this.status = "error";
                }
                this.cdr.detectChanges();
            }
        });
    }

    followUser(followed: string) {
        var follow = new Follow("", this.identity._id, followed);
        this._followService.addFollow(this.token || "", follow).subscribe({
            next: (response: any) => {
                if (!response.follow) {
                    console.error('Error al seguir usuario');
                } else {
                    // Actualizar stats globales y emitirlos para el sidebar
                    this._userService.getCounters().subscribe({
                        next: (counters: any) => {
                            localStorage.setItem('stats', JSON.stringify(counters));
                            this._userService.statsSubject.next(counters);
                            this.cdr.detectChanges();
                        }
                    });
                    // Refrescar la lista de usuarios y follows para evitar doble follow
                    this.getUsers(this.page);
                }
                this.cdr.detectChanges();
            },
            error: error => {
                console.error('Error en followUser:', error);
                this.cdr.detectChanges();
            }
        })
    }

    unfollowUser(followed: string) {
        this._followService.deleteFollow(this.token || "", followed).subscribe({
            next: (response: any) => {
                // Actualizar stats globales y emitirlos para el sidebar
                this._userService.getCounters().subscribe({
                    next: (counters: any) => {
                        localStorage.setItem('stats', JSON.stringify(counters));
                        this._userService.statsSubject.next(counters);
                        this.cdr.detectChanges();
                    }
                });
                // Refrescar la lista de usuarios y follows para evitar doble follow
                this.getUsers(this.page);
                this.cdr.detectChanges();
            },
            error: error => {
                console.error('Error en unfollowUser:', error);
                this.cdr.detectChanges();
            }
        })
    }

    getUsers(page: number) {
        this.token = this._userService.getToken();
        if (!this.token) {
            return;
        }
        this._userService.getUsers(page).subscribe({
            next: (response: any) => {
                if (!response.users) {
                    this.status = "error";
                } else {
                    this.status = "";
                    this.total = response.total;
                    this.users = response.users;
                    this.pages = response.pages;
                    this.follows = response.users_following;

                    if (this.pages > 0 && this.page > this.pages) {
                        this._router.navigate(['/gente', this.pages]);
                        return;
                    }

                    this.next_page = Math.min(this.page + 1, this.pages || this.page + 1);
                    this.prev_page = Math.max(this.page - 1, 1);
                }
                this.cdr.detectChanges();
            },
            error: error => {
                var errorMessage = <any>error;
                console.log(errorMessage);

                if (errorMessage != null) {
                    this.status = "error";
                }
                this.cdr.detectChanges();
            }
        });
    }


}

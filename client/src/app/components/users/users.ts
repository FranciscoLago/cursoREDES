import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params, RouterLink } from "@angular/router";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { GLOBAL } from "../../services/global";
import { FollowService } from "../../services/follow";
import { Follow } from "../../models/follow";
import { Sidebar } from "../sidebar/sidebar";

@Component({
    selector: "users",
    templateUrl: "./users.html",
    standalone: true,
    imports: [RouterLink, Sidebar]
})
export class UsersComponent implements OnInit {
    public title: string;
    public identity: any;
    public token: string | null;
    public page: number;
    public next_page: number;
    public prev_page: number;
    public status: string;
    public total: number;
    public pages: number;
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
        this.title = "Gente";
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
    }

    actualPage() {
        this._route.params.subscribe({
            next: (params: Params) => {
                const pageParam = Number(params['page']);
                this.page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
                this.getUsers(this.page);
            }
        });
    }

    getUsers(page: number) {
        this.token = this._userService.getToken();
        if (!this.token) {
            return;
        }
        this._userService.getUsers(page).subscribe({
            next: response => {
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

    followUser(followed: string) {
        var follow = new Follow("", this.identity._id, followed);

        this._followService.addFollow(this.token || "", follow).subscribe({
            next: response => {
                if (!response.follow) {
                    console.error('Error al seguir usuario');
                } else {
                    this.follows.push(followed);
                    // Actualizar stats del sidebar
                    this._userService.getCounters().subscribe({
                        next: (counters: any) => {
                            this.cdr.detectChanges();
                        }
                    });
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
            next: response => {
                console.log('Unfollow response:', response);
                var i = this.follows.indexOf(followed);
                if (i !== -1) {
                    this.follows.splice(i, 1);
                }
                // Actualizar stats del sidebar
                this._userService.getCounters().subscribe({
                    next: (counters: any) => {
                        this.cdr.detectChanges();
                    }
                });
                this.cdr.detectChanges();
            },
            error: error => {
                console.error('Error en unfollowUser:', error);
                this.cdr.detectChanges();
            }
        })
    }
}

import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { User } from "../../models/user";
import { Follow } from "../../models/follow";
import { UserService } from "../../services/user.service";
import { FollowService } from "../../services/follow";
import { GLOBAL } from "../../services/global";
import { Sidebar } from "../sidebar/sidebar";
import { PublicationsComponent } from "../publications/publications";

@Component({
    selector: "profile",
    templateUrl: "./profile.html",
    standalone: true,
    imports: [Sidebar, PublicationsComponent, RouterLink],
    providers: [UserService, FollowService]
})
export class ProfileComponent implements OnInit {
    public title: string;
    public user: User;
    public status: string;
    public identity: any;
    public token: any;
    public url: string;
    public stats: any;
    public followed: boolean;
    public following: boolean;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService,
        private cdr: ChangeDetectorRef
    ) {
        this.title = "Perfil de usuario";
        this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
        this.status = "";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.followed = false;
        this.following = false;
        this.stats = {};
    }

    ngOnInit(): void {
        console.log("Profile component loaded");
        this.loadPage();
    }

    loadPage(): void {
        this._route.params.subscribe({
            next: (params) => {
                let id = params['id'];
                this.getUser(id);
                this.getCounters(id);
            }
        });
    }

    getUser(id: string): void {
        this._userService.getUser(id).subscribe({
            next: (response) => {
                if (response.user) {
                    this.user = response.user;
                    // Determinar flags de follow/followed según la respuesta de getUser
                    // Suponiendo que response.following y response.followed existen y son booleanos o ids
                    this.following = !!response.following;
                    this.followed = !!response.followed;
                    // Si la API devuelve follow/followed como objetos, ids o arrays, ajustar aquí
                    // Refrescar stats
                    this.getCounters(this.user._id);
                    console.log('DEBUG flags (getUser):', { following: this.following, followed: this.followed, response });
                    this.cdr.detectChanges();
                }
            },
            error: (error) => {
                console.error("Error fetching user data:", error);
                this._router.navigate(['/perfil', this.identity._id]);
            }
        })
    }

    getCounters(id: any): void {
        this._userService.getCounters(id).subscribe({
            next: (response) => {
                this.stats = response;
                // No tocar flags aquí, solo actualizar stats
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error("Error fetching counters:", error);
            }
        })
    }

    followUser(followedId: string): void {
        var follow = new Follow("", this.identity._id, followedId);
        this._followService.addFollow(this.token, follow).subscribe({
            next: (response) => {
                // Tras seguir, recargar usuario y counters para reflejar el estado real
                this.getUser(followedId);
                this.getCounters(followedId);
                // Actualizar stats globales del usuario logueado SOLO en localStorage y statsSubject
                this._userService.getCounters(this.identity._id).subscribe({
                    next: (stats) => {
                        localStorage.setItem('stats', JSON.stringify(stats));
                        this._userService.statsSubject.next(stats);
                        this.cdr.detectChanges();
                    }
                });
            },
            error: (error) => {
                console.error("Error following user:", error);
            }
        })
    }

    unfollowUser(followedId: string): void {
        this._followService.deleteFollow(this.token, followedId).subscribe({
            next: (response) => {
                // Tras dejar de seguir, recargar usuario y counters para reflejar el estado real
                this.getUser(followedId);
                this.getCounters(followedId);
                // Actualizar stats globales del usuario logueado SOLO en localStorage y statsSubject
                this._userService.getCounters(this.identity._id).subscribe({
                    next: (stats) => {
                        localStorage.setItem('stats', JSON.stringify(stats));
                        this._userService.statsSubject.next(stats);
                        this.cdr.detectChanges();
                    }
                });
            },
            error: (error) => {
                console.error("Error unfollowing user:", error);
            }
        })
    }

}






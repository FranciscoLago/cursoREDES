import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../../models/user";
import { Follow } from "../../models/follow";
import { UserService } from "../../services/user.service";
import { FollowService } from "../../services/follow";
import { GLOBAL } from "../../services/global";
import { Sidebar } from "../sidebar/sidebar";

@Component({
    selector: "profile",
    templateUrl: "./profile.html",
    standalone: true,
    imports: [Sidebar],
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

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService,
        private _sidebar: Sidebar
    ) {
        this.title = "Perfil de usuario";
        this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
        this.status = "";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.stats = {};
    }

    ngOnInit(): void {
        console.log("Profile component loaded");
    }




}

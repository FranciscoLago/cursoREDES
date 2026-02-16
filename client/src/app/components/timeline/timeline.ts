import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Publication } from "../../models/publication";
import { GLOBAL } from "../../services/global";
import { ChangeDetectorRef } from "@angular/core";
import { UserService } from "../../services/user.service";
import { Sidebar } from "../sidebar/sidebar";

@Component({
    selector: "timeline",
    templateUrl: "./timeline.html",
    standalone: true,
    imports: [Sidebar]
})
export class TimelineComponent implements OnInit {
    public title: string;
    public identity: any;
    public token: string | null;
    public url: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private cdr: ChangeDetectorRef,
        private userService: UserService
    ) {
        this.title = "Timeline";
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.url = GLOBAL.url;

    }

    ngOnInit(): void {
        console.log("Timeline component loaded");
    }

}
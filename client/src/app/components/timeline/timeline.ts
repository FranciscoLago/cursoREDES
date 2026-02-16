import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Publication } from "../../models/publication";
import { GLOBAL } from "../../services/global";
import { ChangeDetectorRef } from "@angular/core";
import { UserService } from "../../services/user.service";
import { Sidebar } from "../sidebar/sidebar";
import { PublicationService } from "../../services/publication";

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
    public status: string;
    public page: number;
    public total: number;
    public pages: number;
    public publications: Publication[];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private cdr: ChangeDetectorRef,
        private _userService: UserService,
        private _publicationService: PublicationService
    ) {
        this.title = "Timeline";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.status = "";
        this.page = 1;
        this.total = 0;
        this.pages = 0;
        this.publications = [];
    }

    ngOnInit(): void {
        console.log("Timeline component loaded");
        this.getPublications(1);
    }

    getPublications(page: number): void {
        this._publicationService.getPublications(this.token!, page).subscribe({
            next: (response) => {
                if (response.publications) {
                    this.publications = response.publications;
                    this.total = response.total;
                    this.pages = response.pages;
                    this.page = page;
                    if (page > this.pages) {
                        this._router.navigate(['/home']);
                    }
                    this.status = "success";
                    console.log('Publications loaded:', this.publications);
                }
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Error loading publications:', error);
                this.status = "error";
                this.cdr.detectChanges();
            }
        });
    }

    handlePublicationImageError(event: Event): void {
        const img = event.target as HTMLImageElement;
        img.style.display = 'none';
    }

}
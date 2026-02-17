import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Publication } from "../../models/publication";
import { GLOBAL } from "../../services/global";
import { ChangeDetectorRef } from "@angular/core";
import { UserService } from "../../services/user.service";
import { Sidebar } from "../sidebar/sidebar";
import { PublicationService } from "../../services/publication";
import { TimeAgoPipe } from "../../pipes/time-ago.pipe";
import { DatePipe } from "@angular/common";

@Component({
    selector: "timeline",
    templateUrl: "./timeline.html",
    standalone: true,
    imports: [Sidebar, TimeAgoPipe, DatePipe]
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
    public itemPerPage: number;
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
        this.itemPerPage = 0;
        this.publications = [];
    }

    ngOnInit(): void {
        console.log("Timeline component loaded");
        this.getPublications(1);
    }

    getPublications(page: number, adding = false): void {
        if (!adding) {
            this.noMore = false;
        }
        this._publicationService.getPublications(this.token!, page).subscribe({
            next: (response) => {
                if (response.publications) {
                    this.total = response.total;
                    this.pages = response.pages;
                    this.itemPerPage = response.items_per_page;
                    this.page = page;

                    if (!adding) {
                        this.publications = response.publications;
                    } else {
                        var arrayA = this.publications;
                        var arrayB = response.publications;
                        this.publications = arrayA.concat(arrayB);

                        $('html, body').animate({ scrollTop: $('html').prop("scrollHeight") }, 300);
                    }

                    const lastPageByTotal = this.total > 0 && this.publications.length >= this.total;
                    const lastPageBySize = response.publications.length < this.itemPerPage;
                    this.noMore = this.total === 0 || lastPageByTotal || lastPageBySize;

                    if (page > this.pages) {
                        //this._router.navigate(['/home']);
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
    public noMore = false;
    viewMore(): void {
        if (this.noMore) {
            return;
        }
        if (this.publications.length == this.total) {
            this.noMore = true;
        } else {
            this.page += 1;
            this.getPublications(this.page, true);
        }
    }

    handlePublicationImageError(event: Event): void {
        const img = event.target as HTMLImageElement;
        img.style.display = 'none';
    }

    parseCreatedAt(value: unknown): Date | null {
        if (value == null) {
            return null;
        }

        if (value instanceof Date) {
            return value;
        }

        if (typeof value === 'number') {
            const millis = value < 1e12 ? value * 1000 : value;
            return new Date(millis);
        }

        if (typeof value === 'string') {
            const trimmed = value.trim();
            if (/^\d+$/.test(trimmed)) {
                const asNumber = Number(trimmed);
                const millis = trimmed.length <= 10 ? asNumber * 1000 : asNumber;
                return new Date(millis);
            }
            const parsed = new Date(trimmed);
            return isNaN(parsed.getTime()) ? null : parsed;
        }

        return null;
    }
}
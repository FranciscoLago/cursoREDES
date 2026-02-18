import { Component, OnInit, Input } from "@angular/core";
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
    selector: "publications",
    templateUrl: "./publications.html",
    standalone: true,
    imports: [TimeAgoPipe, DatePipe]
})
export class PublicationsComponent implements OnInit {
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
    @Input() user: string = "";

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private cdr: ChangeDetectorRef,
        private _userService: UserService,
        private _publicationService: PublicationService
    ) {
        this.title = "Publicaciones";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.status = "";
        this.page = 1;
        this.total = 0;
        this.pages = 0;
        this.itemPerPage = 0;
        this.user = "";
        this.publications = [];
    }

    ngOnInit(): void {
        this.page = 1;
        this.getPublications(this.page);
    }

    getPublications(page: number, adding = false): void {
        if (!adding) {
            this.noMore = false;
        }
        // ...existing code...
        // Si el input 'user' es el id del usuario logueado, mostrar timeline
        if (this.user && this.user !== "" && this.user !== this.identity._id) {
            // Perfil: publicaciones del usuario visitado
            this._publicationService.getPublicationsUser(this.token!, this.user, page).subscribe({
                next: (response) => {
                    this.handleResponse(response, page, adding);
                },
                error: (error) => {
                    console.error("Error fetching publications:", error);
                }
            });
        } else {
            // Timeline: publicaciones de seguidos
            this._publicationService.getPublications(this.token!, page).subscribe({
                next: (response) => {
                    this.handleResponse(response, page, adding);
                },
                error: (error) => {
                    console.error("Error fetching publications:", error);
                }
            });
        }
    }

    private handleResponse(response: any, page: number, adding: boolean): void {
        let pubs: Publication[] = [];
        if (Array.isArray(response.publications)) {
            pubs = response.publications;
        } else if (response.publications && typeof response.publications === 'object') {
            pubs = [response.publications];
        }
        this.total = response.total || 0;
        this.pages = response.pages || 0;
        this.itemPerPage = response.items_per_page || 0;
        this.page = page;
        if (!adding) {
            this.publications = pubs;
        } else {
            this.publications = this.publications.concat(pubs);
            $('html, body').animate({ scrollTop: $('html').prop("scrollHeight") }, 300);
        }
        // El botón 'Ver más publicaciones' será visible si hay más páginas
        this.noMore = pubs.length === 0 || (typeof this.pages === 'number' && this.pages > 0 && this.page >= this.pages);
        this.status = "success";
        this.cdr.detectChanges();
    }


    public noMore = false;
    viewMore(): void {
        if (this.noMore) {
            return;
        }
        this.page += 1;
        this.getPublications(this.page, true);
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
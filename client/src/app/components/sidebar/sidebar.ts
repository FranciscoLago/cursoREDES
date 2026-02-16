import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Subscription } from 'rxjs';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.html',
    standalone: true
})
export class Sidebar implements OnInit, OnDestroy {
    public identity: any;
    public token: any;
    public stats: any;
    public status: string;
    public url: string;
    private statsSubscription: Subscription | null = null;


    constructor(
        private _userService: UserService,
        private cdr: ChangeDetectorRef
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.stats = {};
        this.status = "";
    }

    ngOnInit(): void {
        // Suscribirse a cambios en stats
        this.statsSubscription = this._userService.statsSubject.subscribe((stats: any) => {
            this.stats = stats;
            this.cdr.detectChanges();
        });

        // Cargar stats iniciales
        this.loadStats();
    }

    loadStats(): void {
        if (this.token) {
            this._userService.getCounters().subscribe({
                next: (response: any) => {
                    this.stats = response;
                    this.cdr.detectChanges();
                },
                error: (error) => {
                    console.error('Error loading stats', error);
                }
            });
        }
    }

    ngOnDestroy(): void {
        if (this.statsSubscription) {
            this.statsSubscription.unsubscribe();
        }
    }

}

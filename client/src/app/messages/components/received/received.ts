import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Message } from '../../../models/message';
import { Follow } from '../../../models/follow';
import { FollowService } from '../../../services/follow';
import { MessageService } from '../../../services/message.service';
import { GLOBAL } from '../../../services/global';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { FormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { SidebarMenuComponent } from '../../../components/sidebar/sidebar-menu';
import { ChangeDetectorRef } from '@angular/core';
import { TimeAgoPipe } from '../../../pipes/time-ago.pipe';


@Component({
    selector: 'received',
    templateUrl: './received.html',
    imports: [SidebarMenuComponent, RouterModule, FormsModule, TimeAgoPipe],
    providers: [FollowService, MessageService, UserService, TimeAgoPipe]
})
export class ReceivedComponent implements OnInit {
    public title: string;
    public messages: Message[];
    public identity: any
    public token: any;
    public url: string;
    public status: string;
    public follows: any;
    public page: number;
    public pages: number;
    public next_page: number;
    public prev_page: number;
    public total: number;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _messageService: MessageService,
        private _userService: UserService,
        private cdr: ChangeDetectorRef,
        private _timeAgoPipe: TimeAgoPipe

    ) {
        this.title = 'Mensajes recibidos';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.status = '';
        this.follows = null;
        this.messages = [];
        this.page = 1;
        this.pages = 0;
        this.next_page = this.page + 1;
        this.prev_page = this.page - 1;
        this.total = 0;

    }


    ngOnInit(): void {
        this._route.params.subscribe(params => {
            let page = +params['page'];
            if (!page || isNaN(page)) {
                page = 1;
            }
            this.page = page;
            this.getMessages();
        });
    }

    getMessages(): void {
        this._messageService.getMyMessages(this.token, this.page).subscribe({
            next: (response: any) => {
                if (response.messages) {
                    this.messages = response.messages;
                    this.pages = response.pages;
                    this.next_page = response.next_page;
                    this.prev_page = response.prev_page;
                    this.total = response.total;

                    this.cdr.detectChanges(); // Forzar la detección de cambios después de cargar los mensajes
                }
            },
            error: (err: any) => {
                console.error('Error fetching sent messages', err);
            }
        });
    }
}
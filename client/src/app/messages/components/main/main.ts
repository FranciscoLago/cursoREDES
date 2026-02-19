import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Message } from '../../../models/message';
import { Follow } from '../../../models/follow';
import { FollowService } from '../../../services/follow';
import { MessageService } from '../../../services/message.service';
import { GLOBAL } from '../../../services/global';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { FormsModule } from "@angular/forms";
import { SidebarMenuComponent } from '../../../components/sidebar/sidebar-menu';

@Component({
    selector: 'main',
    templateUrl: './main.html',
    providers: [FollowService, MessageService],
    imports: [FormsModule, RouterOutlet, SidebarMenuComponent]
})
export class MainComponent implements OnInit {
    public title: string;
    public identity: any
    public token: string;
    public url: string;
    public follows: any;

    constructor(
        private _followService: FollowService,
        private _messageService: MessageService,
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _router: Router

    ) {
        this.title = 'Mensajes privados';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(): void {
        console.log('Main component loaded');
    }


}
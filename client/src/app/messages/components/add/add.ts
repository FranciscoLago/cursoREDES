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



@Component({
    selector: 'add',
    templateUrl: './add.html',
    providers: [FollowService, MessageService, UserService,],
    imports: [FormsModule, RouterModule, SidebarMenuComponent]
})
export class AddComponent implements OnInit {
    public title: string;
    public message: Message;
    public identity: any
    public token: any;
    public url: string;
    public status: string;
    public follows: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _messageService: MessageService,
        private _userService: UserService,
        private cdr: ChangeDetectorRef
    ) {
        this.title = 'Enviar mensaje';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.status = '';
        this.follows = null;
        this.message = new Message('', '', false, '', this.identity._id, this._userService.getIdentity()._id);
    }

    ngOnInit(): void {
        console.log('Add component loaded');
        this.getMyFollows();
        this.cdr.detectChanges(); // Forzar la detección de cambios después de cargar los seguidores
    }

    onSubmit(form: any): void {
        // Lógica para enviar el mensaje
        console.log('Formulario enviado', this.message);
        this._messageService.addMessage(this.token, this.message).subscribe({
            next: (response) => {
                if (response.message) {
                    this.status = 'success';
                    form.reset();
                    //this.message = new Message('', '', false, '', this.identity._id, '');
                } else {
                    this.status = 'error';
                }
            },
            error: (error) => {
                console.error(<any>error);
                this.status = 'error';
            }
        });
        // Aquí puedes agregar la lógica de envío real
    }

    getMyFollows(): void {
        console.log('Token usado para follows:', this.token);
        this._followService.getMyFollows(this.token).subscribe({
            next: (response) => {
                this.follows = response.follows;
                this.cdr.detectChanges(); // Forzar la detección de cambios después de cargar los seguidoresº
            },
            error: (error) => {
                console.error(<any>error);
            }
        });
    }

}
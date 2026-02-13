import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";

@Component({
    selector: 'user-edit',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './user-edit.html',
    providers: [UserService]
})
export class UserEdit implements OnInit {
    public title: string;
    public user: User;
    public identity: any;
    public token: any;
    public status: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private cdr: ChangeDetectorRef
    ) {
        this.title = "Actualizar mis datos";
        this.user = this._userService.getIdentity();
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.status = '';
    }

    ngOnInit() {
        console.log('Usuario:', this.user);
        console.log('ID del usuario:', this.user?.id);
        console.log('user-edit.component cargado');
    }

    onSubmit() {
        console.log('Enviando usuario:', this.user);
        console.log('ID a usar:', this.user.id);
        this._userService.updateUser(this.user).subscribe({
            next: response => {
                if (!response.user) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    this.identity = this.user;

                    // SUBIDA DE IMAGEN DE USUARIO
                }
            },
            error: err => {
                var errorMessage = <any>err;
                console.log(errorMessage);
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        })
    }

}
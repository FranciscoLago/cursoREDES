import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrls: ['./login.css'],
    standalone: true,
    imports: [FormsModule],
    providers: [UserService]
})
export class Login implements OnInit {
    title: string;
    public user: User;
    public status: string;
    public identity: any;
    public token: any;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _userService: UserService,
        private cdr: ChangeDetectorRef
    ) {
        this.title = "Identificate";
        this.user = new User('', '', '', '', '', '', 'ROLE_USER', '');
        this.status = '';
    }


    ngOnInit(): void {
        console.log("Login component cargado");
    }

    onSubmit(form: NgForm) {
        // Loguear al usuario y obtener el token
        this._userService.signup(this.user).subscribe({
            next: response => {
                this.identity = response.user;
                if (!this.identity || !this.identity._id) {
                    this.status = 'error';

                } else {
                    this.status = 'success';
                    // PERSISTIR DATOS DEL USUARIO IDENTIFICADO
                    localStorage.setItem('identity', JSON.stringify(this.identity));
                    // Obtener el token
                    this.getToken();
                }
            },
            error: error => {
                var errorMessage = <any>error;
                console.log(errorMessage);

                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        })
    }

    getToken() {
        // Loguear al usuario y obtener el token
        this._userService.signup(this.user, true).subscribe({
            next: response => {
                this.token = response.token;
                if (this.token.length <= 0) {
                    this.status = 'error';

                } else {
                    this.status = 'success';
                    // PERSISTIR DATOS DEL USUARIO IDENTIFICADO
                    localStorage.setItem('token', this.token);
                    localStorage.setItem('identity', JSON.stringify(this.identity));

                    //consegior los contadores o estadisticas del usuario
                    this._router.navigate(['/']);

                }
            },
            error: error => {
                var errorMessage = <any>error;
                console.log(errorMessage);

                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        })
    }


}
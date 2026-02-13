import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
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
        //algo tendre q poner aqui
    }

    onSubmit(form: NgForm) {
        form.form.markAllAsTouched();
        form.form.updateValueAndValidity();
        if (form.invalid) {
            return;
        }

        const loginData = {
            email: this.user.email,
            password: this.user.password
        };

        // Loguear al usuario y obtener el token
        this._userService.signup(loginData).subscribe({
            next: response => {
                this.identity = response.user;
                if (!this.identity || !this.identity._id) {
                    this.status = 'error';
                    this.cdr.detectChanges();

                } else {
                    this.status = 'success';
                    this.cdr.detectChanges();
                    // PERSISTIR DATOS DEL USUARIO IDENTIFICADO
                    localStorage.setItem('identity', JSON.stringify(this.identity));
                    // Obtener el token
                    this.getToken(loginData);
                }
            },
            error: error => {
                var errorMessage = <any>error;
                console.log(errorMessage);

                if (errorMessage != null) {
                    this.status = 'error';
                    this.cdr.detectChanges();
                }
            }
        })
    }

    getToken(loginData?: { email: string; password: string }) {
        const data = loginData ?? this.user;
        // Loguear al usuario y obtener el token
        this._userService.signup(data, true).subscribe({
            next: response => {
                this.token = response.token;
                if (this.token.length <= 0) {
                    this.status = 'error';
                    this.cdr.detectChanges();

                } else {
                    this.status = 'success';
                    this.cdr.detectChanges();
                    // PERSISTIR DATOS DEL USUARIO IDENTIFICADO
                    localStorage.setItem('token', this.token);
                    localStorage.setItem('identity', JSON.stringify(this.identity));

                    //consegior los contadores o estadisticas del usuario
                    setTimeout(() => {
                        this.getCounters();
                    }, 500);

                }
            },
            error: error => {
                var errorMessage = <any>error;
                console.log(errorMessage);

                if (errorMessage != null) {
                    this.status = 'error';
                    this.cdr.detectChanges();
                }
            }
        })
    }

    getCounters() {
        this._userService.getCounters().subscribe({
            next: response => {
                localStorage.setItem('stats', JSON.stringify(response));
                this._router.navigate(['/home']);

            },
            error: error => {
                console.log(<any>error);
            }
        })
    }


}
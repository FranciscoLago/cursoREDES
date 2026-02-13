import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, ActivatedRoute, Params, RouterLink } from "@angular/router";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";

@Component({
    selector: 'app-register',
    templateUrl: './register.html',
    standalone: true,
    imports: [FormsModule, RouterLink],
    providers: [UserService]
})
export class Register implements OnInit {
    public title: string;
    public user: User;
    public userService: UserService;
    public status: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private cdr: ChangeDetectorRef

    ) {
        this.title = "Regístrate";
        this.user = new User('', '', '', '', '', '', 'ROLE_USER', '');
        this.userService = _userService;
        this.status = '';
    }


    ngOnInit(): void {
        //console.log('register.component cargado');
    }

    onSubmit(form: NgForm): void {
        form.form.markAllAsTouched();
        form.form.updateValueAndValidity();
        if (form.invalid) {
            return;
        }

        console.log("Register submit", this.user);
        this.userService.register(this.user).subscribe({
            next: response => {
                if (response.user && response.user._id) {
                    //console.log(response.user)
                    this.status = 'success';
                    this.cdr.detectChanges();
                    setTimeout(() => {
                        this._router.navigate(['/home']);
                    }, 500);
                    form.reset();
                } else {
                    this.status = 'error';
                }
                this.cdr.detectChanges();
            },
            error: error => {
                console.log(<any>error);
                this.status = 'error';
                this.cdr.detectChanges();
            }
        })
    }
}
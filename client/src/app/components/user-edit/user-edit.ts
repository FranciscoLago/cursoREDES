import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { UploadService } from "../../services/upload.service";
import { GLOBAL } from "../../services/global";

@Component({
    selector: 'user-edit',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './user-edit.html',
    providers: [UserService, UploadService]
})
export class UserEdit implements OnInit {
    public title: string;
    public user: User;
    public identity: any;
    public token: any;
    public status: string;
    public url: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _uploadService: UploadService,
        private cdr: ChangeDetectorRef
    ) {
        this.title = "Actualizar mis datos";
        this.user = this._userService.getIdentity();
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.status = '';
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('Usuario:', this.user);
        console.log('ID del usuario:', this.user?.id);
        console.log('user-edit.component cargado');
    }

    onSubmit(form: NgForm) {
        form.form.markAllAsTouched();
        form.form.updateValueAndValidity();
        if (form.invalid) {
            return;
        }

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
                    this._uploadService.makeFileRequest(
                        this._uploadService.url + 'upload-image-user/' + this.user.id,
                        [],
                        this.filesToUpload,
                        'image'
                    ).then((result: any) => {
                        this.user.image = result.user.image;
                        localStorage.setItem('identity', JSON.stringify(this.user));
                        this.cdr.detectChanges();

                    })
                }
                this.cdr.detectChanges();
            },
            error: err => {
                var errorMessage = <any>err;
                console.log(errorMessage);
                if (errorMessage != null) {
                    this.status = 'error';
                }
                this.cdr.detectChanges();
            }
        })
    }
    public filesToUpload: Array<File> = [];
    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

}
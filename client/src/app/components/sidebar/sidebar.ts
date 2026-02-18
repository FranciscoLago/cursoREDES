import { Component, OnInit, ChangeDetectorRef, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Subscription } from 'rxjs';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication';
import { UploadService } from '../../services/upload.service';
import { ActivatedRoute, Router } from "@angular/router";
import { send } from 'process';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.html',
    standalone: true,
    imports: [FormsModule],
    providers: [UploadService]
})
export class Sidebar implements OnInit, OnDestroy {
    public identity: any;
    public token: any;
    public stats: any;
    public status: string;
    public url: string;
    private statsSubscription: Subscription | null = null;
    public publication: Publication;
    public filesToUpload: Array<File> = [];



    constructor(
        private _userService: UserService,
        private cdr: ChangeDetectorRef,
        private _publicationService: PublicationService,
        private _uploadService: UploadService,
        private _route: ActivatedRoute,
        private _router: Router

    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.stats = {};
        this.status = "";
        this.publication = new Publication("", "", "", "", this.identity._id);
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

    onSubmit(form: any): void {
        this._publicationService.addPublication(this.token, this.publication).subscribe({
            next: (response: any) => {
                console.log('Respuesta de addPublication:', response);
                if (response.publication) {
                    const publicationId = response.publication._id || response.publication.id;
                    console.log('publicationId:', publicationId, 'filesToUpload:', this.filesToUpload);

                    if (this.filesToUpload.length > 0 && publicationId) {
                        this._uploadService.makeFileRequest(
                            this._uploadService.url + 'upload-image-pub/' + publicationId,
                            [],
                            this.filesToUpload,
                            'image'
                        ).then(() => {
                            console.log('Imagen subida correctamente, emitiendo evento...');
                            this.status = "success";
                            this.filesToUpload = [];
                            form.reset();
                            this.cdr.detectChanges();
                            this.sendPublication(null);
                        }).catch((error: any) => {
                            console.error('Error subiendo imagen:', error);
                            this.status = "error";
                            this.cdr.detectChanges();
                        });
                    } else {
                        this.status = "success";
                        form.reset();
                        this.cdr.detectChanges();
                        this.sendPublication(null);
                    }
                } else {
                    console.log('No se recibió publication en la respuesta');
                    this.status = "error";
                }
            },
            error: (error: any) => {
                console.error('Error creando publication:', error);
            }
        });
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    //Output
    @Output() sent = new EventEmitter();
    sendPublication(event: any) {
        console.log('Emitiendo evento de publicación enviada');
        this.sent.emit({ send: 'true' });
    }

}

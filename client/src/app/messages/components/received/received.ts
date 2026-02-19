import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
    selector: 'received',
    templateUrl: './received.html'
})
export class ReceivedComponent implements OnInit {
    public title: any;

    constructor() {
        this.title = 'Mensajes recibidos';
    }

    ngOnInit(): void {
        console.log('Received component loaded');
    }
}
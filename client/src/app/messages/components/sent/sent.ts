import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
    selector: 'sent',
    templateUrl: './sent.html'
})
export class SentComponent implements OnInit {
    public title: any;

    constructor() {
        this.title = 'Mensajes enviados';
    }

    ngOnInit(): void {
        console.log('Sent component loaded');
    }
}
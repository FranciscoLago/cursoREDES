import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'home',
    templateUrl: './home.html'
})
export class Home implements OnInit {
    public title: string;

    constructor() {
        this.title = "Bienvenido a SocialLeik";
    }

    ngOnInit(): void {
        console.log("Home component cargado");
    }
}
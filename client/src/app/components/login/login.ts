import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrls: ['./login.css'],
    standalone: true
})
export class Login implements OnInit {
    title:string;

    constructor() {
        this.title = "Identificate";
    }


    ngOnInit(): void {
        console.log("Login component cargado");
    }
}
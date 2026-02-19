import { Routes } from "@angular/router";

//Componentes
import { MainComponent } from "./components/main/main";
import { AddComponent } from "./components/add/add";
import { ReceivedComponent } from "./components/received/received";
import { SentComponent } from "./components/sent/sent";

export const MessagesRoutes: Routes = [
    { path: '', component: MainComponent },
    { path: 'add', component: AddComponent },
    { path: 'received', component: ReceivedComponent },
    { path: 'sent', component: SentComponent },
    { path: '', redirectTo: '', pathMatch: 'full' }
];
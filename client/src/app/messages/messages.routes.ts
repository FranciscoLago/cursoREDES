import { Routes } from "@angular/router";

//Componentes
import { MainComponent } from "./components/main/main";
import { AddComponent } from "./components/add/add";
import { ReceivedComponent } from "./components/received/received";
import { SentComponent } from "./components/sent/sent";

//Guard
import { UserGuard } from "../services/user.guard";

export const MessagesRoutes: Routes = [
    { path: '', component: MainComponent },
    { path: 'add', component: AddComponent, canActivate: [UserGuard] },
    { path: 'received/:page', component: ReceivedComponent, canActivate: [UserGuard] },
    { path: 'received', component: ReceivedComponent, canActivate: [UserGuard] },
    { path: 'sent', component: SentComponent, canActivate: [UserGuard] },
    { path: 'sent/:page', component: SentComponent, canActivate: [UserGuard] },
    { path: '', redirectTo: '', pathMatch: 'full' }
];
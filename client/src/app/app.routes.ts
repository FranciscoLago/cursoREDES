import { Routes } from '@angular/router';
import { MessagesRoutes } from './messages/messages.routes';

import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { UserEdit } from './components/user-edit/user-edit';
import { UsersComponent } from './components/users/users';
import { TimelineComponent } from './components/timeline/timeline';
import { ProfileComponent } from './components/profile/profile';
import { FollowingComponent } from './components/following/following';
import { FollowedComponent } from './components/followed/followed';
import { UserGuard } from './services/user.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: Home },
  { path: 'mis-datos', component: UserEdit, canActivate: [UserGuard] },
  { path: 'gente', redirectTo: 'gente/1', pathMatch: 'full' },
  { path: 'gente/:page', component: UsersComponent, canActivate: [UserGuard] },
  { path: 'timeline', component: TimelineComponent, canActivate: [UserGuard] },
  { path: 'perfil/:id', component: ProfileComponent, canActivate: [UserGuard] },
  { path: 'following/:id/:page', component: FollowingComponent, canActivate: [UserGuard] },
  { path: 'followed/:id/:page', component: FollowedComponent, canActivate: [UserGuard] },
  { path: 'messages', children: MessagesRoutes, canActivate: [UserGuard] },
  { path: '**', component: Home }
];

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


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: Home },
  { path: 'mis-datos', component: UserEdit },
  { path: 'gente', redirectTo: 'gente/1', pathMatch: 'full' },
  { path: 'gente/:page', component: UsersComponent },
  { path: 'timeline', component: TimelineComponent },
  { path: 'perfil/:id', component: ProfileComponent },
  { path: 'following/:id/:page', component: FollowingComponent },
  { path: 'followed/:id/:page', component: FollowedComponent },
  { path: 'messages', children: MessagesRoutes },
  { path: '**', component: Home }
];

import { Routes } from '@angular/router';

import { Register } from './components/register/register';
import { Login } from './components/login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register }
];

import { Routes } from '@angular/router';
import { AuthenticateUser } from './pages/authenticate-user/authenticate-user';
import { CreateUser } from './pages/create-user/create-user';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { redirectIfAuthenticatedGuard } from './guards/redirect-if-authenticated-guard';
import { Collaborators } from './pages/collaborators/collaborators';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthenticateUser,
    canActivate: [redirectIfAuthenticatedGuard],
  },
  {
    path: 'register',
    component: CreateUser,
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },
  {
    path: 'collaborators',
    component: Collaborators,
    canActivate: [authGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login',
  },
];

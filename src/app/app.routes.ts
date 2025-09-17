import { Routes } from '@angular/router';
import { AuthenticateUser } from './pages/authenticate-user/authenticate-user';
import { CreateUser } from './pages/create-user/create-user';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { redirectIfAuthenticatedGuard } from './guards/redirect-if-authenticated-guard';
import { Collaborators } from './pages/collaborators/collaborators';
import { CreateEquipmentComponent } from './pages/create-equipment/create-equipment.component';
import { EditEquipment } from './pages/edit-equipment/edit-equipment';

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
    path: 'equipment/new',
    component: CreateEquipmentComponent,
    canActivate: [authGuard],
  },
  {
    path: 'equipment/edit/:id',
    component: EditEquipment,
    canActivate: [authGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login',
  },
];

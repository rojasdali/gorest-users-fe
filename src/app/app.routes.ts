import { Routes } from '@angular/router';

import { LoginComponent } from '@features/auth/login/login.component';
import { UserDetailsComponent } from '@features/users/components/user-details/user-details.component';
import { UserListComponent } from '@features/users/components/user-list/user-list.component';

import { NotFoundComponent } from '@core/components/not-found/not-found.component';
import { authGuard } from '@core/guards/auth.guard';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      {
        path: '',
        canActivate: [authGuard],
        children: [
          { path: '', redirectTo: 'users', pathMatch: 'full' },
          { path: 'users', component: UserListComponent },
          { path: 'users/:id', component: UserDetailsComponent },
        ],
      },
      { path: '404', component: NotFoundComponent },
      { path: '**', redirectTo: '404' },
    ],
  },
];

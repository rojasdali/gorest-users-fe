import { Routes } from '@angular/router';

import { UserDetailsComponent } from './features/users/components/user-details/user-details.component';
import { UserListComponent } from './features/users/components/user-list/user-list.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UserListComponent },
      { path: 'users/:id', component: UserDetailsComponent },
    ],
  },
];

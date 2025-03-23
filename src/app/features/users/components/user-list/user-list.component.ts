import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject, debounceTime, takeUntil } from 'rxjs';

import { MaterialModule } from '@shared/material.module';
import { UserService } from '@users/services';
import { User } from '@users/models/user.model';
import { UserTableComponent } from '../user-table/user-table.component';
import {
  UserFilterComponent,
  UserFilter,
} from '../user-filter/user-filter.component';
import { NotificationService } from '@core/services/notification.service';
import { UserCreateDialogComponent } from '../user-create-dialog/user-create-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    UserTableComponent,
    UserFilterComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  displayedColumns: string[] = ['name', 'email', 'gender', 'status', 'actions'];
  loading = false;
  totalUsers = 0;
  pageSize = 10;
  currentPage = 0;

  filter: UserFilter = {
    searchTerm: '',
    status: 'all',
    gender: 'all',
  };

  private filterChange$ = new Subject<UserFilter>();
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private router: Router,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setupFilterSubscription();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFilterSubscription(): void {
    this.filterChange$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((filter) => {
        this.filter = filter;
        this.currentPage = 0;
        this.loadUsers();
      });
  }

  loadUsers(): void {
    this.loading = true;
    this.userService
      .getUsers(this.currentPage + 1, this.pageSize, this.filter)
      .subscribe({
        next: (response) => {
          console.log('Users received:', response.data);
          this.users = response.data;
          this.totalUsers = response.meta.pagination.total;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.loading = false;
        },
      });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  viewUserDetails(userId: number): void {
    console.log('View user:', userId);
    this.router.navigate(['/users', userId]);
  }

  editUser(updatedUser: User): void {
    const userIndex = this.users.findIndex(
      (user) => user.id === updatedUser.id
    );

    if (userIndex === -1) {
      console.error('User not found in the list');
      return;
    }

    const originalUser = { ...this.users[userIndex] };

    this.users = this.users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );

    const pendingNotification = this.notification.showInfo('Updating user...');

    this.userService.updateUser(updatedUser).subscribe({
      next: () => {
        this.notification.dismiss(pendingNotification);
        this.notification.showSuccess('User details updated successfully');
      },
      error: (error) => {
        console.error('Error updating user:', error);

        this.users = this.users.map((user) =>
          user.id === originalUser.id ? originalUser : user
        );

        this.notification.dismiss(pendingNotification);
        this.notification.showError('Failed to update user. Changes reverted.');
      },
    });
  }

  deleteUser(user: User): void {
    const userIndex = this.users.findIndex((u) => u.id === user.id);

    if (userIndex === -1) {
      console.error('User not found in the list');
      return;
    }

    const deletedUser = { ...this.users[userIndex] };

    this.users = this.users.filter((u) => u.id !== user.id);

    this.totalUsers--;

    const pendingNotification = this.notification.showInfo('Deleting user...');

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.notification.dismiss(pendingNotification);
        this.notification.showSuccess('User was successfully deleted');
      },
      error: (error) => {
        console.error('Error deleting user:', error);

        this.users.splice(userIndex, 0, deletedUser);
        this.totalUsers++;

        this.notification.dismiss(pendingNotification);
        this.notification.showError('Failed to delete user. Changes reverted.');
      },
    });
  }

  onFilterChange(filter: UserFilter): void {
    this.filterChange$.next(filter);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(UserCreateDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { formData, optimisticUser } = result;
        const pendingNotification =
          this.notification.showInfo('Creating user...');

        // Optimistically add user to the displayed list
        this.users = [optimisticUser, ...this.users];
        this.totalUsers++;

        this.userService.createUser(formData).subscribe({
          next: (newUser) => {
            // Replace optimistic user with actual user from server
            this.users = this.users.map((user) =>
              user.id === optimisticUser.id ? newUser : user
            );

            this.notification.dismiss(pendingNotification);
            this.notification.showSuccess('User created successfully');
          },
          error: (error) => {
            console.error('Error creating user:', error);

            this.users = this.users.filter(
              (user) => user.id !== optimisticUser.id
            );
            this.totalUsers--;

            this.notification.dismiss(pendingNotification);
            this.notification.showError(
              'Failed to create user. Please try again.'
            );
          },
        });
      }
    });
  }
}

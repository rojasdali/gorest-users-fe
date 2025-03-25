import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Subject, debounceTime, takeUntil } from 'rxjs';

import { NotificationService } from '@core/services/notification.service';
import { MaterialModule } from '@shared/material.module';
import { User } from '@users/models/user.model';
import { UserService } from '@users/services';

import { UserCreateDialogComponent } from '../user-create-dialog/user-create-dialog.component';
import {
  UserFilterComponent,
  UserFilter,
  toSafeUserStatus,
  toSafeUserGender,
} from '../user-filter/user-filter.component';
import { UserTableComponent } from '../user-table/user-table.component';

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
    private route: ActivatedRoute,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const status = params['status'] || 'all';
        const gender = params['gender'] || 'all';

        this.filter = {
          searchTerm: params['search'] || '',
          status: toSafeUserStatus(status),
          gender: toSafeUserGender(gender),
        };

        this.currentPage = params['page']
          ? parseInt(params['page'], 10) - 1
          : 0;
        this.pageSize = params['per_page']
          ? parseInt(params['per_page'], 10)
          : 10;

        this.loadUsers();
      });

    this.setupFilterSubscription();
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
        this.updateUrlParams();
      });
  }

  private updateUrlParams(): void {
    const queryParams: Params = {
      page: this.currentPage + 1,
      per_page: this.pageSize,
    };

    if (this.filter.searchTerm?.trim()) {
      queryParams['search'] = this.filter.searchTerm;
    }

    if (this.filter.status && this.filter.status !== 'all') {
      queryParams['status'] = this.filter.status;
    }

    if (this.filter.gender && this.filter.gender !== 'all') {
      queryParams['gender'] = this.filter.gender;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true,
    });
  }

  loadUsers(): void {
    this.loading = true;

    this.userService
      .getUsers(this.currentPage + 1, this.pageSize, this.filter)
      .subscribe({
        next: (response) => {
          this.users = response.data;
          this.totalUsers = response.meta.pagination.total;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.loading = false;
          this.notification.showError(
            'Failed to load users. Please try again.'
          );
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;

    const queryParams: Params = {
      ...this.route.snapshot.queryParams,
      page: this.currentPage + 1,
      per_page: this.pageSize,
    };

    delete queryParams['refresh'];

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });

    this.loadUsers();
  }

  viewUserDetails(userId: number): void {
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

    const originalUsers = [...this.users];
    const originalTotal = this.totalUsers;

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
        console.log('Before restoration - users:', this.users.length);

        this.users = originalUsers;
        this.totalUsers = originalTotal;

        console.log('After restoration - users:', this.users.length);
        console.log(
          'Deleted user restored:',
          this.users.some((u) => u.id === user.id)
        );

        this.notification.dismiss(pendingNotification);
        this.notification.showError('Failed to delete user. Changes reverted.');
      },
    });
  }

  onFilterChange(filter: UserFilter): void {
    this.filter = filter;
    this.currentPage = 0;

    if (
      filter.searchTerm === '' &&
      filter.status === 'all' &&
      filter.gender === 'all'
    ) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          page: 1,
          per_page: this.pageSize,
        },
        replaceUrl: true,
      });
    } else {
      this.updateUrlParams();
    }

    this.loadUsers();
  }

  private userMatchesFilter(user: User): boolean {
    if (!this.filter) return true;

    if (this.filter.status !== 'all' && user.status !== this.filter.status) {
      return false;
    }

    if (this.filter.gender !== 'all' && user.gender !== this.filter.gender) {
      return false;
    }

    if (this.filter.searchTerm) {
      const term = this.filter.searchTerm.toLowerCase();
      const nameMatch = user.name.toLowerCase().includes(term);
      const emailMatch = user.email.toLowerCase().includes(term);
      if (!nameMatch && !emailMatch) return false;
    }

    return true;
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

        const shouldShowInUI = this.userMatchesFilter(optimisticUser);

        if (shouldShowInUI) {
          this.users = [optimisticUser, ...this.users];
        }

        this.totalUsers++;

        this.userService.createUser(formData).subscribe({
          next: (newUser) => {
            if (shouldShowInUI) {
              this.users = this.users.map((user) =>
                user.id === optimisticUser.id ? newUser : user
              );
            } else if (this.userMatchesFilter(newUser)) {
              this.users = [newUser, ...this.users];
            }

            this.notification.dismiss(pendingNotification);
            this.notification.showSuccess('User created successfully');
          },
          error: (error) => {
            console.error('Error creating user:', error);

            if (shouldShowInUI) {
              this.users = this.users.filter(
                (user) => user.id !== optimisticUser.id
              );
            }
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

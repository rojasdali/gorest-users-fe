import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationService } from '@core/services/notification.service';
import { MaterialModule } from '@shared/material.module';
import { getColorByIndex, getInitials } from '@shared/utils';
import { UserDeleteDialogComponent } from '@users/components/user-delete-dialog/user-delete-dialog.component';
import { UserEditDialogComponent } from '@users/components/user-edit-dialog/user-edit-dialog.component';
import { User } from '@users/models';
import { UserService } from '@users/services';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements OnInit {
  user?: User;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.user = user;
          this.loading = false;
        },
        error: (error) => {
          this.error = `Failed to load user details: ${error.message}`;
          this.loading = false;
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  editUser(): void {
    if (this.user) {
      const dialogRef = this.dialog.open(UserEditDialogComponent, {
        width: '500px',
        data: { user: this.user },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const originalUser = { ...this.user! };

          this.user = { ...result };

          const pendingNotification =
            this.notification.showInfo('Updating user...');

          this.userService.updateUser(result).subscribe({
            next: () => {
              this.notification.dismiss(pendingNotification);
              this.notification.showSuccess(
                'User details updated successfully'
              );
            },
            error: (error) => {
              this.user = originalUser;

              this.notification.dismiss(pendingNotification);
              this.notification.showError(
                `Failed to update user: ${error.message}`
              );
            },
          });
        }
      });
    }
  }

  deleteUser(): void {
    if (this.user) {
      const dialogRef = this.dialog.open(UserDeleteDialogComponent, {
        width: '400px',
        data: {
          userId: this.user.id,
          userName: this.user.name,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const userName = this.user?.name;

          const pendingNotification = this.notification.showInfo(
            `Deleting ${userName}...`
          );

          this.userService.deleteUser(result).subscribe({
            next: () => {
              this.notification.dismiss(pendingNotification);
              this.notification.showSuccess(`${userName} was deleted`);
              this.router.navigate(['/users'], {
                queryParams: {
                  refresh: new Date().getTime(),
                },
              });
            },
            error: (error) => {
              this.notification.dismiss(pendingNotification);
              this.notification.showError(
                `Failed to delete user: ${error.message}`
              );
            },
          });
        }
      });
    }
  }

  getAvatarColor(userId: number): string {
    return getColorByIndex(userId);
  }

  getInitials(name: string): string {
    return getInitials(name);
  }

  getAvatarColorName(userId: number): string {
    const colorIndex = userId % 10;
    const colorNames = [
      'Lavender',
      'Teal',
      'Coral',
      'Sky Blue',
      'Amber',
      'Emerald',
      'Rose',
      'Indigo',
      'Mint',
      'Crimson',
    ];
    return colorNames[colorIndex];
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material.module';
import { MatTableModule } from '@angular/material/table';
import { User } from '@users/models';
import { MatDialog } from '@angular/material/dialog';
import { UserDeleteDialogComponent } from '../user-delete-dialog/user-delete-dialog.component';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';

export const DEFAULT_PAGE_SIZE = 10;

interface TableColumn {
  field: string;
  header: string;
}

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatTableModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss',
})
export class UserTableComponent implements OnInit {
  @Input() users: User[] = [];
  @Input() loading = false;
  @Input() pageSize: number = DEFAULT_PAGE_SIZE;
  @Output() viewUser = new EventEmitter<number>();
  @Output() editUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<User>();

  displayedColumns: string[] = ['name', 'email', 'gender', 'status', 'actions'];

  standardColumns: TableColumn[] = [
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'gender', header: 'Gender' },
  ];

  skeletonData: any[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.skeletonData = Array(this.pageSize).fill({
      name: '',
      email: '',
      gender: '',
      status: '',
    });
  }

  onViewUser(id: number): void {
    this.viewUser.emit(id);
  }

  onEditUser(userId: number): void {
    const user = this.users.find((u) => u.id === userId);

    if (!user) {
      console.error('User not found');
      return;
    }

    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '500px',
      data: { user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.editUser.emit(result);
      }
    });
  }

  onDeleteUser(user: User): void {
    const dialogRef = this.dialog.open(UserDeleteDialogComponent, {
      width: '400px',
      data: {
        userId: user.id,
        userName: user.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser.emit(user);
      }
    });
  }

  isColumnVisible(column: string): boolean {
    return this.displayedColumns.includes(column);
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  trackByIndex(index: number): number {
    return index;
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }
}

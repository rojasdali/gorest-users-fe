import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageEvent } from '@angular/material/paginator';
import { MaterialModule } from '../../../../shared/material.module';
import { UserService } from '../../services/user.service';
import { User } from '../../../../core/models/user.interface';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'gender',
    'status',
    'actions',
  ];
  loading = false;
  totalUsers = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers(this.currentPage + 1, this.pageSize).subscribe({
      next: (response) => {
        this.users = response.data;
        this.totalUsers = response.meta.pagination.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching users', error);
        this.loading = false;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  viewUserDetails(userId: number): void {
    console.log('View user details', userId);
  }

  editUser(userId: number): void {
    console.log('Edit user', userId);
  }

  deleteUser(userId: number): void {
    console.log('Delete user', userId);
  }
}

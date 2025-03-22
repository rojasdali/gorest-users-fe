import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { User, UserResponse } from '../../../core/models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'male',
      status: 'active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      gender: 'female',
      status: 'active',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      gender: 'male',
      status: 'inactive',
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      gender: 'female',
      status: 'active',
    },
    {
      id: 5,
      name: 'Michael Brown',
      email: 'michael@example.com',
      gender: 'male',
      status: 'inactive',
    },
  ];

  getUsers(page: number = 1, limit: number = 10): Observable<UserResponse> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = this.mockUsers.slice(startIndex, endIndex);

    return of({
      data: paginatedUsers,
      meta: {
        pagination: {
          total: this.mockUsers.length,
          pages: Math.ceil(this.mockUsers.length / limit),
          page: page,
          limit: limit,
        },
      },
    }).pipe(delay(500));
  }

  getUserById(id: number): Observable<User | undefined> {
    return of();
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return of();
  }

  updateUser(user: User): Observable<User> {
    return of();
  }

  deleteUser(id: number): Observable<boolean> {
    return of();
  }
}

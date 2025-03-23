import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { UserFilter } from '@users/components/user-filter/user-filter.component';
import { User, UserResponse } from '@users/models/user.model';

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
    {
      id: 6,
      name: 'John Doe',
      email: 'john2@example.com',
      gender: 'male',
      status: 'active',
    },
    {
      id: 7,
      name: 'Jane Smith',
      email: 'jane2@example.com',
      gender: 'female',
      status: 'active',
    },
    {
      id: 8,
      name: 'Bob Johnson',
      email: 'bob2@example.com',
      gender: 'male',
      status: 'inactive',
    },
    {
      id: 9,
      name: 'Sarah Williams',
      email: 'sarah2@example.com',
      gender: 'female',
      status: 'active',
    },
    {
      id: 10,
      name: 'Michael Brown',
      email: 'michael2@example.com',
      gender: 'male',
      status: 'inactive',
    },
  ];

  getUsers(
    page: number = 1,
    limit: number = 10,
    filter?: UserFilter
  ): Observable<UserResponse> {
    let filteredUsers = [...this.mockUsers];

    if (filter) {
      if (filter.searchTerm) {
        const searchTerm = filter.searchTerm.toLowerCase();
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
      }

      if (filter.status !== 'all') {
        filteredUsers = filteredUsers.filter(
          (user) => user.status === filter.status
        );
      }

      if (filter.gender !== 'all') {
        filteredUsers = filteredUsers.filter(
          (user) => user.gender === filter.gender
        );
      }
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return of({
      data: paginatedUsers,
      meta: {
        pagination: {
          total: filteredUsers.length,
          pages: Math.ceil(filteredUsers.length / limit),
          page: page,
          limit: limit,
        },
      },
    }).pipe(delay(500));
  }

  getUserById(id: number): Observable<User | undefined> {
    const user = this.mockUsers.find((user) => user.id === id);
    return of(user).pipe(delay(500));
  }

  createUser(userData: Omit<User, 'id'>): Observable<User> {
    const maxId = Math.max(...this.mockUsers.map((user) => user.id), 0);
    const newUser: User = {
      ...userData,
      id: maxId + 1,
    };

    this.mockUsers.unshift(newUser);

    return of(newUser).pipe(delay(500));
  }

  updateUser(user: User): Observable<User> {
    const userIndex = this.mockUsers.findIndex((u) => u.id === user.id);

    if (userIndex !== -1) {
      this.mockUsers[userIndex] = { ...user };
    }

    return of(user).pipe(delay(500));
  }

  deleteUser(id: number): Observable<boolean> {
    const userIndex = this.mockUsers.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
      this.mockUsers.splice(userIndex, 1);
    }

    return of(true).pipe(delay(500));
  }
}

import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environments/environment';
import { Observable, catchError, map, throwError, of } from 'rxjs';

import { UserFilter } from '@users/components/user-filter/user-filter.component';
import { User, UserResponse } from '@users/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl || 'https://gorest.co.in/public/v2';

  constructor(private http: HttpClient) {}

  getUsers(
    page: number = 1,
    perPage: number = 10,
    filter?: UserFilter
  ): Observable<UserResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (filter?.searchTerm) {
      return this.combineSearchResults(filter, page, perPage);
    }

    if (filter) {
      if (filter.status && filter.status !== 'all') {
        params = params.set('status', filter.status);
      }
      if (filter.gender && filter.gender !== 'all') {
        params = params.set('gender', filter.gender);
      }
    }

    return this.http
      .get<User[]>(`${this.apiUrl}/users`, { params, observe: 'response' })
      .pipe(
        map((response) => this.processResponse(response)),
        catchError((error) => {
          console.error('Error fetching users:', error);
          return throwError(() => new Error('Failed to load users from API'));
        })
      );
  }

  private combineSearchResults(
    filter: UserFilter,
    page: number,
    perPage: number
  ): Observable<UserResponse> {
    return this.searchByField('name', filter, page, perPage).pipe(
      map((response) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      })
    );
  }

  private processResponse(response: HttpResponse<User[]>): UserResponse {
    const totalCount = parseInt(
      response.headers.get('x-pagination-total') || '0',
      10
    );
    const totalPages = parseInt(
      response.headers.get('x-pagination-pages') || '0',
      10
    );
    const currentPage = parseInt(
      response.headers.get('x-pagination-page') || '0',
      10
    );
    const perPage = parseInt(
      response.headers.get('x-pagination-limit') || '0',
      10
    );

    const remainingItems = totalCount - (currentPage - 1) * perPage;
    const expectedItemsOnPage = Math.min(remainingItems, perPage);

    const items = response.body || [];
    const paginatedItems = items.slice(0, expectedItemsOnPage);

    return {
      data: paginatedItems,
      meta: {
        pagination: {
          total: totalCount,
          pages: totalPages,
          page: currentPage,
          limit: perPage,
        },
      },
    };
  }

  getUserById(id: number): Observable<User | undefined> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching user:', error);
        return throwError(() => new Error('Failed to load user'));
      })
    );
  }

  createUser(userData: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData).pipe(
      catchError((error) => {
        console.error('Error creating user:', error);
        return throwError(() => new Error('Failed to create user'));
      })
    );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${user.id}`, user).pipe(
      catchError((error) => {
        console.error('Error updating user:', error);
        return throwError(() => new Error('Failed to update user'));
      })
    );
  }

  deleteUser(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/users/${id}`).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error deleting user:', error);
        return throwError(() => new Error('Failed to delete user'));
      })
    );
  }

  private searchByField(
    field: string,
    filter: UserFilter,
    page: number,
    perPage: number
  ): Observable<UserResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (filter.searchTerm) {
      params = params.set(field, filter.searchTerm);
    }

    if (filter.status && filter.status !== 'all') {
      params = params.set('status', filter.status);
    }
    if (filter.gender && filter.gender !== 'all') {
      params = params.set('gender', filter.gender);
    }

    return this.http
      .get<User[]>(`${this.apiUrl}/users`, { params, observe: 'response' })
      .pipe(
        map((response) => this.processResponse(response)),
        catchError((error) => {
          console.error(`Error searching by ${field}:`, error);
          return of({
            data: [],
            meta: {
              pagination: { total: 0, pages: 0, page: 1, limit: perPage },
            },
          });
        })
      );
  }
}

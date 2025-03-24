import { Injectable } from '@angular/core';

import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

interface AuthState {
  isAuthenticated: boolean;
  username: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_TOKEN = environment.apiToken;

  private authState: AuthState = {
    isAuthenticated: false,
    username: '',
    token: this.API_TOKEN,
  };

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  private usernameSubject = new BehaviorSubject<string>('');
  public username$: Observable<string> = this.usernameSubject.asObservable();

  constructor() {
    this.loadAuthStateFromStorage();
  }

  login(username: string = 'admin'): void {
    this.authState = {
      isAuthenticated: true,
      username,
      token: this.API_TOKEN,
    };

    this.isAuthenticatedSubject.next(true);
    this.usernameSubject.next(username);

    this.saveAuthStateToStorage();
  }

  logout(): void {
    this.authState = {
      isAuthenticated: false,
      username: '',
      token: this.API_TOKEN,
    };

    this.isAuthenticatedSubject.next(false);
    this.usernameSubject.next('');

    sessionStorage.removeItem('authState');
  }

  isLoggedIn(): boolean {
    return this.authState.isAuthenticated;
  }

  getUsername(): string {
    return this.authState.username;
  }

  getToken(): string {
    return this.authState.token;
  }

  private loadAuthStateFromStorage(): void {
    const storedState = sessionStorage.getItem('authState');
    if (storedState) {
      try {
        const parsedState = JSON.parse(storedState) as AuthState;
        this.authState = parsedState;
        this.isAuthenticatedSubject.next(parsedState.isAuthenticated);
        this.usernameSubject.next(parsedState.username);
      } catch (e) {
        console.error('Error parsing auth state from storage', e);
        sessionStorage.removeItem('authState');
      }
    }
  }

  private saveAuthStateToStorage(): void {
    sessionStorage.setItem('authState', JSON.stringify(this.authState));
  }
}

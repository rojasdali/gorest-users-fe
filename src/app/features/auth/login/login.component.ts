import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material.module';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  readonly usernameMinLength = 3;
  readonly usernameMaxLength = 20;
  readonly passwordMinLength = 6;
  readonly passwordMaxLength = 30;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(this.usernameMinLength),
          Validators.maxLength(this.usernameMaxLength),
          Validators.pattern(/^[a-zA-Z0-9_-]*$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(this.passwordMinLength),
          Validators.maxLength(this.passwordMaxLength),
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { username, password } = this.loginForm.value;

    if (username && password) {
      this.authService.login(username);
      this.router.navigate(['/users']);
    } else {
      this.error = 'Please enter both username and password';
      this.loading = false;
    }
  }

  get usernameControl() {
    return this.loginForm.get('username');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }
}

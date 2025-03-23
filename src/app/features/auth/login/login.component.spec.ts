import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { MaterialModule } from '@shared/material.module';
import { AuthService } from '@core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        MaterialModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should authenticate user with correct credentials', () => {
    component.loginForm.controls['username'].setValue('admin');
    component.loginForm.controls['password'].setValue('MoCaFi');

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('admin');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should show error message with incorrect credentials', () => {
    component.loginForm.controls['username'].setValue('wronguser');
    component.loginForm.controls['password'].setValue('wrongpass');

    component.onSubmit();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(component.error).toContain('Invalid credentials');
  });
});

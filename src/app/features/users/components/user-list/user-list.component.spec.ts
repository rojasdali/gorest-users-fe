import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';


import { NotificationService } from '@core/services/notification.service';
import { UserService } from '@users/services';

import { UserListComponent } from './user-list.component';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let notificationServiceMock: jasmine.SpyObj<NotificationService>;
  let snackbarRefMock: jasmine.SpyObj<MatSnackBarRef<TextOnlySnackBar>>;

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', [
      'getUsers',
      'updateUser',
      'deleteUser',
    ]);
    userServiceMock.getUsers.and.returnValue(
      of({
        data: [],
        meta: { pagination: { total: 0, pages: 0, page: 1, limit: 10 } },
      })
    );

    snackbarRefMock = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);
    notificationServiceMock = jasmine.createSpyObj('NotificationService', [
      'showInfo',
      'showSuccess',
      'showError',
      'dismiss',
    ]);
    notificationServiceMock.showInfo.and.returnValue(snackbarRefMock);

    await TestBed.configureTestingModule({
      imports: [
        UserListComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

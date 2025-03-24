import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { UserFormService } from '@users/services';

import { UserEditDialogComponent } from './user-edit-dialog.component';

describe('UserEditDialogComponent', () => {
  let component: UserEditDialogComponent;
  let fixture: ComponentFixture<UserEditDialogComponent>;

  beforeEach(async () => {
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    const mockUserFormService = jasmine.createSpyObj('UserFormService', [
      'buildUserForm',
      'hasFormChanged',
    ]);

    const formGroup = new FormGroup({
      name: new FormControl('Test User'),
      email: new FormControl('test@example.com'),
      gender: new FormControl('male'),
      status: new FormControl('active'),
    });

    mockUserFormService.buildUserForm.and.returnValue(formGroup);
    mockUserFormService.hasFormChanged.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [
        UserEditDialogComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: UserFormService, useValue: mockUserFormService },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            user: {
              id: 1,
              name: 'Test User',
              email: 'test@example.com',
              gender: 'male',
              status: 'active',
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

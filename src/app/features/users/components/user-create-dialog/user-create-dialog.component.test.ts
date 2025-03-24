import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MaterialModule } from '@shared/material.module';
import { UserCreateDialogComponent } from '@users/components/user-create-dialog/user-create-dialog.component';

describe('UserCreateDialogComponent', () => {
  let component: UserCreateDialogComponent;
  let fixture: ComponentFixture<UserCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreateDialogComponent, MaterialModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close'),
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            userId: 1,
            userName: 'Test User',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

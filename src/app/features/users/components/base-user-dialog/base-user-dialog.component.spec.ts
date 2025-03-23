import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';

import { BaseUserDialogComponent } from './base-user-dialog.component';
import { UserFormService } from '@users/services';

@Component({
  selector: 'app-test-dialog',
  template: '<div></div>',
  standalone: true,
  imports: [ReactiveFormsModule],
})
class TestDialogComponent extends BaseUserDialogComponent {
  onSubmit(): void {}

  public testInitializeForm(): void {
    this.initializeForm();
  }
}

describe('BaseUserDialogComponent', () => {
  let component: TestDialogComponent;
  let fixture: ComponentFixture<TestDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<BaseUserDialogComponent>>;
  let mockUserFormService: jasmine.SpyObj<UserFormService>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockUserFormService = jasmine.createSpyObj('UserFormService', [
      'buildUserForm',
    ]);
    mockUserFormService.buildUserForm.and.returnValue({} as any);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule, TestDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: UserFormService, useValue: mockUserFormService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestDialogComponent);
    component = fixture.componentInstance;
    component.testInitializeForm();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { MaterialModule } from '@shared/material.module';
import { User } from '@users/models';
import { UserFormService } from '@users/services';

import { BaseUserDialogComponent } from '../base-user-dialog/base-user-dialog.component';

@Component({
  selector: 'app-user-create-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './user-create-dialog.component.html',
  styleUrl: './user-create-dialog.component.scss',
})
export class UserCreateDialogComponent extends BaseUserDialogComponent {
  constructor(
    dialogRef: MatDialogRef<UserCreateDialogComponent>,
    userFormService: UserFormService
  ) {
    super(dialogRef, userFormService);
    this.initializeForm();
  }

  override onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const optimisticUser: User = {
      ...this.userForm.value,
      id: -Math.floor(Math.random() * 1000) - 1,
    };

    this.dialogRef.close({
      formData: this.userForm.value,
      optimisticUser,
    });
  }
}

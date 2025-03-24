import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { MaterialModule } from '@shared/material.module';
import { User } from '@users/models/user.model';
import { UserFormService } from '@users/services';

import { BaseUserDialogComponent } from '../base-user-dialog/base-user-dialog.component';

@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './user-edit-dialog.component.html',
  styleUrl: './user-edit-dialog.component.scss',
})
export class UserEditDialogComponent
  extends BaseUserDialogComponent
  implements OnInit, OnDestroy
{
  formChanged = false;
  private valueChangesSubscription?: Subscription;

  constructor(
    dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    userFormService: UserFormService
  ) {
    super(dialogRef, userFormService);
    this.initializeForm(this.data.user);
  }

  ngOnInit(): void {
    this.userForm.markAsPristine();

    this.valueChangesSubscription = this.userForm.valueChanges.subscribe(() => {
      this.formChanged = this.userFormService.hasFormChanged(
        this.userForm,
        this.data.user
      );

      Object.keys(this.userForm.controls).forEach((key) => {
        const control = this.userForm.get(key);
        if (control && control.value !== this.data.user?.[key as keyof User]) {
          control.markAsTouched();
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }

  override onSubmit(): void {
    if (this.userForm.invalid || !this.formChanged) {
      return;
    }

    this.loading = true;

    const updatedUser = {
      ...this.userForm.value,
      id: this.data.user.id,
    };

    this.dialogRef.close(updatedUser);
  }

  protected override initializeForm(user?: User): void {
    this.userForm = this.userFormService.buildUserForm(user);
  }
}

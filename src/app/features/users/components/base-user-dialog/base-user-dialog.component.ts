import { Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { User } from '@users/models';
import { UserFormService } from '@users/services';

@Directive()
export abstract class BaseUserDialogComponent {
  userForm!: FormGroup;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<BaseUserDialogComponent>,
    protected userFormService: UserFormService
  ) {}

  protected initializeForm(user?: User): void {
    this.userForm = this.userFormService.buildUserForm(user);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  shouldShowErrors(controlName: string): boolean {
    const control = this.userForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  getErrorMessage(controlName: string): string {
    const control = this.userForm.get(controlName);

    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const firstError = Object.keys(control.errors)[0];
    if (control.errors[firstError].message) {
      return control.errors[firstError].message;
    }

    switch (firstError) {
      case 'required':
        return `This field is required`;
      case 'email':
        return `Please enter a valid email address`;
      case 'minlength':
        return `Minimum length is ${control.errors[firstError].requiredLength} characters`;
      case 'maxlength':
        return `Maximum length is ${control.errors[firstError].requiredLength} characters`;
      default:
        return `Invalid value`;
    }
  }

  // will be used in child components
  abstract onSubmit(): void;
}

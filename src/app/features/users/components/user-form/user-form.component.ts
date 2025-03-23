import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '@users/models';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  @Input() user?: User;
  @Input() loading = false;
  @Output() save = new EventEmitter<Omit<User, 'id'>>();
  @Output() cancel = new EventEmitter<void>();

  userForm: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) {
    this.userForm = this.createForm();
  }

  ngOnInit(): void {
    this.isEditMode = !!this.user;

    if (this.user) {
      this.userForm.patchValue(this.user);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['male', Validators.required],
      status: ['active', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.save.emit(this.userForm.value);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  get title(): string {
    return this.isEditMode ? 'Edit User' : 'Create New User';
  }

  get submitButtonText(): string {
    return this.isEditMode ? 'Update' : 'Create';
  }
}

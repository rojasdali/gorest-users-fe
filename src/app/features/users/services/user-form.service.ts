import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserValidators } from '@users/validators/user.validators';
import { User } from '@users/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserFormService {
  constructor(private fb: FormBuilder) {}

  buildUserForm(user?: User): FormGroup {
    return this.fb.group({
      name: [
        user?.name || '',
        [
          UserValidators.required('Name'),
          UserValidators.minLength(3, 'Name'),
          UserValidators.maxLength(100, 'Name'),
        ],
      ],
      email: [
        user?.email || '',
        [
          UserValidators.required('Email'),
          UserValidators.email(),
          UserValidators.maxLength(255, 'Email'),
        ],
      ],
      gender: [
        user?.gender || 'male',
        [
          UserValidators.required('Gender'),
          UserValidators.oneOf(
            ['male', 'female'],
            'Please select a valid gender'
          ),
        ],
      ],
      status: [
        user?.status || 'active',
        [
          UserValidators.required('Status'),
          UserValidators.oneOf(
            ['active', 'inactive'],
            'Please select a valid status'
          ),
        ],
      ],
    });
  }

  hasFormChanged(form: FormGroup, originalUser?: User): boolean {
    if (!form.dirty || !originalUser) {
      return form.dirty;
    }

    const formValue = form.value;

    return (
      formValue.name !== originalUser.name ||
      formValue.email !== originalUser.email ||
      formValue.gender !== originalUser.gender ||
      formValue.status !== originalUser.status
    );
  }
}

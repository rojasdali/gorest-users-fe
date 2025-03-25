import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export class UserValidators {
  private static readonly emailPattern =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  static required(fieldName: string = 'This field'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid =
        control.value !== null &&
        control.value !== undefined &&
        control.value !== '';
      return isValid
        ? null
        : {
            required: { message: `${fieldName} is required` },
          };
    };
  }

  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const isValid = UserValidators.emailPattern.test(control.value);
      return isValid
        ? null
        : { email: { message: 'Please enter a valid email address' } };
    };
  }

  static minLength(
    length: number,
    fieldName: string = 'This field'
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const validator = Validators.minLength(length);
      const isValid = validator(control) === null;
      return isValid
        ? null
        : {
            minlength: {
              message: `${fieldName} must be at least ${length} characters`,
              requiredLength: length,
              actualLength: control.value?.length || 0,
            },
          };
    };
  }

  static maxLength(
    length: number,
    fieldName: string = 'This field'
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const validator = Validators.maxLength(length);
      const isValid = validator(control) === null;
      return isValid
        ? null
        : {
            maxlength: {
              message: `${fieldName} cannot exceed ${length} characters`,
              requiredLength: length,
              actualLength: control.value?.length || 0,
            },
          };
    };
  }

  static oneOf<T>(
    allowedValues: T[],
    errorMessage: string = 'Invalid selection'
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const isValid = allowedValues.includes(control.value as T);
      return isValid
        ? null
        : { oneOf: { message: errorMessage, allowedValues } };
    };
  }
}

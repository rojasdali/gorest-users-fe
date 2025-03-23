import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export class UserValidators {
  private static readonly emailPattern =
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

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

  static oneOf(
    allowedValues: any[],
    errorMessage: string = 'Invalid selection'
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const isValid = allowedValues.includes(control.value);
      return isValid
        ? null
        : { oneOf: { message: errorMessage, allowedValues } };
    };
  }
}

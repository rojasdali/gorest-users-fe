import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  readonly emailPattern =
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

  constructor() {}

  emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const email = control.value;

      if (!email) {
        return null;
      }

      if (!this.emailPattern.test(email)) {
        return { invalidEmailFormat: true };
      }

      if (email.split('@')[0].includes('..')) {
        return { consecutiveDots: true };
      }

      const localPart = email.split('@')[0];
      if (localPart.length > 64) {
        return { localPartTooLong: true };
      }

      const domainPart = email.split('@')[1];
      if (domainPart && domainPart.length > 255) {
        return { domainTooLong: true };
      }

      return null;
    };
  }

  getEmailErrorMessage(control: AbstractControl): string {
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Email is required';
    }

    if (
      control.hasError('email') ||
      control.hasError('pattern') ||
      control.hasError('invalidEmailFormat')
    ) {
      return 'Please enter a valid email address';
    }

    if (control.hasError('consecutiveDots')) {
      return 'Email cannot contain consecutive dots';
    }

    if (control.hasError('localPartTooLong')) {
      return 'Email username part is too long';
    }

    if (control.hasError('domainTooLong')) {
      return 'Email domain is too long';
    }

    return 'Invalid email format';
  }
}

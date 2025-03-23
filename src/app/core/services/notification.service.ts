import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };

  private successConfig: MatSnackBarConfig = {
    ...this.defaultConfig,
    panelClass: ['success-snackbar'],
  };

  private errorConfig: MatSnackBarConfig = {
    ...this.defaultConfig,
    panelClass: ['error-snackbar'],
    duration: 8000,
  };

  private infoConfig: MatSnackBarConfig = {
    ...this.defaultConfig,
    panelClass: ['info-snackbar'],
  };

  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', this.successConfig);
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Close', this.errorConfig);
  }

  showInfo(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, 'Close', {
      ...this.infoConfig,
      duration: undefined,
    });
  }

  dismiss(snackBarRef: MatSnackBarRef<TextOnlySnackBar>): void {
    if (snackBarRef) {
      snackBarRef.dismiss();
    }
  }
}

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface DeleteDialogData {
  userId: number;
  userName: string;
}

@Component({
  selector: 'app-user-delete-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './user-delete-dialog.component.html',
  styleUrl: './user-delete-dialog.component.scss',
})
export class UserDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(this.data.userId);
  }
}

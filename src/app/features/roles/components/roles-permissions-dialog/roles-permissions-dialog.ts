import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  imports: [MatButtonModule, MatChipsModule, MatDialogModule],
  selector: 'app-roles-permissions-dialog',
  styleUrl: './roles-permissions-dialog.css',
  templateUrl: './roles-permissions-dialog.html',
})
export class RolesPermissionsDialog {
  private dialogRef = inject(MatDialogRef<RolesPermissionsDialog>);
  data: any = inject(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }
}

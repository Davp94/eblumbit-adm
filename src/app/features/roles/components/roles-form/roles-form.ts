import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RolesRequest } from '../../../../core/models/roles/RolesRequest';
import { RolesResponse } from '../../../../core/models/roles/RolesResponse';

@Component({
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  selector: 'app-roles-form',
  templateUrl: './roles-form.html',
})
export class RolesForm {
  private fb = inject(FormBuilder).nonNullable;
  private dialogRef = inject(MatDialogRef<RolesForm>);
  data: Partial<RolesResponse> = inject(MAT_DIALOG_DATA);
  isEditMode = !!this.data.id;

  roleForm = this.fb.group({
    nombre: [this.data.nombre ?? '', Validators.required],
    descripcion: [this.data.descripcion ?? '', Validators.required],
    permisosIds: [
      (this.data.permisosIds ?? []).join(', '),
      this.validatePermissionIds,
    ],
  });

  onSubmit(): void {
    if (this.roleForm.invalid) return;

    const value = this.roleForm.getRawValue();
    const request: RolesRequest = {
      nombre: value.nombre.trim(),
      descripcion: value.descripcion.trim(),
      permisosIds: value.permisosIds.trim()
        ? value.permisosIds.split(',').map((id) => Number(id.trim()))
        : [],
    };
    this.dialogRef.close(request);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private validatePermissionIds(control: AbstractControl): ValidationErrors | null {
    const value = String(control.value).trim();
    if (!value) return null;

    const ids = value.split(',').map((id) => id.trim());
    return ids.every((id) => /^\d+$/.test(id)) ? null : { invalidPermissionIds: true };
  }
}

import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PermisosRequest } from '../../../../core/models/permisos/PermisosRequest';
import { PermisosResponse } from '../../../../core/models/permisos/PermisosResponse';

@Component({
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  selector: 'app-permisos-form',
  templateUrl: './permisos-form.html',
})
export class PermisosForm {
  private fb = inject(FormBuilder).nonNullable;
  private dialogRef = inject(MatDialogRef<PermisosForm>);
  data: Partial<PermisosResponse> = inject(MAT_DIALOG_DATA);
  isEditMode = !!this.data.id;

  permisoForm = this.fb.group({
    nombre: [this.data.nombre ?? '', Validators.required],
    detalle: [this.data.detalle ?? '', Validators.required],
    descripcion: [this.data.descripcion ?? '', Validators.required],
    subject: [this.data.subject ?? '', Validators.required],
    action: [this.data.action ?? '', Validators.required],
  });

  onSubmit(): void {
    if (this.permisoForm.invalid) return;

    const value = this.permisoForm.getRawValue();
    const request: PermisosRequest = {
      nombre: value.nombre.trim(),
      detalle: value.detalle.trim(),
      descripcion: value.descripcion.trim(),
      subject: value.subject.trim(),
      action: value.action.trim(),
    };
    this.dialogRef.close(request);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

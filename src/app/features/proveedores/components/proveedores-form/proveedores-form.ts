import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProveedorRequest } from '../../../../core/models/proveedores/ProveedorRequest';
import { ProveedorResponse } from '../../../../core/models/proveedores/ProveedorResponse';

@Component({
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  selector: 'app-proveedores-form',
  templateUrl: './proveedores-form.html',
})
export class ProveedoresForm {
  private fb = inject(FormBuilder).nonNullable;
  private dialogRef = inject(MatDialogRef<ProveedoresForm, ProveedorRequest>);
  data: Partial<ProveedorResponse> = inject(MAT_DIALOG_DATA);
  isEditMode = !!this.data.id;

  proveedorForm = this.fb.group({
    razonSocial: [this.data.razonSocial ?? '', Validators.required],
    nroIdentificacion: [this.data.nroIdentificacion ?? '', Validators.required],
    contacto: [this.data.contacto ?? '', Validators.required],
    telefono: [this.data.telefono ?? '', Validators.required],
    correo: [this.data.correo ?? '', [Validators.required, Validators.email]],
    observaciones: [this.data.observaciones ?? ''],
  });

  onSubmit(): void {
    if (this.proveedorForm.invalid) {
      this.proveedorForm.markAllAsTouched();
      return;
    }

    const value = this.proveedorForm.getRawValue();
    this.dialogRef.close({
      razonSocial: value.razonSocial.trim(),
      nroIdentificacion: value.nroIdentificacion.trim(),
      contacto: value.contacto.trim(),
      telefono: value.telefono.trim(),
      correo: value.correo.trim(),
      observaciones: value.observaciones.trim(),
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

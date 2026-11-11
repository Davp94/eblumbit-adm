import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SucursalRequest } from '../../../../core/models/sucursal/SucursalRequest';
import { SucursalResponse } from '../../../../core/models/sucursal/SucursalResponse';

@Component({
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  selector: 'app-sucursales-form',
  templateUrl: './sucursales-form.html',
})
export class SucursalesForm {
  private fb = inject(FormBuilder).nonNullable;
  private dialogRef = inject(MatDialogRef<SucursalesForm, SucursalRequest>);
  data: Partial<SucursalResponse> = inject(MAT_DIALOG_DATA);
  isEditMode = !!this.data.id;

  sucursalForm = this.fb.group({
    nombre: [this.data.nombre ?? '', Validators.required],
    direccion: [this.data.direccion ?? '', Validators.required],
    telefono: [this.data.telefono ?? '', Validators.required],
    ciudad: [this.data.ciudad ?? '', Validators.required],
  });

  onSubmit(): void {
    if (this.sucursalForm.invalid) {
      this.sucursalForm.markAllAsTouched();
      return;
    }

    const value = this.sucursalForm.getRawValue();
    this.dialogRef.close({
      nombre: value.nombre.trim(),
      direccion: value.direccion.trim(),
      telefono: value.telefono.trim(),
      ciudad: value.ciudad.trim(),
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

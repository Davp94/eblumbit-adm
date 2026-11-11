import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AlmacenRequest } from '../../../../core/models/almacen/AlmacenRequest';
import { AlmacenResponse } from '../../../../core/models/almacen/AlmacenResponse';
import { SucursalResponse } from '../../../../core/models/sucursal/SucursalResponse';

interface AlmacenFormData {
  almacen?: AlmacenResponse;
  sucursales: SucursalResponse[];
}

@Component({
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  selector: 'app-almacenes-form',
  templateUrl: './almacenes-form.html',
})
export class AlmacenesForm {
  private fb = inject(FormBuilder).nonNullable;
  private dialogRef = inject(MatDialogRef<AlmacenesForm, AlmacenRequest>);
  data = inject<AlmacenFormData>(MAT_DIALOG_DATA);
  isEditMode = !!this.data.almacen?.id;

  almacenForm = this.fb.group({
    codigo: [this.data.almacen?.codigo ?? '', Validators.required],
    nombre: [this.data.almacen?.nombre ?? '', Validators.required],
    descripcion: [this.data.almacen?.descripcion ?? '', Validators.required],
    sucursalId: [this.data.almacen?.sucursalId ?? 0, [Validators.required, Validators.min(1)]],
  });

  onSubmit(): void {
    if (this.almacenForm.invalid) {
      this.almacenForm.markAllAsTouched();
      return;
    }

    const value = this.almacenForm.getRawValue();
    this.dialogRef.close({
      codigo: value.codigo.trim(),
      nombre: value.nombre.trim(),
      descripcion: value.descripcion.trim(),
      sucursalId: value.sucursalId,
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

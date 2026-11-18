import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CompraResponse } from '../../../core/models/compras/CompraResponse';

@Component({
  imports: [DecimalPipe, MatButtonModule, MatDialogModule, MatTableModule],
  selector: 'app-compra-detail-dialog',
  templateUrl: './compra-detail-dialog.html',
})
export class CompraDetailDialog {
  private dialogRef = inject(MatDialogRef<CompraDetailDialog>);
  data = inject<CompraResponse>(MAT_DIALOG_DATA);
  detalles = this.data.detalleCompra ?? [];
  displayedColumns = [
    'productoNombre',
    'almacenNombre',
    'cantidad',
    'precioUnitarioCompra',
    'observaciones',
  ];

  close(): void {
    this.dialogRef.close();
  }
}

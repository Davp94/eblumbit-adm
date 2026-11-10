import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InventarioTable } from './components/inventario-table/inventario-table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductosForm } from './components/productos-form/productos-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InventarioService } from '../../core/services/inventario-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoRequest } from '../../core/models/inventario/ProductoRequest';

@Component({
  imports: [MatAnchor, MatIconModule, InventarioTable, MatButtonModule, MatDialogModule],
  selector: 'app-inventario',
  styleUrl: './inventario.css',
  templateUrl: './inventario.html',
})
export class Inventario implements OnInit{
  private dialog = inject(MatDialog);
  private inventarioService = inject(InventarioService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  openCreateProductoModal(): void {
    this.dialog.open(ProductosForm, {width: '700px', maxWidth: '90vw'})
    .afterClosed()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (request: ProductoRequest) => {
        this.inventarioService.createProducto(request)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.snackBar.open('producto creado exitosamente', 'Cerrar', {duration: 3000})
          },
          error: () => {
            this.snackBar.open('Error al crear el producto', 'Cerrar', {duration: 3000})
          }
        })
      },

    })
  }
}

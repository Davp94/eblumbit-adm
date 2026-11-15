import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ProveedorRequest } from '../../../../core/models/proveedores/ProveedorRequest';
import { ProveedorResponse } from '../../../../core/models/proveedores/ProveedorResponse';
import { ProveedoresService } from '../../../../core/services/proveedores-service';
import { ProveedoresForm } from '../proveedores-form/proveedores-form';

@Component({
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
  ],
  selector: 'app-proveedores-table',
  templateUrl: './proveedores-table.html',
})
export class ProveedoresTable implements OnInit {
  private proveedoresService = inject(ProveedoresService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  proveedores = signal<ProveedorResponse[]>([]);
  isLoading = signal(true);
  displayedColumns = ['id', 'razonSocial', 'nroIdentificacion', 'contacto', 'telefono', 'correo', 'estado', 'acciones'];

  ngOnInit(): void {
    this.loadProveedores();
  }

  loadProveedores(): void {
    this.isLoading.set(true);
    this.proveedoresService.getProveedores().subscribe({
      next: (proveedores) => {
        this.proveedores.set(proveedores);
        this.isLoading.set(false);
      },
      error: () => {
        this.showNotification('Error al cargar los proveedores');
        this.isLoading.set(false);
      },
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(ProveedoresForm, { width: '600px', data: {} });
    dialogRef.afterClosed().subscribe((result: ProveedorRequest | undefined) => {
      if (!result) return;

      this.proveedoresService.createProveedor(result).subscribe({
        next: () => {
          this.showNotification('Proveedor creado exitosamente');
          this.loadProveedores();
        },
        error: () => this.showNotification('Error al crear el proveedor'),
      });
    });
  }

  openEditModal(proveedor: ProveedorResponse): void {
    const dialogRef = this.dialog.open(ProveedoresForm, { width: '600px', data: proveedor });
    dialogRef.afterClosed().subscribe((result: ProveedorRequest | undefined) => {
      if (!result) return;

      this.proveedoresService.updateProveedor(proveedor.id, result).subscribe({
        next: () => {
          this.showNotification('Proveedor actualizado exitosamente');
          this.loadProveedores();
        },
        error: () => this.showNotification('Error al actualizar el proveedor'),
      });
    });
  }

  deleteProveedor(id: number): void {
    if (!confirm('¿Está seguro que desea eliminar este proveedor?')) return;

    this.proveedoresService.deleteProveedor(id).subscribe({
      next: () => {
        this.showNotification('Proveedor eliminado exitosamente');
        this.loadProveedores();
      },
      error: () => this.showNotification('Error al eliminar el proveedor'),
    });
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}

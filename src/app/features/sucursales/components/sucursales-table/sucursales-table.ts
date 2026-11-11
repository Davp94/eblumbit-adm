import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { SucursalRequest } from '../../../../core/models/sucursal/SucursalRequest';
import { SucursalResponse } from '../../../../core/models/sucursal/SucursalResponse';
import { SucursalService } from '../../../../core/services/sucursal-service';
import { SucursalesForm } from '../sucursales-form/sucursales-form';

@Component({
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
  ],
  selector: 'app-sucursales-table',
  templateUrl: './sucursales-table.html',
})
export class SucursalesTable implements OnInit {
  private sucursalService = inject(SucursalService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  sucursales = signal<SucursalResponse[]>([]);
  isLoading = signal(true);
  displayedColumns = ['id', 'nombre', 'direccion', 'telefono', 'ciudad', 'acciones'];

  ngOnInit(): void {
    this.loadSucursales();
  }

  loadSucursales(): void {
    this.isLoading.set(true);
    this.sucursalService.getSucursales().subscribe({
      next: (sucursales) => {
        this.sucursales.set(sucursales);
        this.isLoading.set(false);
      },
      error: () => {
        this.showNotification('Error al cargar las sucursales');
        this.isLoading.set(false);
      },
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(SucursalesForm, { width: '600px', data: {} });
    dialogRef.afterClosed().subscribe((result: SucursalRequest | undefined) => {
      if (!result) return;

      this.sucursalService.createSucursal(result).subscribe({
        next: () => {
          this.showNotification('Sucursal creada exitosamente');
          this.loadSucursales();
        },
        error: () => this.showNotification('Error al crear la sucursal'),
      });
    });
  }

  openEditModal(sucursal: SucursalResponse): void {
    const dialogRef = this.dialog.open(SucursalesForm, { width: '600px', data: sucursal });
    dialogRef.afterClosed().subscribe((result: SucursalRequest | undefined) => {
      if (!result) return;

      this.sucursalService.updateSucursal(sucursal.id, result).subscribe({
        next: () => {
          this.showNotification('Sucursal actualizada exitosamente');
          this.loadSucursales();
        },
        error: () => this.showNotification('Error al actualizar la sucursal'),
      });
    });
  }

  deleteSucursal(id: number): void {
    if (!confirm('¿Está seguro que desea eliminar esta sucursal?')) return;

    this.sucursalService.deleteSucursal(id).subscribe({
      next: () => {
        this.showNotification('Sucursal eliminada exitosamente');
        this.loadSucursales();
      },
      error: () => this.showNotification('Error al eliminar la sucursal'),
    });
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}

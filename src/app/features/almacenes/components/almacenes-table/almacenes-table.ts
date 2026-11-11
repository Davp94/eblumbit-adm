import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { AlmacenRequest } from '../../../../core/models/almacen/AlmacenRequest';
import { AlmacenResponse } from '../../../../core/models/almacen/AlmacenResponse';
import { SucursalResponse } from '../../../../core/models/sucursal/SucursalResponse';
import { AlmacenService } from '../../../../core/services/almacen-service';
import { SucursalService } from '../../../../core/services/sucursal-service';
import { AlmacenesForm } from '../almacenes-form/almacenes-form';

@Component({
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
  ],
  selector: 'app-almacenes-table',
  templateUrl: './almacenes-table.html',
})
export class AlmacenesTable implements OnInit {
  private almacenService = inject(AlmacenService);
  private sucursalService = inject(SucursalService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  almacenes = signal<AlmacenResponse[]>([]);
  sucursales = signal<SucursalResponse[]>([]);
  isLoading = signal(true);
  isSucursalesLoading = signal(true);
  displayedColumns = ['id', 'codigo', 'nombre', 'descripcion', 'sucursalNombre', 'acciones'];

  ngOnInit(): void {
    this.loadAlmacenes();
    this.loadSucursales();
  }

  loadAlmacenes(): void {
    this.isLoading.set(true);
    this.almacenService.getAlmacenes().subscribe({
      next: (almacenes) => {
        this.almacenes.set(almacenes);
        this.isLoading.set(false);
      },
      error: () => {
        this.showNotification('Error al cargar los almacenes');
        this.isLoading.set(false);
      },
    });
  }

  loadSucursales(): void {
    this.isSucursalesLoading.set(true);
    this.sucursalService.getSucursales().subscribe({
      next: (sucursales) => {
        this.sucursales.set(sucursales);
        this.isSucursalesLoading.set(false);
      },
      error: () => {
        this.showNotification('Error al cargar las sucursales para los almacenes');
        this.isSucursalesLoading.set(false);
      },
    });
  }

  openCreateModal(): void {
    if (this.sucursales().length === 0) {
      this.showNotification('Debe registrar al menos una sucursal para crear un almacén');
      return;
    }

    const dialogRef = this.dialog.open(AlmacenesForm, {
      width: '600px',
      data: { sucursales: this.sucursales() },
    });
    dialogRef.afterClosed().subscribe((result: AlmacenRequest | undefined) => {
      if (!result) return;

      this.almacenService.createAlmacen(result).subscribe({
        next: () => {
          this.showNotification('Almacén creado exitosamente');
          this.loadAlmacenes();
        },
        error: () => this.showNotification('Error al crear el almacén'),
      });
    });
  }

  openEditModal(almacen: AlmacenResponse): void {
    if (this.sucursales().length === 0) {
      this.showNotification('No hay sucursales disponibles para editar el almacén');
      return;
    }

    const dialogRef = this.dialog.open(AlmacenesForm, {
      width: '600px',
      data: { almacen, sucursales: this.sucursales() },
    });
    dialogRef.afterClosed().subscribe((result: AlmacenRequest | undefined) => {
      if (!result) return;

      this.almacenService.updateAlmacen(almacen.id, result).subscribe({
        next: () => {
          this.showNotification('Almacén actualizado exitosamente');
          this.loadAlmacenes();
        },
        error: () => this.showNotification('Error al actualizar el almacén'),
      });
    });
  }

  deleteAlmacen(id: number): void {
    if (!confirm('¿Está seguro que desea eliminar este almacén?')) return;

    this.almacenService.deleteAlmacen(id).subscribe({
      next: () => {
        this.showNotification('Almacén eliminado exitosamente');
        this.loadAlmacenes();
      },
      error: () => this.showNotification('Error al eliminar el almacén'),
    });
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}

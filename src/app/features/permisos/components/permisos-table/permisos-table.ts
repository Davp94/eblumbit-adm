import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PermisosRequest } from '../../../../core/models/permisos/PermisosRequest';
import { PermisosResponse } from '../../../../core/models/permisos/PermisosResponse';
import { PermisosServices } from '../../../../core/services/permisos-services';
import { PermisosForm } from '../permisos-form/permisos-form';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule
  ],
  selector: 'app-permisos-table',
  templateUrl: './permisos-table.html',
})
export class PermisosTable implements OnInit {
  private permisosService = inject(PermisosServices);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  permisos = signal<PermisosResponse[]>([]);
  datasource = new MatTableDataSource<PermisosResponse>([]);
  isLoading = signal(true);
  displayedColumns = ['id', 'nombre', 'detalle', 'descripcion', 'subject', 'action', 'acciones'];

  @ViewChild(MatPaginator)
  set paginator(paginator: MatPaginator) {
    this.datasource.paginator = paginator;
  }
  ngOnInit(): void {
    this.loadPermisos();
  }

  loadPermisos(): void {
    this.isLoading.set(true);
    this.permisosService.getPermisos().subscribe({
      next: (permisos) => {
        this.permisos.set(permisos);
        this.datasource.data = permisos;
        this.isLoading.set(false);
      },
      error: () => {
        this.showNotification('Error al cargar los permisos');
        this.isLoading.set(false);
      },
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(PermisosForm, { width: '600px', data: {} });
    dialogRef.afterClosed().subscribe((result: PermisosRequest | undefined) => {
      if (!result) return;

      this.permisosService.createPermiso(result).subscribe({
        next: () => {
          this.showNotification('Permiso creado exitosamente');
          this.loadPermisos();
        },
        error: () => this.showNotification('Error al crear el permiso'),
      });
    });
  }

  openEditModal(permiso: PermisosResponse): void {
    const dialogRef = this.dialog.open(PermisosForm, { width: '600px', data: permiso });
    dialogRef.afterClosed().subscribe((result: PermisosRequest | undefined) => {
      if (!result) return;

      this.permisosService.updatePermiso(permiso.id, result).subscribe({
        next: () => {
          this.showNotification('Permiso actualizado exitosamente');
          this.loadPermisos();
        },
        error: () => this.showNotification('Error al actualizar el permiso'),
      });
    });
  }

  deletePermiso(id: number): void {
    if (!confirm('¿Está seguro que desea eliminar este permiso?')) return;

    this.permisosService.deletePermiso(id).subscribe({
      next: () => {
        this.showNotification('Permiso eliminado exitosamente');
        this.loadPermisos();
      },
      error: () => this.showNotification('Error al eliminar el permiso'),
    });
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}

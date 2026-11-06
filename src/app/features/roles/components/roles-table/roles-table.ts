import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RolesRequest } from '../../../../core/models/roles/RolesRequest';
import { RolesResponse } from '../../../../core/models/roles/RolesResponse';
import { RolesServices } from '../../../../core/services/roles-services';
import { RolesForm } from '../roles-form/roles-form';
import { RolesPermissionsDialog } from '../roles-permissions-dialog/roles-permissions-dialog';

@Component({
  imports: [
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
  ],
  selector: 'app-roles-table',
  templateUrl: './roles-table.html',
})
export class RolesTable implements OnInit {
  private rolesService = inject(RolesServices);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  roles = signal<RolesResponse[]>([]);
  isLoading = signal(true);
  displayedColumns = ['id', 'nombre', 'descripcion', 'permisosIds', 'acciones'];

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading.set(true);
    this.rolesService.getRoles().subscribe({
      next: (roles) => {
        this.roles.set(roles);
        this.isLoading.set(false);
      },
      error: () => {
        this.showNotification('Error al cargar los roles');
        this.isLoading.set(false);
      },
    });
  }

  openPermisosModal(role: RolesResponse): void {
    this.dialog.open(RolesPermissionsDialog, {
      width: '500px',
      data: {permisosIds: role.permisosIds},
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(RolesForm, { width: '500px', data: {} });
    dialogRef.afterClosed().subscribe((result: RolesRequest | undefined) => {
      if (!result) return;

      this.rolesService.createRole(result).subscribe({
        next: () => {
          this.showNotification('Rol creado exitosamente');
          this.loadRoles();
        },
        error: () => this.showNotification('Error al crear el rol'),
      });
    });
  }

  openEditModal(role: RolesResponse): void {
    const dialogRef = this.dialog.open(RolesForm, { width: '500px', data: role });
    dialogRef.afterClosed().subscribe((result: RolesRequest | undefined) => {
      if (!result) return;

      this.rolesService.updateRole(role.id, result).subscribe({
        next: () => {
          this.showNotification('Rol actualizado exitosamente');
          this.loadRoles();
        },
        error: () => this.showNotification('Error al actualizar el rol'),
      });
    });
  }

  deleteRole(id: number): void {
    if (!confirm('¿Está seguro que desea eliminar este rol?')) return;

    this.rolesService.deleteRole(id).subscribe({
      next: () => {
        this.showNotification('Rol eliminado exitosamente');
        this.loadRoles();
      },
      error: () => this.showNotification('Error al eliminar el rol'),
    });
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}

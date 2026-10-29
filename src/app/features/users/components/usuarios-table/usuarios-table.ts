import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { UsuariosServices } from '../../../../core/services/usuarios-services';
import { UsuariosResponse } from '../../../../core/models/usuarios/UsuariosResponse';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { UsuariosForm } from '../usuarios-form/usuarios-form';
import { UsuariosRequest } from '../../../../core/models/usuarios/UsuariosRequest';
import { ɵEmptyOutletComponent } from '@angular/router';

@Component({
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    ɵEmptyOutletComponent
],
  selector: 'app-usuarios-table',
  styleUrl: './usuarios-table.css',
  templateUrl: './usuarios-table.html',
})
export class UsuariosTable implements OnInit{
  private usuariosService = inject(UsuariosServices);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  users = signal<UsuariosResponse[]>([]);
  isLoading = signal<boolean>(true);

  displayedColumns: string[] = ['id', 'nombreCompleto', 'username', 'email', 'rolIds', 'acciones'];
  
  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.usuariosService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.showNotification('Error al cargar los usuarios');
        this.isLoading.set(false);
      }
    })
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(UsuariosForm, {width: '500px', data: {}});
    dialogRef.afterClosed().subscribe((result: UsuariosRequest) => {
      if(result) {
        this.usuariosService.createUsuario(result).subscribe({
          next: () => {
            this.showNotification('Usuario creado exitosamente');
            this.loadUsers();
          },
          error: () => this.showNotification('Error al crear el usuario')
        })
      }
    })
  }

  openEditModal(user: UsuariosResponse): void {
    const dialogRef = this.dialog.open(UsuariosForm, { width: '500px', data: user });
    dialogRef.afterClosed().subscribe((result: UsuariosRequest) => {
      if(result) {
        this.usuariosService.updateUsuario(user.id, result).subscribe({
          next: () => {
            this.showNotification('Usuario actualizado exitosamente');
            this.loadUsers();
          },
          error: () => this.showNotification('Error al actualziar el usuario')
        })
      }
    })
  }

  deleteUser(id: number): void {
      if(confirm('Está seguro que desea eliminar este usuario?')) {
        this.usuariosService.deleteUsuario(id).subscribe({
          next: () => {
            this.showNotification('Usuario eliminado exitosamente');
            this.loadUsers();
          },
          error: () => this.showNotification('Error al eliminar el usuario')
        })
      }
  }

  private showNotification(message: string) {
    this.snackBar.open(message, 'Cerrar', {duration: 3000})
  }

}

import { Component, inject, output, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

@Component({
  imports: [MatButtonModule, MatIconModule, MatBadgeModule, MatFormFieldModule,
    MatInputModule, MatMenuModule, MatToolbarModule, MatTooltipModule,  
    MatSnackBarModule, MatDividerModule
  ],
  selector: 'app-topbar',
  styleUrl: './topbar.css',
  templateUrl: './topbar.html',
})
export class Topbar {
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  readonly toggleSidenav = output<void>();
  readonly unread = signal(3);

  currentUser = {
    name: "Usuario blumbit",
    email: "admin@blumbit.com",
    initials: "UB"
  }

  notifications = [
    {
      icon: 'login',
      title: 'Inicio de Sesion',
      detail: 'Nuevo registro realizado',
      time: 'hace 5 min'
    },
    {
      icon: 'block',
      title: 'Cuenta bloqueada',
      detail: 'Usuario bloqueado reintentos',
      time: 'hace 2 min'
    },
    {
      icon: 'description',
      title: 'Inicio de Sesion',
      detail: 'Nuevo registro realizado',
      time: 'hace 2 hrs'
    }
  ]

  markAllRead(): void {
    this.unread.set(0);
  }

  openPreferencias() {
    this.snackBar.open("Prefencias Opened", 'Cerrar', {duration: 3500})
  }

  logout() {
    this.router.navigateByUrl("/login");
  }
}

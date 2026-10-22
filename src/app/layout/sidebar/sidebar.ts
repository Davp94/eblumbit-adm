import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive, RouterLinkWithHref } from '@angular/router';

interface NavChild {
  label: string;
  route: string;
  badge: string;
  tone: 'income' | 'expense';
}
interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
  children?: NavChild[];
}
interface NavGroup {
  title: string;
  items: NavItem[];
}

@Component({
  imports: [RouterLinkActive, RouterLinkWithHref, MatIconModule, MatListModule,
    RouterLink
  ],
  selector: 'app-sidebar',
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly navigate = output<void>();

  navGroups: NavGroup[] = [
    {
      title: 'Plataforma',
      items: [
        { label: 'Dashboard', icon: 'dashboard', route: '/dashboard'},
        { label: 'Inventario', icon: 'inventory_2', route: '/inventario'},
        { label: 'Transacciones', icon: 'receipt_long', route: '/transacciones', badge: 'Activo',
          children: [
            {label: 'Compras', route: '/compras', badge: 'Ingreso', tone: 'income'},
            {label: 'Ventas', route: '/ventas', badge: 'Salida', tone: 'expense'}
          ]
        },
      ]
    }, 
    {
      title: 'Gestion',
      items: [
        { label: 'Usuarios', icon: 'group', route: '/usuarios'},
        { label: 'Sucursales', icon: 'home_work', route: '/sucursales'},
        { label: 'Clientes/proveedores', icon: 'handshake', route: '/clientes'},
      ]
    }
  ]
}

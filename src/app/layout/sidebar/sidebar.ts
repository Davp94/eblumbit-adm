import { Component } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
  badgeColor?: string;
}
interface NavGroup {
  title: string;
  items: NavItem[];
}

@Component({
  imports: [RouterLinkActive, RouterLinkWithHref],
  selector: 'app-sidebar',
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  navGroups: NavGroup[] = [
    {
      title: 'Plataforma',
      items: [
        { label: 'Dashboard', icon: 'grid_view', route: '/dashboard'},
        { label: 'Inventario', icon: 'grid_view', route: '/dashboard'},
        { label: 'Transacciones', icon: 'grid_view', route: '/dashboard'},
      ]
    }, 
    {
      title: 'Gestion',
      items: [
        { label: 'Usuarios', icon: 'manage_accounts', route: '/usuarios'},
        { label: 'Sucursales', icon: 'grid_view', route: '/sucursales'},
        { label: 'Clientes/proveedores', icon: 'grid_view', route: '/dashboard'},
      ]
    }
  ]
}

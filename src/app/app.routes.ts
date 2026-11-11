import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Sucursales } from './features/sucursales/sucursales';
import { Login } from './shared/components/login/login';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'usuarios',
                pathMatch: 'full'
            },
            {
                path: 'usuarios',
                loadComponent: () => 
                    import('./features/users/users').then(m=>m.Users),

            },
            {
                path: 'roles',
                loadComponent: () =>
                    import('./features/roles/roles').then(m => m.Roles),
            },
            {
                path: 'permisos',
                loadComponent: () =>
                    import('./features/permisos/permisos').then(m => m.Permisos),
            },
            {
                path: 'inventario',
                loadComponent: () =>
                    import('./features/inventario/inventario').then(m => m.Inventario),
            },
            {
                path: 'sucursales',
                component: Sucursales
            }
        ]
    },
    {
        path: 'login',
        component: Login
    },
    { path: '**', redirectTo: ''}
];

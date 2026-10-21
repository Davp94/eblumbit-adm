import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Sucursales } from './features/sucursales/sucursales';
import { Login } from './shared/components/login/login';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
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
                path: 'sucursales',
                component: Sucursales
            }
        ]
    },
    {
        path: 'login',
        component: Login
    }
];

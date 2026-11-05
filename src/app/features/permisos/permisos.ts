import { Component } from '@angular/core';
import { PermisosTable } from './components/permisos-table/permisos-table';

@Component({
  imports: [PermisosTable],
  selector: 'app-permisos',
  templateUrl: './permisos.html',
})
export class Permisos {}

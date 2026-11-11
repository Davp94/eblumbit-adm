import { Component } from '@angular/core';
import { SucursalesTable } from './components/sucursales-table/sucursales-table';

@Component({
  imports: [SucursalesTable],
  selector: 'app-sucursales',
  templateUrl: './sucursales.html',
})
export class Sucursales {}

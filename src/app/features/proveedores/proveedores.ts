import { Component } from '@angular/core';
import { ProveedoresTable } from './components/proveedores-table/proveedores-table';

@Component({
  imports: [ProveedoresTable],
  selector: 'app-proveedores',
  templateUrl: './proveedores.html',
})
export class Proveedores {}

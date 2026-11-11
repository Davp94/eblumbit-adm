import { Component } from '@angular/core';
import { AlmacenesTable } from './components/almacenes-table/almacenes-table';

@Component({
  imports: [AlmacenesTable],
  selector: 'app-almacenes',
  templateUrl: './almacenes.html',
})
export class Almacenes {}

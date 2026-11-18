import { Component } from '@angular/core';
import { ComprasTable } from './components/compras-table/compras-table';

@Component({
  imports: [ComprasTable],
  selector: 'app-compras',
  styleUrl: './compras.css',
  templateUrl: './compras.html',
})
export class Compras {}

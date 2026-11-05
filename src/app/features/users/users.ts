import { Component } from '@angular/core';
import { UsuariosTable } from './components/usuarios-table/usuarios-table';

@Component({
  imports: [UsuariosTable],
  selector: 'app-users',
  styleUrl: './users.css',
  templateUrl: './users.html',
})
export class Users {}

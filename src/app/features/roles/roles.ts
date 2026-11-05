import { Component } from '@angular/core';
import { RolesTable } from './components/roles-table/roles-table';

@Component({
  imports: [RolesTable],
  selector: 'app-roles',
  templateUrl: './roles.html',
})
export class Roles {}

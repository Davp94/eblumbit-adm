import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-user-summary',
  styleUrl: './user-summary.css',
  templateUrl: './user-summary.html',
})
export class UserSummary {
  nombreUsuario: string = 'Usuario1';
  correo:string = 'usuario1@test.com';
  imageUrl = 'https://picsum.photo/300';
  altImg = 'usuarioAlt';

  calcular() {
    console.log('CALCULAR');
  }
}

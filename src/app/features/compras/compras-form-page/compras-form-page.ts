import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ComprasForm } from '../components/compras-form/compras-form';

@Component({
  imports: [ComprasForm],
  selector: 'app-compras-form-page',
  styleUrl: './compras-form-page.css',
  templateUrl: './compras-form-page.html',
})
export class ComprasFormPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  almacenId = Number(this.route.snapshot.paramMap.get('almacenId'));

}

import { Component, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ComprasForm } from '../components/compras-form/compras-form';
import { ComprasRequest } from '../../../core/models/compras/ComprasRequest';
import { ComprasService } from '../../../core/services/compras-service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ComprasReportDialog } from '../compras-report-dialog/compras-report-dialog';

@Component({
  imports: [ComprasForm, MatDialogModule, MatButtonModule, MatIconModule],
  selector: 'app-compras-form-page',
  styleUrl: './compras-form-page.css',
  templateUrl: './compras-form-page.html',
})
export class ComprasFormPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private comprasService = inject(ComprasService);
  private dialog = inject(MatDialog);

  almacenId = Number(this.route.snapshot.paramMap.get('almacenId'));
  isSubmitting = signal(false);

  onSubmitted(compra: ComprasRequest): void {
    if(this.isSubmitting()){
      return;
    }
    //call service createCompra
    this.comprasService.createCompra(compra).subscribe({
      next: (createdCompra) => {
        if(createdCompra.id){
          this.snackBar.open('La compra se creo exitosamente', 'Cerrar', {duration: 3000})
          return;
        }
        this.comprasService.getReportCompra(createdCompra.id).subscribe({
          next:(report)=> {
            this.dialog.open(ComprasReportDialog, {
              width: '900px',
              maxWidth: '95vw',
              data: { compraId: createdCompra.id, report}
            })
          },
          error: () => {
            this.snackBar.open('La compra se creo, error al cargar el reporte', 'Cerrar', {duration: 3000})
          }
        })
      }
    })
  }
}

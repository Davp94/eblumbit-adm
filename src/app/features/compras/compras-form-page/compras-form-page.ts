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
import { catchError, EMPTY, finalize, switchMap, tap } from 'rxjs';

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
    this.isSubmitting.set(true);
    //call service createCompra
    this.comprasService.createCompra(compra).pipe(
      catchError(()=> {
        this.snackBar.open('Error al registrar la compra', 'Cerrar', {duration: 3000})
        return EMPTY;
    }),
    switchMap((createdCompra) => {
        if(createdCompra.id == null || createdCompra.id <=0) {
          this.snackBar.open('Error al recibir el id de compra', 'Cerrar', {duration: 3000})
          return EMPTY;
        }
        return this.comprasService.getReportCompra(createdCompra.id).pipe(
          tap((report) => {
            this.snackBar.open('La compra se creó exitosamente', 'Cerrar', {duration: 3000})
            this.dialog.open(ComprasReportDialog, {
              width: '900px',
              maxWidth: '95vw',
              data: { compraId: createdCompra.id, report}
            })
          }),
          catchError(() => {
            this.snackBar.open('La compra se creo, error al cargar el reporte', 'Cerrar', {duration: 3000})
            return EMPTY;
          })
        )
    }),
    finalize(() => this.isSubmitting.set(false))
    ).subscribe()
  }
}

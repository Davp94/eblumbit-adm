import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { CompraResponse } from '../../../../core/models/compras/CompraResponse';
import { ComprasService } from '../../../../core/services/compras-service';
import { ComprasReportDialog } from '../../compras-report-dialog/compras-report-dialog';
import { CompraDetailDialog } from '../../compra-detail-dialog/compra-detail-dialog';

@Component({
  imports: [
    DatePipe,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
  ],
  selector: 'app-compras-table',
  styleUrl: './compras-table.css',
  templateUrl: './compras-table.html',
})
export class ComprasTable implements OnInit {
  private comprasService = inject(ComprasService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  compras = signal<CompraResponse[]>([]);
  isLoading = signal(true);
  displayedColumns = ['codigo', 'fecha', 'proveedorRazonSocial', 'username', 'estado', 'acciones'];

  ngOnInit(): void {
    this.loadCompras();
  }

  loadCompras(): void {
    this.isLoading.set(true);
    this.comprasService.getAllCompras().subscribe({
      next: (compras) => {
        this.compras.set(compras);
        this.isLoading.set(false);
      },
      error: () => {
        this.showNotification('Error al cargar las compras');
        this.isLoading.set(false);
      },
    });
  }

  viewDetail(compra: CompraResponse): void {
    this.comprasService.getCompraById(compra.id).subscribe({
      next: (compraCompleta) => {
        if (!compraCompleta.detalleCompra?.length) {
          this.showNotification('No hay detalles disponibles para esta compra');
          return;
        }

        this.dialog.open(CompraDetailDialog, {
          width: '900px',
          maxWidth: '95vw',
          data: compraCompleta,
        });
      },
      error: () => this.showNotification('Error al cargar el detalle de la compra'),
    });
  }

  anular(compra: CompraResponse): void {
    if (!window.confirm(`¿Está seguro que desea anular la compra ${compra.codigo}?`)) {
      return;
    }

    this.comprasService.anularCompra(compra.id).subscribe({
      next: () => {
        this.showNotification('Compra anulada exitosamente');
        this.loadCompras();
      },
      error: () => this.showNotification('Error al anular la compra'),
    });
  }

  getReport(compra: CompraResponse): void {
    this.comprasService.getReportCompra(compra.id).subscribe({
      next: (report) => {
        this.dialog.open(ComprasReportDialog, {
          width: '900px',
          maxWidth: '95vw',
          data: { compraId: compra.id, report },
        });
      },
      error: () => this.showNotification('Error al generar el reporte de la compra'),
    });
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}

import { Component, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  imports: [MatButtonModule, MatDialogModule],
  selector: 'app-compras-report-dialog',
  templateUrl: './compras-report-dialog.html',
})
export class ComprasReportDialog implements OnDestroy {
  private sanitizer = inject(DomSanitizer);
  private dialogRef = inject(MatDialogRef<ComprasReportDialog>);
  data = inject(MAT_DIALOG_DATA);

  reportObjectUrl = URL.createObjectURL(this.data.report);
  reportUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.reportObjectUrl);
  fileName = `compra_${this.data.compraId}_report.pdf`;
  
  ngOnDestroy(): void {
    URL.revokeObjectURL(this.reportObjectUrl);
  }

  close(): void {
    this.dialogRef.close();
  }

}

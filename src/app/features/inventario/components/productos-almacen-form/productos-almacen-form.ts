import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { InventarioService } from '../../../../core/services/inventario-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, of, Subject, switchMap } from 'rxjs';
import { ProductoResponse } from '../../../../core/models/inventario/ProductoResponse';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  selector: 'app-productos-almacen-form',
  styleUrl: './productos-almacen-form.css',
  templateUrl: './productos-almacen-form.html',
})
export class ProductosAlmacenForm implements OnInit {
  
  private inventarioService = inject(InventarioService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);
  private dialogRef = inject(MatDialogRef<ProductosAlmacenForm, number>);
  private search = new Subject<string>();
  data = inject(MAT_DIALOG_DATA);

  productos = signal<ProductoResponse[]>([]);
  isLoading = signal(false);
  searchControl = new FormControl('', {nonNullable: true});

  productoForm = new FormGroup({
    productoId: new FormControl<number | null>(null, [Validators.required])
  })


  ngOnInit(): void {
    this.search.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((filterValue) => {
        this.isLoading.set(true);
        return this.inventarioService.getProductos({
          pageSize: 30,
          pageNumber: 1,
          filterValue: filterValue.trim() || undefined
        }).pipe(
          map((response) => response.items),
          catchError(() => {
            this.snackBar.open('Error al cargar los productos', 'Cerrar', {duration: 3000})
            return of([]);
          }),
          finalize(() => this.isLoading.set(false))
        )
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((productos) => this.productos.set(productos));

    this.searchControl.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((filterValue) => {
      this.productoForm.controls.productoId.reset();
      this.search.next(filterValue);
    })

    this.search.next("");
  }

  onSubmit(): void {
    const productoId = this.productoForm.controls.productoId.value;
    if(this.productoForm.invalid || productoId ===null) {
      this.productoForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(productoId);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { InventarioService } from '../../../../core/services/inventario-service';
import { catchError, startWith, Subject, switchMap, tap } from 'rxjs';
import { ProductoResponse } from '../../../../core/models/inventario/ProductoResponse';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductoPageRequest } from '../../../../core/models/inventario/ProductoPageRequest';

@Component({
  imports: [
    DecimalPipe, 
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    ReactiveFormsModule
  ],
  selector: 'app-inventario-table',
  styleUrl: './inventario-table.css',
  templateUrl: './inventario-table.html',
})
export class InventarioTable implements OnInit{

  private inventarioService = inject(InventarioService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);
  private reload = new Subject<void>();

  productos = signal<ProductoResponse[]>([]);
  totalElements = signal<number>(0);
  pageSize = signal<number>(10)
  pageIndex = signal<number>(0);
  isLoading = signal(true);

  displayedColumns = [
    'nombre',
    'codigoBarra',
    'unidadMedida',
    'marca',
    'categoriaNombre',
    'precioVentaActual',
    'stockMinimo',
    'estado'
  ]

  filters = new FormGroup({
    filterValue: new FormControl(''),
    nombre: new FormControl(''),
    descripcion: new FormControl(''),
    codigoBarra: new FormControl(''),
    marca: new FormControl(''),
    nombreCategoria: new FormControl(''),
    almacenId: new FormControl(''),
  })

  private sortField: string | undefined;
  private sortOrder: string | undefined;

  ngOnInit(): void {
    this.reload.pipe(
      startWith<void>(undefined),
      tap(()=>this.isLoading.set(true)),
      switchMap(() => {
        return this.inventarioService.getProductos(this.createRequest()).pipe(
          catchError((err: any) => {
            this.isLoading.set(false);
            this.snackBar.open('Error al cargar los productos', 'Cerrar', {duration: 3000})
          })
        )
      }),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((response) => {
      this.productos.set(response.items);
      this.totalElements.set(response.totalElements);
      this.isLoading.set(false);
    })
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.reload.next();
  }

  onSortChange(sort: Sort): void {
    this.sortField = sort.direction ? sort.active : undefined;
    this.sortOrder = sort.direction || undefined;
    this.pageIndex.set(0);
    this.reload.next();
  }

  clearFilters(): void {
    this.filters.reset({
      filterValue: '',
      nombre: '',
      descripcion: '',
      codigoBarra: '',
      marca: '',
      nombreCategoria: '',
      almacenId: ''
    });
  }

  private createRequest(): ProductoPageRequest {
    const values = this.filters.getRawValue();
    return {
      pageSize: this.pageSize(),
      pageNumber: this.pageIndex() + 1,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      filterValue: values.filterValue?.trim() || undefined,
      nombre: values.nombre?.trim() || undefined,
      descripcion: values.descripcion?.trim() || undefined,
      codigoBarra: values.codigoBarra?.trim() || undefined,
      marca: values.marca?.trim() || undefined,
      nombreCategoria: values.nombreCategoria?.trim() || undefined,
      almacenId: Number(values.almacenId) || undefined,
    }
  }
}

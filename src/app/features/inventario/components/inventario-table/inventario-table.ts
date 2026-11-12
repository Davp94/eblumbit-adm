import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
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
import { catchError, debounceTime, distinctUntilChanged, startWith, Subject, switchMap, tap } from 'rxjs';
import { ProductoResponse } from '../../../../core/models/inventario/ProductoResponse';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductoPageRequest } from '../../../../core/models/inventario/ProductoPageRequest';
import { MatIconModule } from '@angular/material/icon';

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
    ReactiveFormsModule,
    MatIconModule
],
  selector: 'app-inventario-table',
  styleUrl: './inventario-table.css',
  templateUrl: './inventario-table.html',
})
export class InventarioTable implements OnInit, OnChanges{

  private inventarioService = inject(InventarioService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);
  private reload = new Subject<void>();

  productos = signal<ProductoResponse[]>([]);
  totalElements = signal<number>(0);
  pageSize = signal<number>(10)
  pageIndex = signal<number>(0);
  isLoading = signal(true);
  @Input() almacenId: number | null = null;

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
  })

  private sortField: string | undefined;
  private sortOrder: string | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['almacenId'] && !changes['almacenId'].firstChange) {
      this.refreshProducts();
    }
  }

  ngOnInit(): void {
    this.filters.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((previous, current) => JSON.stringify(previous) === JSON.stringify(current)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(()=> {
        this.pageIndex.set(0);
        this.reload.next();
      });


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

  refreshProducts() : void {
    this.pageIndex.set(0);
    this.reload.next();
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
      nombreCategoria: ''
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
      almacenId: this.almacenId || undefined,
    }
  }
}

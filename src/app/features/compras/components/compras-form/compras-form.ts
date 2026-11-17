import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { FormArray, FormControl, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductoResponse } from '../../../../core/models/inventario/ProductoResponse';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, of, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { InventarioService } from '../../../../core/services/inventario-service';
import { ProveedoresService } from '../../../../core/services/proveedores-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionStorage } from '../../../../core/services/session-storage';
import { ProveedorResponse } from '../../../../core/models/proveedores/ProveedorResponse';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ComprasRequest } from '../../../../core/models/compras/ComprasRequest';
import { DetalleCompraRequest } from '../../../../core/models/compras/DetalleCompraRequest';

type DetalleCompraForm = FormGroup<{
  cantidad: FormControl<number | null>;
  precioUnitarioCompra: FormControl<number | null>;
  observaciones: FormControl<string>;
  productoId: FormControl<number | null>;
  almacenId: FormControl<number>;
}>;

interface DetalleCompraRow {
  form: DetalleCompraForm;
  searchControl: FormControl<string>;
  productos: WritableSignal<ProductoResponse[]>;
  isLoading: WritableSignal<boolean>;
  destroy$: Subject<void>;
}

@Component({
  imports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  selector: 'app-compras-form',
  styleUrl: './compras-form.css',
  templateUrl: './compras-form.html',
})
export class ComprasForm implements OnInit{
  private inventarioService = inject(InventarioService);
  private proveedoresService = inject(ProveedoresService);
  private sessionStorage = inject(SessionStorage);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);

  @Input({required: true}) almacenId!: number;
  @Input() isSubmitting = false;
  @Output() submitted = new EventEmitter<ComprasRequest>();

  proveedores = signal<ProveedorResponse[]>([]);
  isSearchingProveedores = signal(false);
  proveedoresSearch = new FormControl('',{nonNullable: true})
  detalleRows = signal<DetalleCompraRow[]>([]);
  detalleCompra = new FormArray<DetalleCompraForm>([]);
  usuarioId = this.sessionStorage.read()?.identifier ?? null;

  comprasForm = new FormGroup({
    detalle: new FormControl('', {nonNullable: true}),
    observaciones: new FormControl('', {nonNullable: true}),
    descuentoTotal: new FormControl<number | null>(null),
    usuarioId: new FormControl<number | null>(this.usuarioId, [Validators.required]),
    proveedorId: new FormControl<number | null>(this.usuarioId, [Validators.required]),
    detalleCompra: this.detalleCompra
  })

  ngOnInit(): void {
    this.addDetalle();
    this.proveedoresSearch.valueChanges
    .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((search) => {
          this.isSearchingProveedores.set(true)
          return this.proveedoresService.getProveedores().pipe(
            map((response) => response.filter(res=>res.razonSocial.includes(search)
            || res.correo.includes(search))),
            catchError(() => {
              this.snackBar.open('Error al buscar proveedores', 'Cerrar', {duration: 3000})
              return of([])
            }),
            finalize(()=>this.isSearchingProveedores.set(false))
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((proveedores) => this.proveedores.set(proveedores));
  }

  addDetalle(): void {
    const form = this.createDetalleForm();
    this.detalleCompra.push(form);
    this.detalleRows.update((rows)=>[...rows, this.createDetalleRow(form)])
  }

  removeDetalle(index: number): void {
    if(this.detalleCompra.length<=1){
      return;
    }
    const row = this.detalleRows()[index];
    row.destroy$.next();
    row.destroy$.complete();
    this.detalleCompra.removeAt(index);
    this.detalleRows.update((rows) => rows.filter((_,rowIndex)=> index !== rowIndex))
  }

  selectProveedor(event: MatAutocompleteSelectedEvent): void {
    const proveedorId = Number(event.option.value);
    const proveedor = this.proveedores().find((item) => item.id === proveedorId);
    if(!proveedor){
      return;
    }
    this.comprasForm.controls.proveedorId.setValue(proveedor.id);
    this.proveedoresSearch.setValue(proveedor.razonSocial, {emitEvent: false})
  }

  selectProducto(rowIndex: number, event: MatAutocompleteSelectedEvent): void {
    const row = this.detalleRows()[rowIndex];
    const productoId = Number(event.option.value);
    const producto = row.productos().find((item)=>item.id === productoId);
    if(!producto){
      return;
    }
    row.form.controls.productoId.setValue(producto.id);
    row.searchControl.setValue(producto.nombre, {emitEvent: false});
  }

  submit(): void {
    if(this.isSubmitting){
      return;
    }
    this.comprasForm.markAllAsTouched();
    const compra = this.comprasForm.getRawValue();
    const detalles: DetalleCompraRequest[] = [];
    if (this.comprasForm.invalid){
      return;
    } 
    if(compra.proveedorId === null || compra.usuarioId === null){
      return;
    }
   
    for (const detalle of compra.detalleCompra) {
      if(
        detalle.cantidad === null || detalle.precioUnitarioCompra === null || detalle.productoId === null
      )
      return;
      detalles.push({
        cantidad: detalle.cantidad,
        precioUnitarioCompra: detalle.precioUnitarioCompra,
        observaciones: detalle.observaciones,
        productoId: detalle.productoId,
        almacenId: detalle.almacenId
      })
    }
    this.submitted.emit({
      usuarioId: compra.usuarioId,
      proveedorId: compra.proveedorId,
      descuentoTotal: compra.descuentoTotal ?? undefined,
      detalle: compra.detalle,
      observaciones: compra.observaciones,
      detalleCompra: detalles
    });
  }

  private createDetalleForm(): DetalleCompraForm {
    return new FormGroup({
      cantidad: new FormControl<number | null>(null,[Validators.required, Validators.min(1)]),
      precioUnitarioCompra: new FormControl<number | null>(null, [Validators.required]),
      observaciones: new FormControl('', {nonNullable: true}),
      productoId: new FormControl<number | null>(null, [Validators.required]),
      almacenId: new FormControl(this.almacenId, {nonNullable: true})
    });
  }

  private createDetalleRow(form: DetalleCompraForm): DetalleCompraRow {
    const row: DetalleCompraRow = {
      form,
      searchControl: new FormControl('', {nonNullable: true}),
      productos: signal<ProductoResponse[]>([]),
      isLoading: signal(false),
      destroy$: new Subject<void>()
    }
    row.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((search) => {
          row.isLoading.set(true)
          return this.inventarioService.getProductos({
            pageSize: 20,
            pageNumber: 1,
            filterValue: typeof search === 'string' ? search.trim() || undefined : undefined,
            almacenId: this.almacenId
          }).pipe(
            map((response) => response.items),
            catchError(() => {
              this.snackBar.open('Error al buscar productos en almacén', 'Cerrar', {duration: 3000})
              return of([])
            }),
            finalize(()=>row.isLoading.set(false))
          );
        }),
        takeUntil(row.destroy$),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((productos) => row.productos.set(productos));
      return row;
    }

}

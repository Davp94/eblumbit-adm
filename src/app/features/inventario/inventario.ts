import { Component, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InventarioTable } from './components/inventario-table/inventario-table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductosForm } from './components/productos-form/productos-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InventarioService } from '../../core/services/inventario-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoRequest } from '../../core/models/inventario/ProductoRequest';
import { MatSelectModule } from '@angular/material/select';
import { AlmacenService } from '../../core/services/almacen-service';
import { SucursalService } from '../../core/services/sucursal-service';
import { catchError, finalize, of, Subject, switchMap } from 'rxjs';
import { SucursalResponse } from '../../core/models/sucursal/SucursalResponse';
import { AlmacenResponse } from '../../core/models/almacen/AlmacenResponse';
import { ProductosAlmacenForm } from './components/productos-almacen-form/productos-almacen-form';

@Component({
  imports: [MatAnchor, MatIconModule, InventarioTable, MatButtonModule, MatDialogModule,
    MatSelectModule
  ],
  selector: 'app-inventario',
  styleUrl: './inventario.css',
  templateUrl: './inventario.html',
})
export class Inventario implements OnInit{
  private dialog = inject(MatDialog);
  private inventarioService = inject(InventarioService);
  private almacenService = inject(AlmacenService);
  private sucursalService = inject(SucursalService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);
  private sucursalSelection = new Subject<number | null>();

  @ViewChild(InventarioTable) private inventarioTable?: InventarioTable;

  sucursales = signal<SucursalResponse[]>([]);
  almacenes = signal<AlmacenResponse[]>([]);
  selectedSucursalId = signal<number | null>(null);
  selectedAlmacenId = signal<number | null>(null);
  isSucursalesLoading = signal(true);
  isAlmacenesLoading = signal(true);

  ngOnInit(): void {
    this.sucursalService.getSucursales().pipe(
      finalize(()=>this.isSucursalesLoading.set(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (sucursales) => this.sucursales.set(sucursales),
      error: () => this.snackBar.open('Error al cargar sucursales', 'Cerrar', {duration: 3000})
    })

    this.sucursalSelection.pipe(
      switchMap((sucursalId) => {
        if(sucursalId === null) {
          this.isAlmacenesLoading.set(false);
          return of([]);
        }
        this.isAlmacenesLoading.set(true);
        return this.almacenService.getAlmacenBySucursalId(sucursalId).pipe(
          catchError(() => {
            this.snackBar.open('Error al cargar almacenes', 'Cerrar', {duration: 3000})
            return of([]);
          }),
          finalize(()=>this.isAlmacenesLoading.set(false))
        )
      }),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((almacenes)=>this.almacenes.set(almacenes))
  
  }

  openCreateProductoModal(): void {
    this.dialog.open(ProductosForm, {width: '700px', maxWidth: '90vw'})
    .afterClosed()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (request: ProductoRequest) => {
        this.inventarioService.createProducto(request)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.snackBar.open('producto creado exitosamente', 'Cerrar', {duration: 3000})
          },
          error: () => {
            this.snackBar.open('Error al crear el producto', 'Cerrar', {duration: 3000})
          }
        })
      },

    })
  }
  
  onSucursalChange(sucursalId: number | null): void {
    this.selectedSucursalId.set(sucursalId);
    this.selectedAlmacenId.set(null);
    this.almacenes.set([]);
    this.sucursalSelection.next(sucursalId);
  }

  onAlmacenChange(almacenId: number | null): void {
    this.selectedAlmacenId.set(almacenId);
  }

  openCreateProductoAlmacenModal(): void {
    const almacenID = this.selectedAlmacenId();
    const almacen = this.almacenes().find((item) => item.id === almacenID);
    if(!almacen){
      return;
    }
    this.dialog.open(ProductosAlmacenForm, {width: '500px', maxWidth: '90vw', data: { almacen }})
    .afterClosed()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (productoId: number | undefined) => {
        if(productoId === undefined) return;

        this.inventarioService.asociarProductoAlmacen(productoId, almacen.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.snackBar.open('Producto asociado al almacen exitosamente', 'Cerrar', {duration: 3000})
            this.inventarioTable?.refreshProducts();
          },
          error: () => {
            this.snackBar.open('Error al asociar el producto al almacen', 'Cerrar', {duration: 3000})
          }
        })
      },

    })
  }
}

import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProductoRequest } from '../../../../core/models/inventario/ProductoRequest';
import { CategoriaService } from '../../../../core/services/categoria-service';
import { CategoriaResponse } from '../../../../core/models/categoria/CategoriaResponse';
import { MatSelectModule } from '@angular/material/select';

type ProductoFormControls = {
  nombre: FormControl<string>;
  codigoBarra: FormControl<string>;
  unidadMedida: FormControl<string>;
  marca: FormControl<string>;
  descripcion: FormControl<string>;
  precioVentaActual: FormControl<number | null>;
  stockMinimo: FormControl<number | null>;
  estado: FormControl<boolean>;
  categoriaId: FormControl<number | null>;
}

@Component({
  imports: [MatButtonModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatIconModule, ReactiveFormsModule, MatSelectModule],
  selector: 'app-productos-form',
  styleUrl: './productos-form.css',
  templateUrl: './productos-form.html',
})
export class ProductosForm implements OnInit {
    private categoriaService = inject(CategoriaService);
    private dialogRef = inject(MatDialogRef<ProductosForm, ProductoRequest>)
    selectedImage: File | null = null;
    categorias = signal<CategoriaResponse[] | null>(null);

    productoForm = new FormGroup<ProductoFormControls>({
      nombre: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
      codigoBarra: new FormControl('', {nonNullable: true}),
      unidadMedida: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
      marca: new FormControl('', {nonNullable: true}),
      descripcion: new FormControl('', {nonNullable: true}),
      precioVentaActual: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
      stockMinimo: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
      estado: new FormControl(true, {nonNullable: true}),
      categoriaId: new FormControl<number | null>(null, [Validators.required])
    });

    ngOnInit(): void {
      this.categoriaService.getCategorias().subscribe(
        res => this.categorias.set(res)
      )
    }

    onImageSelected(event: Event): void {
      const input = event.currentTarget as HTMLInputElement;
      this.selectedImage = input.files?.[0] || null;
    }

    onSubmit(): void {
      if(this.productoForm.invalid){
        this.productoForm.markAllAsTouched();
        return;
      }
      const values = this.productoForm.getRawValue();
      this.dialogRef.close({
        ...values,
        ...(this.selectedImage ? {imagen: this.selectedImage}: {})
      })
    }

    onCancel(): void {
      this.dialogRef.close();
    }
}

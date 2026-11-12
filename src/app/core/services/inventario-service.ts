import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ProductoPageRequest } from '../models/inventario/ProductoPageRequest';
import { Observable } from 'rxjs';
import { PageableResponse } from '../../shared/models/PageableResponse';
import { ProductoResponse } from '../models/inventario/ProductoResponse';
import { ProductoRequest } from '../models/inventario/ProductoRequest';
import { form } from '@angular/forms/signals';

@Service()
export class InventarioService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/productos`;

    getProductos(request: ProductoPageRequest): Observable<PageableResponse<ProductoResponse>> {
        let params = new HttpParams()
            .set('pageSize', request.pageSize.toString())
            .set('pageNumber', request.pageNumber.toString());

        for(const [key, value] of Object.entries(request)) {
            if(key !== 'pageSize' && key !== 'pageNumber' && value !== undefined && value !== '') {
               params = params.set(key, value as string); 
            }
        }

        return this.http.get<PageableResponse<ProductoResponse>>(`${this.apiUrl}/paginacion`, {params});
    }

    createProducto(request: ProductoRequest): Observable<ProductoResponse> {
        const formData = new FormData();
        formData.append('nombre', request.nombre);
        formData.append('codigoBarra', request.codigoBarra);
        formData.append('unidadMedida', request.unidadMedida);
        formData.append('marca', request.marca);
        formData.append('descripcion', request.descripcion);
        formData.append('precioVentaActual', String(request.precioVentaActual));
        formData.append('stockMinimo', String(request.stockMinimo));
        formData.append('estado', String(request.estado));
        formData.append('categoriaId', String(request.categoriaId));
        formData.append('imagen', request.imagen);

        return this.http.post<ProductoResponse>(this.apiUrl, formData);
    }

    asociarProductoAlmacen(productoId: number, almacenId: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${productoId}/almacen/${almacenId}`, null);
    }

}

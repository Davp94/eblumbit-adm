import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ProductoPageRequest } from '../models/inventario/ProductoPageRequest';
import { Observable } from 'rxjs';
import { PageableResponse } from '../../shared/models/PageableResponse';
import { ProductoResponse } from '../models/inventario/ProductoResponse';

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

}

import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { SucursalRequest } from '../models/sucursal/SucursalRequest';
import { SucursalResponse } from '../models/sucursal/SucursalResponse';
import { environment } from '../../../environments/environment.development';

@Service()
export class SucursalService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl + '/sucursales';

    getSucursales(): Observable<SucursalResponse[]> {
        return this.http.get<SucursalResponse[]>(this.apiUrl);
    }

    getSucursalById(id: number): Observable<SucursalResponse> {
        return this.http.get<SucursalResponse>(`${this.apiUrl}/${id}`);
    }

    createSucursal(sucursal: SucursalRequest): Observable<SucursalResponse> {
        return this.http.post<SucursalResponse>(this.apiUrl, sucursal);
    }

    updateSucursal(id: number, sucursal: SucursalRequest): Observable<SucursalResponse> {
        return this.http.put<SucursalResponse>(`${this.apiUrl}/${id}`, sucursal);
    }

    deleteSucursal(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}

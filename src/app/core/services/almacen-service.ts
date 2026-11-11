import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { AlmacenRequest } from '../models/almacen/AlmacenRequest';
import { AlmacenResponse } from '../models/almacen/AlmacenResponse';
import { environment } from '../../../environments/environment.development';

@Service()
export class AlmacenService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl + '/almacenes';

    getAlmacenes(): Observable<AlmacenResponse[]> {
        return this.http.get<AlmacenResponse[]>(this.apiUrl);
    }

    getAlmacenById(id: number): Observable<AlmacenResponse> {
        return this.http.get<AlmacenResponse>(`${this.apiUrl}/${id}`);
    }

    getAlmacenBySucursalId(sucursalId: number): Observable<AlmacenResponse[]> {
        return this.http.get<AlmacenResponse[]>(`${this.apiUrl}/${sucursalId}/sucursal`);
    }

    createAlmacen(almacen: AlmacenRequest): Observable<AlmacenResponse> {
        return this.http.post<AlmacenResponse>(this.apiUrl, almacen);
    }

    updateAlmacen(id: number, almacen: AlmacenRequest): Observable<AlmacenResponse> {
        return this.http.put<AlmacenResponse>(`${this.apiUrl}/${id}`, almacen);
    }

    deleteAlmacen(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}

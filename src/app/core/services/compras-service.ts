import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ComprasRequest } from '../models/compras/ComprasRequest';
import { Observable } from 'rxjs';
import { TitleStrategy } from '@angular/router';
import { CompraResponse } from '../models/compras/CompraResponse';

@Service()
export class ComprasService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/compras`;

    createCompra(compra: ComprasRequest): Observable<CompraResponse> {
        return this.http.post<CompraResponse>(this.apiUrl, compra);
    }

    getReportCompra(compraId: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${compraId}/report`, {responseType: 'blob'});
    }

    getAllCompras(): Observable<CompraResponse[]> {
        return this.http.get<CompraResponse[]>(this.apiUrl);
    }

    anularCompra(compraId: number) {
        return this.http.patch(`${this.apiUrl}/${compraId}`, null)
    }

    getCompraById(compraId: number): Observable<CompraResponse> {
        return this.http.get<CompraResponse>(`${this.apiUrl}/${compraId}`);
    }
}

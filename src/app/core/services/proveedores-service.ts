import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ProveedorRequest } from '../models/proveedores/ProveedorRequest';
import { ProveedorResponse } from '../models/proveedores/ProveedorResponse';
import { environment } from '../../../environments/environment.development';

@Service()
export class ProveedoresService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/proveedores';

  getProveedores(): Observable<ProveedorResponse[]> {
    return this.http.get<ProveedorResponse[]>(this.apiUrl);
  }

  getProveedorById(id: number): Observable<ProveedorResponse> {
    return this.http.get<ProveedorResponse>(`${this.apiUrl}/${id}`);
  }

  createProveedor(proveedor: ProveedorRequest): Observable<ProveedorResponse> {
    return this.http.post<ProveedorResponse>(this.apiUrl, proveedor);
  }

  updateProveedor(id: number, proveedor: ProveedorRequest): Observable<ProveedorResponse> {
    return this.http.put<ProveedorResponse>(`${this.apiUrl}/${id}`, proveedor);
  }

  deleteProveedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

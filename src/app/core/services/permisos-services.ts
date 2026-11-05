import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { PermisosRequest } from '../models/permisos/PermisosRequest';
import { PermisosResponse } from '../models/permisos/PermisosResponse';
import { environment } from '../../../environments/environment.development';

@Service()
export class PermisosServices {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/permisos';

  getPermisos(): Observable<PermisosResponse[]> {
    return this.http.get<PermisosResponse[]>(this.apiUrl);
  }

  getPermisoById(id: number): Observable<PermisosResponse> {
    return this.http.get<PermisosResponse>(`${this.apiUrl}/${id}`);
  }

  createPermiso(permiso: PermisosRequest): Observable<PermisosResponse> {
    return this.http.post<PermisosResponse>(this.apiUrl, permiso);
  }

  updatePermiso(id: number, permiso: PermisosRequest): Observable<PermisosResponse> {
    return this.http.put<PermisosResponse>(`${this.apiUrl}/${id}`, permiso);
  }

  deletePermiso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

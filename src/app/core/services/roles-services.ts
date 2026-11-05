import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { RolesRequest } from '../models/roles/RolesRequest';
import { RolesResponse } from '../models/roles/RolesResponse';
import { environment } from '../../../environments/environment.development';

@Service()
export class RolesServices {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl + '/roles';

    getRoles(): Observable<RolesResponse[]> {
        return this.http.get<RolesResponse[]>(this.apiUrl);
    }

    getRoleById(id: number): Observable<RolesResponse> {
        return this.http.get<RolesResponse>(`${this.apiUrl}/${id}`);
    }

    createRole(role: RolesRequest): Observable<RolesResponse> {
        return this.http.post<RolesResponse>(this.apiUrl, role);
    }

    updateRole(id: number, role: RolesRequest): Observable<RolesResponse> {
        return this.http.put<RolesResponse>(`${this.apiUrl}/${id}`, role);
    }

    deleteRole(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}

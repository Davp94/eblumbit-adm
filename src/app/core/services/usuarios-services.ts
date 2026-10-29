import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuariosResponse } from '../models/usuarios/UsuariosResponse';
import { UsuariosRequest } from '../models/usuarios/UsuariosRequest';

@Service()
export class UsuariosServices {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8090/usuarios'

    getUsers(): Observable<UsuariosResponse[]> {
        return this.http.get<UsuariosResponse[]>(this.apiUrl);
    }

    getUsuarioById(id: number): Observable<UsuariosResponse> {
        return this.http.get<UsuariosResponse>(`${this.apiUrl}/${id}`)
    }

    createUsuario(usuario: UsuariosRequest): Observable<UsuariosResponse> {
        return this.http.post<UsuariosResponse>(this.apiUrl, usuario);
    }

    updateUsuario(id: number, usuario: UsuariosRequest): Observable<UsuariosResponse> {
        return this.http.put<UsuariosResponse>(`${this.apiUrl}/${id}`, usuario);
    }

    deleteUsuario(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}

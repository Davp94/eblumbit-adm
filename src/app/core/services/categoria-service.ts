import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { CategoriaResponse } from '../models/categoria/CategoriaResponse';

@Service()
export class CategoriaService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/categorias';

  getCategorias(): Observable<CategoriaResponse[]> {
    return this.http.get<CategoriaResponse[]>(this.apiUrl);
  }
}

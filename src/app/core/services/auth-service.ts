import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { tap } from 'rxjs';

@Service()
export class AuthService {
    private http = inject(HttpClient);

    login(username: string, password: string) {
        return this.http.post('/auth/login', {username, password})
        .pipe(
            tap((res: any) => {
                localStorage.setItem('token', res.token)
                localStorage.setItem('refreshToken', res.refreshToken)
                localStorage.setItem('identifier', res.identifier);
            })
        );
    }
}

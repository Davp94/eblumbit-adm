import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoginResponse } from '../models/LoginResponse';
import { SessionStorage } from './session-storage';
import { Session } from '../models/Session';


@Service()
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private storage = inject(SessionStorage);

    private readonly _session = signal<Session | null>(this.storage.read());

    readonly isLoggedIn = computed(()=>!!this._session());
    readonly token = computed(()=>this._session()?.accessToken)
    login(username: string, password: string) {
        return this.http.post<LoginResponse>('/auth/login', {username, password})
        .pipe(
            tap((res: LoginResponse) => {
                this.storage.write(res);
                this._session.set(res);
            })
        );
    }

    logout() {
        this.storage.clear();
        this._session.set(null);
        this.router.navigate(['/login']);
    }
}

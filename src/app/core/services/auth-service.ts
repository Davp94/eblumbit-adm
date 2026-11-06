import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Observable, shareReplay, tap } from 'rxjs';
import { LoginResponse } from '../models/LoginResponse';
import { SessionStorage } from './session-storage';
import { Session } from '../models/Session';
import { environment } from '../../../environments/environment.development';


@Service()
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private storage = inject(SessionStorage);
    private apiUrl = environment.apiUrl + '/auth';

    private readonly _session = signal<Session | null>(this.storage.read());
    private refreshRequest: Observable<LoginResponse> | null = null;
    readonly isLoggedIn = computed(()=>!!this._session());
    readonly token = computed(()=>this._session()?.accessToken)


    login(username: string, password: string) {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {username, password})
        .pipe(
            tap((res: LoginResponse) => {
                this.storage.write(res);
                this._session.set(res);
            })
        );
    }

    refreshAccesToken(): Observable<LoginResponse> {
        if(this.refreshRequest) {
            return this.refreshRequest;
        }
        const refreshToken = this._session()?.refreshToken;
        if(!refreshToken) {
            throw new Error('No refresh token available');
        }
        const request = this.http.post<LoginResponse>(`${this.apiUrl}/refresh-token`, {refreshToken})
        .pipe(
            tap((res: LoginResponse) => {
                this.storage.write(res);
                this._session.set(res);
            }),
            finalize(() => {
                if(this.refreshRequest === request) {
                    this.refreshRequest = null;
                }
            }),
            shareReplay({bufferSize: 1, refCount: false})
        );
        return request;
    }

    logout() {
        this.storage.clear();
        this._session.set(null);
        this.router.navigate(['/login']);
    }
}

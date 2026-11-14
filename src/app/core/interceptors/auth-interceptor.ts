import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isAuthRequest = /\/auth\/(?:login|refresh-token)(?:\?|$)/.test(req.url);
  if (isAuthRequest) {
    return next(req);
  }

  const auth = inject(AuthService);
  const token = auth.token();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {
      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401 ||
        !token
      ) {
        return throwError(() => error);
      }

      const currentToken = auth.token();
      if (!currentToken) {
        return throwError(() => error);
      }
      if (currentToken !== token) {
        return next(
          req.clone({
            setHeaders: { Authorization: `Bearer ${currentToken}` },
          })
        );
      }

      return auth.refreshAccesToken().pipe(
        catchError((refreshError: unknown) => {
          auth.logout();
          return throwError(() => refreshError);
        }),
        switchMap((session) =>
          next(
            req.clone({
              setHeaders: { Authorization: `Bearer ${session.accessToken}` },
            })
          )
        )
      );
    })
  );
};

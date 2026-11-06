import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  

  const authReq = token ?
  req.clone({setHeaders: {Authorization: `Bearer ${token}`}})
  :req;

  return next(authReq).pipe(
    catchError((error: any) => {
      console.log("🚀 ~ authInterceptor ~ error:", error)
      if(
        !(error instanceof HttpErrorResponse)||
        error.status !== 401 ||
        !token
      ) {
        console.log("🚀 ~ authInterceptor ~ error-passing direct:", error)
        return throwError(()=>error);
      }
      return auth.refreshAccesToken().pipe(
        catchError((refreshError) => {
          auth.logout();
          return throwError(()=>refreshError);
        }),
        switchMap((session: any) => {
          next(req.clone({setHeaders: {Authorization: `Bearer ${session.accessToken}`}}));
          return throwError(()=>error);
        })
      )
    })
  );
};

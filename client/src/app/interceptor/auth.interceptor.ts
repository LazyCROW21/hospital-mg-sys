import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  static accessToken = '';
  static refreshToken = '';
  refreshed = false;
  constructor(private authService: AuthService, private http: HttpClient) {
    this.authService.accessToken.subscribe((accessToken) => {
      AuthInterceptor.accessToken = accessToken;
    });
    this.authService.refreshToken.subscribe((refreshToken) => {
      AuthInterceptor.refreshToken = refreshToken;
    });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(request.url.includes('login')) {
      return next.handle(request);
    }
    const req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${AuthInterceptor.accessToken}`
      }
    });
    console.log(AuthInterceptor.accessToken);
    return next.handle(req).pipe(
      catchError(
        (err: HttpErrorResponse) => {
          if (err.status === 401 && !this.refreshed) {
            this.refreshed = true;
            return this.http.post(environment.apiURL + '/auth/refresh', { refreshToken: AuthInterceptor.refreshToken })
              .pipe(switchMap((res: any) => {
                this.authService.accessToken.next(res.accessToken);
                AuthInterceptor.accessToken = res.accessToken;
                const reReq = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${AuthInterceptor.accessToken}`
                  }
                });
                return next.handle(reReq);
              }));
          }
          this.refreshed = false;
          return throwError(() => err);
        }
      )
    );
  }
}

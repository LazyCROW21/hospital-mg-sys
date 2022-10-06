import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  static accessToken = '';
  static refreshToken = '';

  refreshing = false;
  refreshTokenSubject = new BehaviorSubject<string>('');

  constructor(private authService: AuthService, private router: Router) {
    this.authService.accessToken.subscribe((accessToken) => {
      AuthInterceptor.accessToken = accessToken;
    });
    this.authService.refreshToken.subscribe((refreshToken) => {
      AuthInterceptor.refreshToken = refreshToken;
    });
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.includes('login') || request.url.includes('refresh')) {
      this.refreshing = false;
      return next.handle(request);
    }
    const req = request.clone({
      setHeaders: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${AuthInterceptor.accessToken}`,
      },
    });
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          console.log('401 Error');
          return this.handle401Error(request, next);
        }
        return throwError(() => err);
      })
    );
  }

  handle401Error(request: HttpRequest<unknown>, next: HttpHandler) {
    if (!this.refreshing) {
      this.refreshing = true;
      this.refreshTokenSubject.next('');
      return this.authService.refreshAccessToken().pipe(
        switchMap((result: any) => {
          this.refreshing = false;
          this.authService.accessToken.next(result.accessToken);
          AuthInterceptor.accessToken = result.accessToken;
          this.refreshTokenSubject.next(result.accessToken);
          const req = request.clone({
            setHeaders: {
              // 'Content-Type': 'application/json',
              Authorization: `Bearer ${AuthInterceptor.accessToken}`,
            },
          });
          return next.handle(req);
        }),
        catchError((err) => {
          console.log('Log OUT');
          this.authService.logout();
          this.router.navigateByUrl('/login');
          return throwError(() => err);
        })
      );
    }
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== ''),
      take(1),
      switchMap((token) => {
        const req = request.clone({
          setHeaders: {
            // 'Content-Type': 'application/json',
            Authorization: `Bearer ${AuthInterceptor.accessToken}`,
          },
        });
        return next.handle(req);
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(public authService: AuthService, public router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(state.url === '/login') {
      if(this.authService.isLoggedIn.value) {
        this.router.navigateByUrl('/dashboard');
      }
      return true;
    }
    if(this.authService.isLoggedIn.value) {
      return true;
    }
    this.router.navigateByUrl('/login');
    return false;
  }
  
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if(this.authService.isLoggedIn.value) {
      return true;
    }
    this.router.navigateByUrl('/login');
    return false;
  }
}

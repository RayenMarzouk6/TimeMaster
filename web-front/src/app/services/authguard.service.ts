import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service'; 

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = next.data['role']; 
    const currentUser = this.authService.getCurrentUser();

    if (this.authService.isAuthenticated()) {
      if (!expectedRole || currentUser.role === expectedRole) {
        return true;
      } else {
        this.router.navigate(['/login']); 
        return false;
      }
    }

    this.router.navigate(['/login']); 
    return false;
  }
}              



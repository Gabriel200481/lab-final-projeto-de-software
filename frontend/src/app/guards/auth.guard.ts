import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};

export const roleGuard = (roles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    const papel = authService.getPapel();
    if (papel && roles.includes(papel)) {
      return true;
    }

    router.navigate(['/login']);
    return false;
  };
};

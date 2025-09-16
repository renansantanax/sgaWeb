import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

export const redirectIfAuthenticatedGuard: CanMatchFn = (route, segments) => {
  const router = inject(Router);
  const isLoggedIn = !!sessionStorage.getItem('user'); // ou verifique seu JWT

  // se já estiver logado, manda pro dashboard (ou home)
  return isLoggedIn ? router.createUrlTree(['/dashboard']) : true;
};

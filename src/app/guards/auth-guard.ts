import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // consultar os dados do usuário gravado na session storage
  const user = sessionStorage.getItem('user');

  // se não existir usuário autenticado
  if (!user) {
    // redireciona para login
    return router.createUrlTree(['/login']);
  }

  return true; // permite navegação
};

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Injeta o Router para podermos redirecionar o usuário
  const router = inject(Router);
  let authReq = req; // Inicia a requisição a ser enviada

  // Verifica se a requisição é para a nossa API
  if (req.url.includes(environment.apiSGA)) {
    const userData = sessionStorage.getItem('user');

    // Adiciona o token se o usuário estiver na sessão
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const token = parsedData.accessToken; // Confirme se o nome da propriedade é 'accessToken'

        if (token) {
          authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          });
        }
      } catch (e) {
        console.error('Erro ao parsear dados do usuário no interceptor', e);
      }
    }
  }

  // Envia a requisição (com ou sem token) e "escuta" a resposta
  return next(authReq).pipe(
    catchError((error: any) => {
      // Verifica se o erro é uma resposta HTTP e se o status é 401 (Não Autorizado)
      if (error instanceof HttpErrorResponse && error.status === 401) {
        console.warn('Erro 401 - Token inválido ou expirado. Deslogando...');

        // 2. Limpa os dados do usuário do sessionStorage
        sessionStorage.removeItem('user');

        // 3. Redireciona o usuário para a página de login
        router.navigate(['/login']);
      }

      // Re-lança o erro para que o service/componente que fez a chamada também saiba que falhou
      return throwError(() => error);
    })
  );
};

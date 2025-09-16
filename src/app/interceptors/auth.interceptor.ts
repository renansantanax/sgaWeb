import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  //verificar se a requisição é destinada para a API de produtos
  if (req.url.includes(environment.apiSGA)) {
    //acessar os dados do usuário autenticado na session storage
    var data = sessionStorage.getItem('user') as string;
    var json = JSON.parse(data);
    //adicionando o TOKEN do usuário na requisição
    const request = req.clone({
      setHeaders: { Authorization: 'Bearer ' + json.accessToken },
    });
    return next(request);
  }
  return next(req);
};

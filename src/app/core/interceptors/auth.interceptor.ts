import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

import { AuthService } from '@core/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const apiUrl = environment.apiUrl || 'https://gorest.co.in/public/v2';

  if (request.url.startsWith(apiUrl)) {
    const token = authService.getToken();

    if (token) {
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next(authReq);
    }
  }

  return next(request);
};

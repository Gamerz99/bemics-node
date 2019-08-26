import { HttpInterceptor } from '@angular/common/http';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private api: ApiService) { }

  intercept(req, next) {
    const tokenizdReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.api.gettoken()}`
      }
    });
    return next.handle(tokenizdReq);
  }
}

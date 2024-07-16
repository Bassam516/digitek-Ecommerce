import { HttpInterceptorFn } from '@angular/common/http';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  let updatedReq = req;

  if (typeof window !== 'undefined') {
    if (localStorage.getItem('usertoken') != null) {
      let token: any = localStorage.getItem('usertoken');

      updatedReq = req.clone({
        headers: req.headers.set('token', token)
      }) 
    
    }
  }
  return next(updatedReq);
};

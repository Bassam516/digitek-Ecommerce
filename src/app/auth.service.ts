import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  isLogin: any = new BehaviorSubject(null);
  userToken: any = 'null';
  userData: BehaviorSubject<any> = new BehaviorSubject<any>({ name: '', email: '', phone: '' });


  constructor(private _HttpClient: HttpClient, private _Router: Router) {
    if (typeof window !== 'undefined') {
      this.userToken = localStorage.getItem('usertoken');
      let userData = localStorage.getItem('userData');

      if (userData) {
        this.userData.next(JSON.parse(userData));
      }
    } else {
      this.userToken = 'null';
    }

    if (this.userToken !== null) {
      this.isLogin.next(true);
    }

  }


  register(userData:any): Observable<any>{
    return this._HttpClient.post('https://ecommerce.routemisr.com/api/v1/auth/signup', userData);
  }

  login(userData:any): Observable<any>{
    return this._HttpClient.post('https://ecommerce.routemisr.com/api/v1/auth/signin', userData);
  }

  signOut() {
    localStorage.removeItem('usertoken');
    this._Router.navigate(['/login']);
    this.isLogin.next(null);
  }

  forgetPassword(confirmEmail:any):Observable<any> {
    return this._HttpClient.post('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords', confirmEmail);
  }

  verifyResetCode(resetCode:any):Observable<any> {
    return this._HttpClient.post('https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode', resetCode);
  }

  resetPassword(newUserData:any):Observable<any> {
    return this._HttpClient.put('https://ecommerce.routemisr.com/api/v1/auth/resetPassword', newUserData);
  }

  updateUsreData(newData:any):Observable<any> {
    return this._HttpClient.put('https://ecommerce.routemisr.com/api/v1/users/updateMe/', newData)
  }

  updateUsrePassword(newPassword:any):Observable<any> {
    return this._HttpClient.put('https://ecommerce.routemisr.com/api/v1/users/changeMyPassword', newPassword)
  }
}

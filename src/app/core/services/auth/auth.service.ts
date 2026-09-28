import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from '../../../../../node_modules/jwt-decode';
import { Iuser } from '../../../shared/interfaces/iuser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}
  private readonly router = inject(Router);
  userData: Iuser = {} as Iuser;
  sendRegisterForm(data: object): Observable<any> {
    return this.httpClient.post(
      'https://ecommerce.routemisr.com/api/v1/auth/signup',
      data
    );
  }

  sendLoginForm(data: object): Observable<any> {
    return this.httpClient.post(
      'https://ecommerce.routemisr.com/api/v1/auth/signin',
      data
    );
  }

  saveUserData(): any {
    if (localStorage.getItem('userToken') !== null) {
      this.userData = jwtDecode(localStorage.getItem('userToken')!);
      console.log('userData', this.userData);
    }
  }

  logoutUser(): void {
    localStorage.removeItem('userToken');
    //  this.userData="null";
    this.userData = {} as Iuser;
    this.router.navigate(['/login']);
    console.log('hello', this.userData);
  }
  setVerfiyEmail(data: object): Observable<any> {
    return this.httpClient.post(
      'https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords',
      data
    );
  }

  setVerfiyCode(data: object): Observable<any> {
    return this.httpClient.post(
      'https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode',
      data
    );
  }

  setResetPassword(data: object): Observable<any> {
    return this.httpClient.put(
      'https://ecommerce.routemisr.com/api/v1/auth/resetPassword',
      data
    );
  }
}

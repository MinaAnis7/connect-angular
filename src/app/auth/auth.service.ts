import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { UserModel } from './user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private sessionTimeout: any;
  user = new BehaviorSubject<UserModel | null>(null);

  signup(email: string, password: string) {
    return this.httpClient
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCLhIq5-sFP3PUsq8D86E7UaezAolHq1XQ',
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((responseData) => {
          this.holdUser(responseData);
        })
      );
  }

  login(email: string, password: string) {
    return this.httpClient
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCLhIq5-sFP3PUsq8D86E7UaezAolHq1XQ',
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((responseData) => {
          this.holdUser(responseData);
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['auth']);
    localStorage.removeItem('userData');

    if (this.sessionTimeout) clearTimeout(this.sessionTimeout);

    this.sessionTimeout = null;
  }

  autoLogin() {
    const userData = localStorage.getItem('userData');

    if (!userData) return;

    const userObj = JSON.parse(userData);

    const loadedUser: UserModel = new UserModel(
      userObj.email,
      userObj.id,
      userObj._token,
      userObj._tokenExpirationDate
    );

    if (loadedUser.token) this.user.next(loadedUser);

    this.autoLogout(
      new Date(userObj._tokenExpirationDate).getTime() - new Date().getTime()
    );

    this.router.navigate(['app']);
  }

  autoLogout(tokenExpirationDuration: number) {
    this.sessionTimeout = setTimeout(() => {
      this.logout();
    }, tokenExpirationDuration);
  }

  private holdUser(responseData: AuthResponseData) {
    const expirationDate = new Date(
      new Date().getTime() + +responseData.expiresIn * 1000
    );
    const user = new UserModel(
      responseData.email,
      responseData.localId,
      responseData.idToken,
      expirationDate
    );

    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    this.autoLogout(+responseData.expiresIn * 1000);
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'An unknown error occurred!';

    if (!error.error || !error.error.error)
      return throwError(() => new Error(message));

    switch (error.error.error.message) {
      case 'EMAIL_EXISTS':
        message = 'This email address is already in use by another account.';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        message =
          'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        message =
          'The email, password, or both are incorrect. Or The user may have been deleted.';
        break;
      case 'USER_DISABLED:':
        message = 'The user account has been disabled by an administrator.';
    }
    return throwError(() => new Error(message));
  }
}

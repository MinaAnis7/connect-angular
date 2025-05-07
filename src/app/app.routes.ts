import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { authGuard } from './auth.guards';
import { LayoutComponent } from './layout/layout.component';
import { NewsfeedComponent } from './layout/newsfeed/newsfeed.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'prefix',
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
    ],
  },
  {
    path: 'app',
    canMatch: [authGuard],
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        redirectTo: 'newsfeed',
      },
      {
        path: 'newsfeed',
        component: NewsfeedComponent,
      },
    ],
  },
];

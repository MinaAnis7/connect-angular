import { Routes } from '@angular/router';
import { authGuard } from './auth.guards';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canMatch: [authGuard],
    redirectTo: 'app',
  },
  {
    path: 'app',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./main/main.component').then((mod) => mod.MainComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'main',
      },
      {
        path: 'main',
        loadComponent: () =>
          import('./main/layout/layout.component').then(
            (mod) => mod.LayoutComponent
          ),
        loadChildren: () =>
          import('./main/layout/layout.routes').then((m) => m.layoutRoutes),
      },
      {
        path: 'profile/:uid',
        loadComponent: () =>
          import('./main/user-profile/user-profile.component').then(
            (m) => m.UserProfileComponent
          ),
      },
      {
        path: 'edit-profile',
        loadComponent: () =>
          import('./main/edit-profile/edit-profile.component').then(
            (m) => m.EditProfileComponent
          ),
      },
      {
        path: 'chats',
        loadComponent: () =>
          import('./main/chat/chat.component').then((m) => m.ChatComponent),
        loadChildren: () =>
          import('./main/chat/chat.routes').then((m) => m.chatRoutes),
      },
    ],
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
        loadComponent: () =>
          import('./auth/login/login.component').then(
            (mod) => mod.LoginComponent
          ),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./auth/signup/signup.component').then(
            (mod) => mod.SignupComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/auth',
  },
];

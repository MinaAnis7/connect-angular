import { Routes } from '@angular/router';

export const layoutRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'newsfeed',
  },
  {
    path: 'newsfeed',
    loadComponent: () =>
      import('./newsfeed/newsfeed.component').then((m) => m.NewsfeedComponent),
  },
  {
    path: 'friends',
    loadComponent: () =>
      import('./friends/friends.component').then((m) => m.FriendsComponent),
  },
  {
    path: 'new-friends',
    loadComponent: () =>
      import('./new-friends/new-friends.component').then(
        (m) => m.NewFriendsComponent
      ),
  },
];

import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { authGuard } from './auth.guards';
import { UserProfileComponent } from './main/user-profile/user-profile.component';
import { MainComponent } from './main/main.component';
import { LayoutComponent } from './main/layout/layout.component';
import { NewsfeedComponent } from './main/layout/newsfeed/newsfeed.component';
import { FriendsComponent } from './main/layout/friends/friends.component';
import { NewFriendsComponent } from './main/layout/new-friends/new-friends.component';
import { ChatComponent } from './main/chat/chat.component';
import { NoSelectedChatComponent } from './main/chat/no-selected-chat/no-selected-chat.component';
import { UserChatComponent } from './main/chat/user-chat/user-chat.component';
import { EditProfileComponent } from './main/edit-profile/edit-profile.component';

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
    component: MainComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'main',
      },
      {
        path: 'main',
        component: LayoutComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'newsfeed',
          },
          {
            path: 'newsfeed',
            component: NewsfeedComponent,
          },
          {
            path: 'friends',
            component: FriendsComponent,
          },
          {
            path: 'new-friends',
            component: NewFriendsComponent,
          },
        ],
      },
      {
        path: 'profile/:uid',
        component: UserProfileComponent,
      },
      {
        path: 'edit-profile',
        component: EditProfileComponent,
      },
      {
        path: 'chats',
        component: ChatComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: NoSelectedChatComponent,
          },
          {
            path: ':uid',
            component: UserChatComponent,
          },
        ],
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
        component: LoginComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/auth',
  },
];

import { Routes } from '@angular/router';
import { NoSelectedChatComponent } from './no-selected-chat/no-selected-chat.component';
import { UserChatComponent } from './user-chat/user-chat.component';

export const chatRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: NoSelectedChatComponent,
  },
  {
    path: ':uid',
    component: UserChatComponent,
  },
];

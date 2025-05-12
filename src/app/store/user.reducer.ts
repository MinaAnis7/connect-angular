import { createReducer, on } from '@ngrx/store';
import { saveCurrentUser } from './user.actions';
import { User } from '../main/user/user.model';

export const userReducer = createReducer<null | User>(
  null,
  on(saveCurrentUser, (state, action) => action.user)
);

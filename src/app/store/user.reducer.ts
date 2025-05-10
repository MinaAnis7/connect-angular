import { createReducer, on } from '@ngrx/store';
import { saveCurrentUser } from './user.actions';
import type { User } from '../user/user.model';

export const userReducer = createReducer<null | User>(
  null,
  on(saveCurrentUser, (state, action) => action.user)
);

import { createReducer, on } from '@ngrx/store';
import { saveCurrentUser, updateCurrentUser } from './user.actions';
import { User } from '../main/user/user.model';

export const userReducer = createReducer<null | User>(
  null,
  on(saveCurrentUser, (state, action) => action.user),
  on(updateCurrentUser, (state, action) => {
    return {
      ...state!,
      ...action.data,
    };
  })
);

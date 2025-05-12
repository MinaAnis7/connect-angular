import { createAction, props } from '@ngrx/store';
import { User } from '../main/user/user.model';

export const saveCurrentUser = createAction(
  '[User] Save',
  props<{ user: User }>()
);

import { createAction, props } from '@ngrx/store';
import { User } from '../user/user.model';

export const saveCurrentUser = createAction(
  '[User] Save',
  props<{ user: User }>()
);

import { inject } from '@angular/core';
import { CanMatchFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

export const authGuard: CanMatchFn = () => {
  const user = inject(AuthService).user.getValue();
  const router = inject(Router);

  return user ? true : new RedirectCommand(router.parseUrl('/auth'));
};

import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Auth, User } from '@angular/fire/auth';

export const authGuard: CanMatchFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const user = await new Promise<User | null>((resolve) => {
    const unsub = auth.onAuthStateChanged((user) => {
      unsub();
      resolve(user);
    });
  });

  return user ? true : router.parseUrl('/auth');
};

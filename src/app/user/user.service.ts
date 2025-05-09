import { inject, Injectable } from '@angular/core';
import type { User } from './user.model';
import {
  addDoc,
  collection,
  CollectionReference,
  Firestore,
} from '@angular/fire/firestore';
import { ToastService } from '../shared/toast-container/toast.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private toastService = inject(ToastService);
  private db = inject(Firestore);

  async storeNewUser(user: User) {
    const userCollection: CollectionReference<User> = collection(
      this.db,
      'users'
    ) as CollectionReference<User>;
    try {
      await addDoc(userCollection, user);
    } catch (error) {
      this.toastService.toast$.next({
        message: error as string,
        isError: true,
      });
    }
  }
}

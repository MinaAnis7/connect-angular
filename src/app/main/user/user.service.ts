import { inject, Injectable } from '@angular/core';
import {
  doc,
  docData,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { ToastService } from '../../shared/toast-container/toast.service';
import type { User, UserData } from './user.model';
import { Store } from '@ngrx/store';
import { saveCurrentUser } from '../../store/user.actions';

@Injectable({ providedIn: 'root' })
export class UserService {
  private toastService = inject(ToastService);
  private db = inject(Firestore);
  private store = inject(Store);

  async storeNewUser(user: UserData, id: string) {
    try {
      await setDoc(doc(this.db, 'users', id), user);

      this.store.dispatch(
        saveCurrentUser({
          user: {
            ...user,
            id: id,
            posts: [],
          },
        })
      );
    } catch (error) {
      this.toastService.toast$.next({
        message: error as string,
        isError: true,
      });
    }
  }

  async getLoggedInUser(userID?: string) {
    if (userID) {
      const docRef = doc(this.db, 'users', userID);
      const userDocSnap = await getDoc(docRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as User;
        this.store.dispatch(saveCurrentUser({ user: userData }));
      }
    }
  }

  getPostAuthor(docRef: DocumentReference) {
    return docData(docRef);
  }

  getUserById(id: string) {
    const docRef = doc(this.db, 'users', id);
    return docData(docRef);
  }
}

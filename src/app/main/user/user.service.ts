import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
import {
  collection,
  collectionData,
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
  private injectionContext = inject(EnvironmentInjector);
  private toastService = inject(ToastService);
  private db = inject(Firestore);
  private store = inject(Store);

  async storeNewUser(user: UserData, id: string) {
    try {
      await runInInjectionContext(this.injectionContext, async () => {
        return await setDoc(doc(this.db, 'users', id), user);
      });

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
      const userDocSnap = await runInInjectionContext(
        this.injectionContext,
        async () => {
          return await getDoc(docRef);
        }
      );

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as User;
        this.store.dispatch(saveCurrentUser({ user: userData }));
      }
    }
  }

  getPostAuthor(docRef: DocumentReference) {
    return runInInjectionContext(this.injectionContext, () => {
      return docData(docRef);
    });
  }

  getUserById(id: string) {
    return runInInjectionContext(this.injectionContext, () => {
      const docRef = doc(this.db, 'users', id);
      return docData(docRef);
    });
  }

  getAllUsers() {
    return runInInjectionContext(this.injectionContext, () => {
      return collectionData(collection(this.db, 'users'), { idField: 'id' });
    });
  }

  getUsersFromIdList(ids: string[]) {
    const users = Promise.all(
      ids.map(async (userId) => {
        const user = await runInInjectionContext(
          this.injectionContext,
          async () => {
            return await getDoc(doc(this.db, 'users', userId));
          }
        );
        return {
          ...user.data(),
          id: userId,
        } as User;
      })
    );

    return users;
  }
}

import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { of, switchMap } from 'rxjs';
import type { User } from './user/user.model';

@Injectable({ providedIn: 'root' })
export class ConnectionsService {
  private db = inject(Firestore);
  private injectionContext = inject(EnvironmentInjector);
  private authService = inject(AuthService);

  async sendConnectionRequest(fromUserId: string, toUserId: string) {
    await runInInjectionContext(this.injectionContext, async () => {
      const notificationCollection = collection(
        this.db,
        'users',
        toUserId,
        'friendRequests'
      );
      const fromUserDoc = doc(this.db, 'users', fromUserId);

      return await runInInjectionContext(this.injectionContext, async () => {
        return await addDoc(notificationCollection, {
          from: fromUserDoc,
        });
      });
    });
  }

  async acceptConnectionRequest(fromId: string, notificationId: string) {
    return await runInInjectionContext(this.injectionContext, async () => {
      const notificationDoc = doc(
        this.db,
        'users',
        this.authService.currentUserId()!,
        'friendRequests',
        notificationId
      );
      const fromUserDoc = doc(
        this.db,
        'users',
        this.authService.currentUserId()!,
        'connections',
        fromId
      );

      const currentUserDoc = doc(
        this.db,
        'users',
        fromId,
        'connections',
        this.authService.currentUserId()!
      );
      await runInInjectionContext(this.injectionContext, async () => {
        return await setDoc(fromUserDoc, {});
      });
      await runInInjectionContext(this.injectionContext, async () => {
        return await setDoc(currentUserDoc, {});
      });

      return await runInInjectionContext(this.injectionContext, async () => {
        return await deleteDoc(notificationDoc);
      });
    });
  }

  getAllConnections() {
    return runInInjectionContext(this.injectionContext, () => {
      return collectionData(
        collection(
          this.db,
          'users',
          this.authService.currentUserId()!,
          'connections'
        ),
        { idField: 'id' }
      ).pipe(
        switchMap((connections) => {
          if (connections.length === 0) return of([]);
          return Promise.all(
            connections.map(async (friend) => {
              const snapShot = await runInInjectionContext(
                this.injectionContext,
                async () => {
                  return await getDoc(doc(this.db, 'users', friend.id));
                }
              );

              return {
                id: snapShot.id,
                ...snapShot.data(),
              } as User;
            })
          );
        })
      );
    });
  }
}

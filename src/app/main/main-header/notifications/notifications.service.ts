import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
} from '@angular/fire/firestore';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../user/user.model';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private db = inject(Firestore);
  private injectionContext = inject(EnvironmentInjector);
  private authService = inject(AuthService);

  getFriendRequests(): Observable<
    { id: string; from: User; userId: string }[]
  > {
    return runInInjectionContext(this.injectionContext, () => {
      const colRef = collection(
        this.db,
        'users',
        this.authService.currentUserId()!,
        'friendRequests'
      );

      return collectionData(colRef, { idField: 'id' }).pipe(
        switchMap((notifs: any[]) => {
          if (notifs.length === 0) return of([]);
          return Promise.all(
            notifs.map(async (notif) => {
              const fromUserDoc = await runInInjectionContext(
                this.injectionContext,
                async () => {
                  return await getDoc(notif.from);
                }
              );

              return {
                id: notif.id,
                from: fromUserDoc.data() as User,
                userId: fromUserDoc.id,
              };
            })
          ).then((users) => users);
        })
      );
    });
  }

  getNotifications(): Observable<{ id: string; from: User; type: string }[]> {
    return runInInjectionContext(this.injectionContext, () => {
      const colRef = collection(
        this.db,
        'users',
        this.authService.currentUserId()!,
        'notifications'
      );

      return collectionData(colRef, { idField: 'id' }).pipe(
        switchMap((notifs: any[]) => {
          if (notifs.length === 0) return of([]);

          return Promise.all(
            notifs.map(async (notif) => {
              const fromUserDoc = await runInInjectionContext(
                this.injectionContext,
                async () => {
                  return await getDoc(notif.from);
                }
              );

              return {
                id: notif.id,
                from: fromUserDoc.data() as User,
                type: notif.type,
              };
            })
          ).then((users) => users);
        })
      );
    });
  }

  async clearNofitication(notifId: string) {
    const notifDoc = runInInjectionContext(this.injectionContext, () => {
      return doc(
        this.db,
        'users',
        this.authService.currentUserId()!,
        'notifications',
        notifId
      );
    });

    await runInInjectionContext(this.injectionContext, async () => {
      return await deleteDoc(notifDoc);
    });
  }

  async declineRequest(reqId: string) {
    const reqDoc = runInInjectionContext(this.injectionContext, () => {
      return doc(
        this.db,
        'users',
        this.authService.currentUserId()!,
        'friendRequests',
        reqId
      );
    });

    await runInInjectionContext(this.injectionContext, async () => {
      return await deleteDoc(reqDoc);
    });
  }
}

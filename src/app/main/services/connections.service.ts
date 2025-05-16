import { inject, Injectable } from '@angular/core';
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
import { AuthService } from '../../auth/auth.service';
import { of, switchMap } from 'rxjs';
import type { User } from '../user/user.model';

@Injectable({ providedIn: 'root' })
export class ConnectionsService {
  private db = inject(Firestore);
  private authService = inject(AuthService);

  async sendConnectionRequest(fromUserId: string, toUserId: string) {
    const notificationCollection = collection(
      this.db,
      'users',
      toUserId,
      'friendRequests'
    );
    const fromUserDoc = doc(this.db, 'users', fromUserId);

    await addDoc(notificationCollection, {
      from: fromUserDoc,
    });
  }

  async acceptConnectionRequest(fromId: string, notificationId: string) {
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

    await setDoc(fromUserDoc, {});
    await setDoc(currentUserDoc, {});

    return deleteDoc(notificationDoc);
  }

  getAllConnections() {
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
            const snapShot = await getDoc(doc(this.db, 'users', friend.id));

            return {
              id: snapShot.id,
              ...snapShot.data(),
            } as User;
          })
        );
      })
    );
  }
}

import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { AuthService } from '../../auth/auth.service';

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
}

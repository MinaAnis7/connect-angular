import { inject, Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class ConnectionsService {
  private db = inject(Firestore);

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
}

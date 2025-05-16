import { inject, Injectable } from '@angular/core';
import {
  collection,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
} from '@angular/fire/firestore';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../user/user.model';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private db = inject(Firestore);
  private authService = inject(AuthService);

  async getFriendRequests() {
    const friendsReqCol = collection(
      this.db,
      'users',
      this.authService.currentUserId()!,
      'friendRequests'
    );
    const snapShot = await getDocs(friendsReqCol);

    const notificationsWithUsers = await Promise.all(
      snapShot.docs.map(async (notifDoc) => {
        const user = await getDoc(
          (notifDoc.data() as { from: DocumentReference })?.from
        );

        return {
          id: notifDoc.id,
          from: user.data() as User,
        };
      })
    );

    return notificationsWithUsers;
  }
}

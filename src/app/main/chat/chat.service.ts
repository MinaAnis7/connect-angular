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
  Firestore,
  orderBy,
  query,
  serverTimestamp,
} from '@angular/fire/firestore';
import { AuthService } from '../../auth/auth.service';
import { map, Observable } from 'rxjs';
import { Message } from './message.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private db = inject(Firestore);
  private injectionContext = inject(EnvironmentInjector);
  private authService = inject(AuthService);

  async sendMessage(toId: string, msg: string) {
    await runInInjectionContext(this.injectionContext, async () => {
      const myChatCol = collection(
        this.db,
        'users',
        this.authService.currentUserId()!,
        'connections',
        toId,
        'chat'
      );

      const recipientChatCol = collection(
        this.db,
        'users',
        toId,
        'connections',
        this.authService.currentUserId()!,
        'chat'
      );

      const message = {
        from: this.authService.currentUserId()!,
        message: msg,
        date: serverTimestamp(),
      };

      await runInInjectionContext(this.injectionContext, async () => {
        return await addDoc(myChatCol, message);
      });

      return await runInInjectionContext(this.injectionContext, async () => {
        return await addDoc(recipientChatCol, message);
      });
    });
  }

  getChat(userId: string): Observable<Message[]> {
    return runInInjectionContext(this.injectionContext, () => {
      const chatCol = collection(
        this.db,
        'users',
        this.authService.currentUserId()!,
        'connections',
        userId,
        'chat'
      );

      return collectionData(query(chatCol, orderBy('date', 'desc')), {
        idField: 'id',
      }).pipe(
        map((msgs) => {
          return msgs.map((msg) => {
            return {
              ...msg,
              date: msg['date']?.toDate(),
            } as Message;
          });
        })
      );
    });
  }
}

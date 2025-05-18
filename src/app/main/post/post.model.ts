import { DocumentReference } from '@angular/fire/firestore';
import type { User } from '../user/user.model';

export interface Post {
  id: string;
  author: DocumentReference;
  date: Date;
  text: string | null;
  imgUrl: string | null;
}

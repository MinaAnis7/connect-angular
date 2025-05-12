import { DocumentReference } from '@angular/fire/firestore';

export interface Post {
  id: string;
  author: DocumentReference;
  date: Date;
  text: string | null;
  imgUrl: string | null;
  lovesNumber: number;
  commentsNumber: number;
}

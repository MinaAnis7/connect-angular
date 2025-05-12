import { DocumentReference } from '@angular/fire/firestore';

export interface User {
  id: string;
  fName: string;
  lName: string;
  bio: string;
  profileImage: string;
  cover: string;
  posts: DocumentReference[];
}

export interface UserData {
  fName: string;
  lName: string;
  bio: string;
  profileImage: string;
  cover: string;
}

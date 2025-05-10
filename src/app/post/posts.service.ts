import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  serverTimestamp,
  setDoc,
} from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, switchMap } from 'rxjs';
import { ToastService } from '../shared/toast-container/toast.service';
import { UserService } from '../user/user.service';
import type { User } from '../user/user.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private db = inject(Firestore);
  private authService = inject(AuthService);
  private httpClient = inject(HttpClient);
  private toastService = inject(ToastService);
  private userService = inject(UserService);

  createNewPost(postText: string, postImg: File | null) {
    if (postImg) {
      const formData = new FormData();
      let imgUrl = '';

      formData.append('file', postImg);
      formData.append('upload_preset', 'unsigned_preset');

      this.httpClient
        .post<any>('https://api.cloudinary.com/v1_1/dnhvn7s3i/upload', formData)
        .pipe(map((res) => res.secure_url))
        .subscribe({
          next: (url) => {
            imgUrl = url;
          },
          error: (error) => {
            this.toastService.toast$.next(error);
          },
          complete: () => {
            this.savePostData(postText, imgUrl);
          },
        });
    } else {
      this.savePostData(postText);
    }
  }

  async savePostData(postText: string, imgUrl: string | null = null) {
    const postsCollection = collection(this.db, 'posts');

    const docRef = doc(postsCollection);
    const currentUserRef = doc(
      this.db,
      'users',
      this.authService.user.getValue()!.id
    );

    await setDoc(docRef, {
      text: postText,
      imgUrl: imgUrl,
      id: docRef,
      author: currentUserRef,
      date: serverTimestamp(),
      lovesNumber: 0,
      commentsNumber: 0,
    });
  }

  getAllPosts() {
    const postsCollection = collection(this.db, 'posts');

    return collectionData(postsCollection).pipe(
      map((posts) => {
        return posts.map((post) => {
          return {
            ...post,
            date: post['date'].toDate(),
          };
        });
      })
    );
  }
}

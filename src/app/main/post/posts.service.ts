import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  serverTimestamp,
  setDoc,
} from '@angular/fire/firestore';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { map, of, switchMap } from 'rxjs';
import { ToastService } from '../../shared/toast-container/toast.service';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private db = inject(Firestore);
  private authService = inject(AuthService);
  private httpClient = inject(HttpClient);
  private toastService = inject(ToastService);

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
      this.authService.currentUserId()!
    );
    const userPostDoc = doc(
      this.db,
      'users',
      this.authService.currentUserId()!,
      'posts',
      docRef.id
    );
    const postData = {
      text: postText,
      imgUrl: imgUrl,
      id: docRef,
      author: currentUserRef,
      date: serverTimestamp(),
    };

    await setDoc(docRef, postData);
    await setDoc(userPostDoc, {});
  }

  getAllPosts() {
    const postsCollection = collection(this.db, 'posts');

    return collectionData(postsCollection).pipe(
      map((posts) => {
        return posts.map((post) => {
          return {
            ...post,
            date: post['date']?.toDate(),
            id: post['id']?.id,
          };
        });
      })
    );
  }

  getUserSpecificPosts(userId: string) {
    const userPostsSubCollection = collection(
      this.db,
      'users',
      userId,
      'posts'
    );

    return collectionData(userPostsSubCollection, { idField: 'id' }).pipe(
      switchMap((postsId) => {
        if (postsId.length === 0) return of([]);

        const posts = Promise.all(
          postsId.map(async (post) => {
            const postDoc = doc(this.db, 'posts', post.id);
            const postSnapShot = await getDoc(postDoc);

            return {
              ...postSnapShot.data(),
              date: postSnapShot.data()?.['date'].toDate(),
            };
          })
        );

        return posts;
      })
    );
  }

  async lovePost(postId: string) {
    const postsLoveDoc = doc(
      this.db,
      'posts',
      postId,
      'loves',
      this.authService.currentUserId()!
    );

    await setDoc(postsLoveDoc, {});
  }

  getPostLoves(postId: string) {
    return collectionData(collection(this.db, 'posts', postId, 'loves'), {
      idField: 'id',
    }).pipe(
      map((users) => {
        return users.map((user) => user.id);
      })
    );
  }
}

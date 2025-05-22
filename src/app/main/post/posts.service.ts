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
  deleteDoc,
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
import { User } from '../user/user.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private db = inject(Firestore);
  private injectionContext = inject(EnvironmentInjector);
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
    return await runInInjectionContext(this.injectionContext, async () => {
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

      await runInInjectionContext(this.injectionContext, async () => {
        return await setDoc(docRef, postData);
      });
      await runInInjectionContext(this.injectionContext, async () => {
        return await setDoc(userPostDoc, {});
      });
    });
  }

  getAllPosts() {
    return runInInjectionContext(this.injectionContext, () => {
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
    });
  }

  getUserSpecificPosts(userId: string) {
    return runInInjectionContext(this.injectionContext, () => {
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
              const postSnapShot = await runInInjectionContext(
                this.injectionContext,
                async () => {
                  const postDoc = doc(this.db, 'posts', post.id);
                  return await getDoc(postDoc);
                }
              );

              return {
                ...postSnapShot.data(),
                date: postSnapShot.data()?.['date'].toDate(),
                id: postSnapShot.data()?.['id'].id,
              };
            })
          );

          return posts;
        })
      );
    });
  }

  async lovePost(postId: string, postAuthorId: string) {
    await runInInjectionContext(this.injectionContext, async () => {
      const postsLoveDoc = doc(
        this.db,
        'posts',
        postId,
        'loves',
        this.authService.currentUserId()!
      );
      const authorNotificationsCol = collection(
        this.db,
        'users',
        postAuthorId,
        'notifications'
      );
      const userDoc = doc(this.db, 'users', this.authService.currentUserId()!);

      await setDoc(postsLoveDoc, {});
      await runInInjectionContext(this.injectionContext, async () => {
        return await addDoc(authorNotificationsCol, {
          type: 'Loved',
          from: userDoc,
        });
      });
    });
  }

  async removeLove(postId: string) {
    await runInInjectionContext(this.injectionContext, async () => {
      const postsLoveDoc = doc(
        this.db,
        'posts',
        postId,
        'loves',
        this.authService.currentUserId()!
      );

      await deleteDoc(postsLoveDoc);
    });
  }

  getPostLoves(postId: string) {
    return runInInjectionContext(this.injectionContext, () => {
      return collectionData(collection(this.db, 'posts', postId, 'loves'), {
        idField: 'id',
      }).pipe(
        map((users) => {
          return users.map((user) => user.id);
        })
      );
    });
  }

  async comment(postId: string, comment: string) {
    await runInInjectionContext(this.injectionContext, async () => {
      const postCol = collection(this.db, 'posts', postId, 'comments');

      await addDoc(postCol, {
        from: this.authService.currentUserId(),
        comment: comment,
      });
    });
  }

  getPostComments(postId: string) {
    return runInInjectionContext(this.injectionContext, () => {
      const postCommentsCol = collection(this.db, 'posts', postId, 'comments');

      return collectionData(postCommentsCol, { idField: 'id' }).pipe(
        switchMap((comments) => {
          const commentsPosters = Promise.all(
            comments.map(async (comment) => {
              const posterSnapShot = await runInInjectionContext(
                this.injectionContext,
                async () => {
                  return await getDoc(doc(this.db, 'users', comment['from']));
                }
              );

              return {
                id: comment.id,
                comment: comment['comment'] as string,
                from: posterSnapShot.data() as User,
              };
            })
          );

          return commentsPosters;
        })
      );
    });
  }

  getCommentsNumber(postId: string) {
    return runInInjectionContext(this.injectionContext, () => {
      return collectionData(
        collection(this.db, 'posts', postId, 'comments')
      ).pipe(map((comments) => comments.length));
    });
  }

  async deletePost(postId: string) {
    await runInInjectionContext(this.injectionContext, async () => {
      // Delete post reference in users collection
      const userPostDoc = doc(
        this.db,
        'users',
        this.authService.currentUserId()!,
        'posts',
        postId
      );

      // Delete the post itself
      const postDoc = doc(this.db, 'posts', postId);

      await runInInjectionContext(this.injectionContext, async () => {
        return await deleteDoc(userPostDoc);
      });
      await runInInjectionContext(this.injectionContext, async () => {
        return await deleteDoc(postDoc);
      });
    });
  }
}

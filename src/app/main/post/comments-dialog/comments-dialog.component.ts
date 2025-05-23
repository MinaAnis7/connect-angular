import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faXmark, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import type { User } from '../../user/user.model';
import type { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { ReadMoreComponent } from '../../../shared/read-more/read-more.component';

@Component({
  selector: 'app-comments-dialog',
  imports: [MatDialogModule, FontAwesomeModule, ReadMoreComponent],
  templateUrl: './comments-dialog.component.html',
  styleUrl: './comments-dialog.component.css',
})
export class CommentsDialogComponent implements OnInit {
  private store = inject(Store);
  private postsService = inject(PostsService);
  private destroyRef = inject(DestroyRef);
  private post = inject<Post>(MAT_DIALOG_DATA);
  comments = signal<{ from: User; comment: string; id: string }[] | undefined>(
    undefined
  );
  currentUser = signal<User | undefined>(undefined);

  constructor(library: FaIconLibrary) {
    library.addIcons(faXmark, faPaperPlane);
  }

  ngOnInit(): void {
    const currentUserSubs = this.store.select('currentUser').subscribe({
      next: (user) => {
        this.currentUser.set(user as User);
      },
    });

    const commentSubs = this.postsService
      .getPostComments(this.post.id)
      .subscribe({
        next: (comments) => {
          this.comments.set(comments);
        },
      });

    this.destroyRef.onDestroy(() => {
      currentUserSubs.unsubscribe();
      commentSubs.unsubscribe();
    });
  }

  onComment(commentCtrl: HTMLInputElement) {
    this.postsService.comment(
      this.post.id,
      commentCtrl.value,
      this.post.author.id
    );
    commentCtrl.value = '';
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import type { User } from '../user/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreatePostDialogComponent } from '../create-post-dialog/create-post-dialog.component';
import { Post } from '../post/post.model';
import { PostComponent } from '../post/post.component';
import { PostsService } from '../post/posts.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user-profile',
  imports: [MatIconModule, MatDialogModule, PostComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  private store = inject(Store);
  private authService = inject(AuthService);
  private postsService = inject(PostsService);
  private readonly dialog = inject(MatDialog);
  user?: User;
  posts?: Post[];

  ngOnInit(): void {
    this.store.select('currentUser').subscribe({
      next: (user) => {
        this.user = user;
      },
    });

    this.postsService
      .getUserSpecificPosts(this.authService.currentUserId()!)
      .subscribe({
        next: (posts) => {
          this.posts = posts as Post[];
        },
      });
  }

  get userFullName() {
    return this.user?.fName + ' ' + this.user?.lName;
  }

  openCreatePostDialog() {
    this.dialog.open(CreatePostDialogComponent);
  }
}

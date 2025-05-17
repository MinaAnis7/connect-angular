import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PostComponent } from '../../post/post.component';
import { Post } from '../../post/post.model';
import { PostsService } from '../../post/posts.service';
import { CreatePostDialogComponent } from '../../create-post-dialog/create-post-dialog.component';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-newsfeed',
  imports: [
    MatIconModule,
    PostComponent,
    MatDialogModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './newsfeed.component.html',
  styleUrl: './newsfeed.component.css',
})
export class NewsfeedComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private postsService = inject(PostsService);
  posts = signal<Post[] | undefined>(undefined);

  ngOnInit(): void {
    this.postsService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts.set(posts as Post[]);
      },
    });
  }

  openCreatePostDialog() {
    this.dialog.open(CreatePostDialogComponent);
  }
}

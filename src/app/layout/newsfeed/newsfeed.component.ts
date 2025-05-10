import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PostComponent } from '../../post/post.component';
import type { Post } from '../../post/post.model';
import { CreatePostDialogComponent } from '../../create-post-dialog/create-post-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PostsService } from '../../post/posts.service';

@Component({
  selector: 'app-newsfeed',
  imports: [MatIconModule, PostComponent, MatDialogModule],
  templateUrl: './newsfeed.component.html',
  styleUrl: './newsfeed.component.css',
})
export class NewsfeedComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private postsService = inject(PostsService);
  posts = signal<Post[]>([]);

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

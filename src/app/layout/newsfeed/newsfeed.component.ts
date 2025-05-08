import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PostComponent } from '../../post/post.component';
import { Post } from '../../post/post.model';
import { CreatePostDialogComponent } from '../../create-post-dialog/create-post-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-newsfeed',
  imports: [MatIconModule, PostComponent, MatDialogModule],
  templateUrl: './newsfeed.component.html',
  styleUrl: './newsfeed.component.css',
})
export class NewsfeedComponent {
  private readonly dialog = inject(MatDialog);

  post: Post = {
    authorName: 'John Doe',
    date: new Date(Date.now()),
    text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odit nostrum labore voluptatem. Odit mollitia eius totam officia esse ullam quo dolor quaerat cupiditate! Qui quos ratione nemo quod error commodi at! Optio, sit voluptate. Quisquam alias, culpa praesentium cupiditate voluptates quo, autem incidunt amet consequatur reiciendis dolor rem veniam quibusdam quae exercitationem accusamus ipsam sint laborum? Excepturi provident labore temporibus.',
    imgUrl: 'https://placehold.co/800',
    lovesNumber: 12,
    commentsNumber: 7,
  };

  openCreatePostDialog() {
    this.dialog.open(CreatePostDialogComponent);
  }
}

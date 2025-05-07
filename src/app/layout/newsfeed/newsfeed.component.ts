import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PostComponent } from '../../shared/post/post.component';
import { Post } from '../../shared/post/post.model';

@Component({
  selector: 'app-newsfeed',
  imports: [MatIconModule, PostComponent],
  templateUrl: './newsfeed.component.html',
  styleUrl: './newsfeed.component.css',
})
export class NewsfeedComponent {
  post: Post = {
    authorName: 'John Doe',
    date: new Date(Date.now()),
    text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odit nostrum labore voluptatem. Odit mollitia eius totam officia esse ullam quo dolor quaerat cupiditate! Qui quos ratione nemo quod error commodi at! Optio, sit voluptate. Quisquam alias, culpa praesentium cupiditate voluptates quo, autem incidunt amet consequatur reiciendis dolor rem veniam quibusdam quae exercitationem accusamus ipsam sint laborum? Excepturi provident labore temporibus.',
    imgUrl: 'https://placehold.co/800',
    lovesNumber: 12,
    commentsNumber: 7,
  };
}

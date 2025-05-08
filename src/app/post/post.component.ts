import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faEllipsisVertical, faHeart } from '@fortawesome/free-solid-svg-icons';
import {
  faCommentDots,
  faHeart as regularHeart,
} from '@fortawesome/free-regular-svg-icons';
import { ReadMoreComponent } from '../shared/read-more/read-more.component';
import { Post } from './post.model';

@Component({
  selector: 'app-post',
  imports: [DatePipe, FontAwesomeModule, ReadMoreComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent {
  post = input.required<Post>();

  constructor(library: FaIconLibrary) {
    library.addIcons(faEllipsisVertical, faHeart, faCommentDots, regularHeart);
  }
}

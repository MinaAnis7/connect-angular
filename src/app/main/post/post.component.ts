import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faEllipsisVertical, faHeart } from '@fortawesome/free-solid-svg-icons';
import {
  faCommentDots,
  faHeart as regularHeart,
} from '@fortawesome/free-regular-svg-icons';
import { ReadMoreComponent } from '../../shared/read-more/read-more.component';
import { Post } from './post.model';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post',
  imports: [DatePipe, FontAwesomeModule, ReadMoreComponent, RouterLink],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent implements OnInit {
  post = input.required<Post>();
  author = signal<User | undefined>(undefined);
  authorName = computed(
    () => `${this.author()?.fName} ${this.author()?.lName}`
  );
  private userService = inject(UserService);

  constructor(library: FaIconLibrary) {
    library.addIcons(faEllipsisVertical, faHeart, faCommentDots, regularHeart);
  }

  ngOnInit(): void {
    this.userService.getPostAuthor(this.post().author).subscribe({
      next: (author) => {
        this.author.set(author as User);
      },
    });
  }
}

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
import { PostsService } from './posts.service';
import { AuthService } from '../../auth/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LovesDialogComponent } from './loves-dialog/loves-dialog.component';
import { CommentsDialogComponent } from './comments-dialog/comments-dialog.component';

@Component({
  selector: 'app-post',
  imports: [
    DatePipe,
    FontAwesomeModule,
    ReadMoreComponent,
    RouterLink,
    MatDialogModule,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent implements OnInit {
  post = input.required<Post>();
  author = signal<User | undefined>(undefined);
  isLoved = signal<boolean>(false);
  loves = signal<string[] | undefined>(undefined);
  authorName = computed(
    () => `${this.author()?.fName} ${this.author()?.lName}`
  );
  private userService = inject(UserService);
  private postsService = inject(PostsService);
  private authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  constructor(library: FaIconLibrary) {
    library.addIcons(faEllipsisVertical, faHeart, faCommentDots, regularHeart);
  }

  ngOnInit(): void {
    this.userService.getPostAuthor(this.post().author).subscribe({
      next: (author) => {
        this.author.set(author as User);
      },
    });

    this.postsService.getPostLoves(this.post().id).subscribe({
      next: (ids) => {
        this.loves.set(ids);

        if (this.loves()?.includes(this.authService.currentUserId()!)) {
          this.isLoved.set(true);
        }
      },
    });
  }

  onLove() {
    if (this.isLoved()) {
      this.isLoved.set(false);
      this.postsService.removeLove(this.post().id);
    } else {
      this.isLoved.set(true);
      this.postsService.lovePost(this.post().id, this.post().author.id);
    }
  }

  showLoves() {
    this.dialog.open(LovesDialogComponent, {
      data: this.loves,
    });
  }

  openComments() {
    this.dialog.open(CommentsDialogComponent);
  }
}

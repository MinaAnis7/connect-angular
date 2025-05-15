import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import type { User } from '../user/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreatePostDialogComponent } from '../create-post-dialog/create-post-dialog.component';
import { Post } from '../post/post.model';
import { PostComponent } from '../post/post.component';
import { PostsService } from '../post/posts.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user-profile',
  imports: [MatIconModule, MatDialogModule, PostComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  private userService = inject(UserService);
  private postsService = inject(PostsService);
  private readonly dialog = inject(MatDialog);
  private authService = inject(AuthService);
  uid = input.required<string>();
  user = signal<User | undefined>(undefined);
  posts = signal<Post[] | undefined>(undefined);

  isUserOwnProfile = computed(
    () => this.authService.currentUserId() === this.uid()
  );

  ngOnInit(): void {
    this.userService.getUserById(this.uid()).subscribe({
      next: (userData) => {
        this.user.set(userData as User);
      },
    });

    this.postsService.getUserSpecificPosts(this.uid()).subscribe({
      next: (posts) => {
        this.posts.set(posts as Post[]);
      },
    });
  }

  get userFullName() {
    return this.user()?.fName + ' ' + this.user()?.lName;
  }

  openCreatePostDialog() {
    this.dialog.open(CreatePostDialogComponent);
  }
}

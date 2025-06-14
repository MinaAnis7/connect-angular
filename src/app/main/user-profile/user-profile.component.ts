import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
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
import { ConnectionsService } from '../connections.service';
import { ToastService } from '../../shared/toast-container/toast.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { RouterLink } from '@angular/router';
import { ConnectionsDialogComponent } from './connections-dialog/connections-dialog.component';

@Component({
  selector: 'app-user-profile',
  imports: [
    MatIconModule,
    MatDialogModule,
    PostComponent,
    LoadingSpinnerComponent,
    RouterLink,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  private userService = inject(UserService);
  private postsService = inject(PostsService);
  private readonly dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private connectionService = inject(ConnectionsService);
  private toastService = inject(ToastService);
  connections = signal<User[] | undefined>(undefined);
  uid = input.required<string>();
  user = signal<User | undefined>(undefined);
  posts = signal<Post[] | undefined>(undefined);

  isUserOwnProfile = computed(
    () => this.authService.currentUserId() === this.uid()
  );
  isConnection = computed<boolean | undefined>(() => {
    let isFound = false;
    this.connections()?.forEach((user) => {
      if (user.id === this.authService.currentUserId()) {
        isFound = true;
        return;
      }
    });

    return isFound;
  });

  constructor() {
    effect((onCleanUp) => {
      const userSubs = this.userService.getUserById(this.uid()).subscribe({
        next: (userData) => {
          this.user.set(userData as User);
        },
      });

      const postsSubs = this.postsService
        .getUserSpecificPosts(this.uid())
        .subscribe({
          next: (posts) => {
            this.posts.set(posts as Post[]);
          },
        });

      const connectionsSub = this.connectionService
        .getUserConnections(this.uid())
        .subscribe({
          next: (users) => {
            this.connections.set(users);
          },
        });

      onCleanUp(() => {
        userSubs.unsubscribe();
        postsSubs.unsubscribe();
        connectionsSub.unsubscribe();
      });
    });
  }

  get userFullName() {
    return this.user()?.fName + ' ' + this.user()?.lName;
  }

  openCreatePostDialog() {
    this.dialog.open(CreatePostDialogComponent);
  }

  onSendConnectionRequest() {
    this.connectionService
      .sendConnectionRequest(this.authService.currentUserId()!, this.uid())
      .then(() => {
        this.toastService.toast$.next({
          message: 'Connection Request has been sent successfully. ✅',
          isError: false,
        });
      })
      .catch(() => {
        this.toastService.toast$.next({
          message: 'Error happened while sending the connection request!',
          isError: true,
        });
      });
  }

  onOpenConnections() {
    this.dialog.open(ConnectionsDialogComponent, {
      data: this.connections(),
    });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { UserService } from '../../user/user.service';
import { ConnectionsService } from '../../connections.service';
import type { User } from '../../user/user.model';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../../shared/toast-container/toast.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-friends',
  imports: [RouterLink],
  templateUrl: './new-friends.component.html',
  styleUrl: './new-friends.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewFriendsComponent implements OnInit {
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private connectionsService = inject(ConnectionsService);
  private allUsers = signal<User[] | undefined>(undefined);
  private friends = signal<User[] | undefined>(undefined);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  possibleNewFriends = signal<User[] | undefined>(undefined);

  constructor() {
    effect(() => {
      if (this.allUsers() && this.friends()) {
        const friendsIds = this.friends()?.map((user) => user.id);
        const friendsIdsSet = new Set(friendsIds);

        const nonFriends = this.allUsers()?.filter(
          (user) =>
            !friendsIdsSet.has(user.id) &&
            user.id !== this.authService.currentUserId()!
        );
        this.possibleNewFriends.set(nonFriends);
      }
    });
  }

  ngOnInit(): void {
    const usersSubs = this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers.set(users as User[]);
      },
    });
    const connectionsSubs = this.connectionsService
      .getAllConnections()
      .subscribe({
        next: (friends) => {
          this.friends.set(friends as User[]);
        },
      });

    this.destroyRef.onDestroy(() => {
      usersSubs.unsubscribe();
      connectionsSubs.unsubscribe();
    });
  }

  onSendConnection(toUserId: string) {
    this.connectionsService
      .sendConnectionRequest(this.authService.currentUserId()!, toUserId)
      .then(() => {
        this.toastService.toast$.next({
          message: 'Connection has been sent successfully. ✅',
          isError: false,
        });
      })
      .catch(() => {
        this.toastService.toast$.next({
          message: 'Error occured while sending the request!',
          isError: true,
        });
      });
  }
}

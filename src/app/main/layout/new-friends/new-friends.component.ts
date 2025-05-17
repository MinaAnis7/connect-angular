import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { UserService } from '../../user/user.service';
import { ConnectionsService } from '../../services/connections.service';
import type { User } from '../../user/user.model';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-new-friends',
  imports: [],
  templateUrl: './new-friends.component.html',
  styleUrl: './new-friends.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewFriendsComponent implements OnInit {
  private userService = inject(UserService);
  private connectionsService = inject(ConnectionsService);
  private allUsers = signal<User[] | undefined>(undefined);
  private friends = signal<User[] | undefined>(undefined);
  private authService = inject(AuthService);

  possibleNewFriends = computed<User[] | undefined>(() => {
    const friendsIds = this.friends()?.map((user) => user.id);
    const friendsIdsSet = new Set(friendsIds);

    return this.allUsers()?.filter(
      (user) =>
        !friendsIdsSet.has(user.id) &&
        user.id !== this.authService.currentUserId()!
    );
  });

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers.set(users as User[]);
      },
    });
    this.connectionsService.getAllConnections().subscribe({
      next: (friends) => {
        this.allUsers.set(friends as User[]);
      },
    });
  }
}

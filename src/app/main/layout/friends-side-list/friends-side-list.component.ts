import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { InputCtrlComponent } from '../../../shared/input-ctrl/input-ctrl.component';
import { ConnectionsService } from '../../connections.service';
import type { User } from '../../user/user.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-friends-side-list',
  imports: [InputCtrlComponent, FontAwesomeModule, RouterLink],
  templateUrl: './friends-side-list.component.html',
  styleUrl: './friends-side-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendsSideListComponent implements OnInit {
  private connectionsSerive = inject(ConnectionsService);
  private friendsData = signal<User[] | undefined>(undefined);
  private destroyRef = inject(DestroyRef);
  friends = signal<User[] | undefined>(undefined);

  constructor(library: FaIconLibrary) {
    library.addIcons(faMagnifyingGlass);
  }

  ngOnInit(): void {
    const connectionsSubs = this.connectionsSerive
      .getAllConnections()
      .subscribe({
        next: (friends) => {
          this.friendsData.set(friends);
          this.friends.set(friends);
        },
      });

    this.destroyRef.onDestroy(() => {
      connectionsSubs.unsubscribe();
    });
  }

  onValueChanges(value: string) {
    this.friends.set(this.friendsData());

    this.friends.update((friends) => {
      return friends?.filter((friend) =>
        (friend.fName + ' ' + friend.lName)
          .toLowerCase()
          .includes(value.toLocaleLowerCase())
      );
    });
  }
}

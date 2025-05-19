import {
  ChangeDetectionStrategy,
  Component,
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
import { ConnectionsService } from '../../services/connections.service';
import type { User } from '../../user/user.model';

@Component({
  selector: 'app-friends-side-list',
  imports: [InputCtrlComponent, FontAwesomeModule],
  templateUrl: './friends-side-list.component.html',
  styleUrl: './friends-side-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendsSideListComponent implements OnInit {
  private connectionsSerive = inject(ConnectionsService);
  private friendsData = signal<User[] | undefined>(undefined);
  friends = signal<User[] | undefined>(undefined);

  constructor(library: FaIconLibrary) {
    library.addIcons(faMagnifyingGlass);
  }

  ngOnInit(): void {
    this.connectionsSerive.getAllConnections().subscribe({
      next: (friends) => {
        this.friendsData.set(friends);
        this.friends.set(friends);
      },
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

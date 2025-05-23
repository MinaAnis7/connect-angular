import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ConnectionsService } from '../../connections.service';
import { User } from '../../user/user.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-friends',
  imports: [RouterLink],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css',
})
export class FriendsComponent implements OnInit {
  private connectionsService = inject(ConnectionsService);
  friends = signal<User[] | undefined>(undefined);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const connectionsSubs = this.connectionsService
      .getAllConnections()
      .subscribe({
        next: (friends) => {
          this.friends.set(friends);
        },
      });

    this.destroyRef.onDestroy(() => {
      connectionsSubs.unsubscribe();
    });
  }
}

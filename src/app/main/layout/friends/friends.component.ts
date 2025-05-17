import { Component, inject, OnInit, signal } from '@angular/core';
import { ConnectionsService } from '../../services/connections.service';
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

  ngOnInit(): void {
    this.connectionsService.getAllConnections().subscribe({
      next: (friends) => {
        this.friends.set(friends);
      },
    });
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { ConnectionsService } from '../services/connections.service';
import type { User } from '../user/user.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-chat',
  imports: [
    LoadingSpinnerComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
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

import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ConnectionsService } from '../connections.service';
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
  private destroyRef = inject(DestroyRef);
  friends = signal<User[] | undefined>(undefined);

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

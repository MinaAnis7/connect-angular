import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import type { User } from '../../user/user.model';
import { NotificationsService } from './notifications.service';

@Component({
  selector: 'app-notifications',
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
  host: {
    class: 'shadow',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent implements OnInit {
  @Output() friendRequestsReceived = new EventEmitter<void>();
  private notificationsService = inject(NotificationsService);
  isFriendRequest = input.required<boolean>();
  friendRequests = signal<{ id: string; from: User }[] | undefined>(undefined);

  ngOnInit(): void {
    this.notificationsService.getFriendRequests().then((reqs) => {
      this.friendRequests.set(reqs);

      if (reqs.length > 0) {
        this.friendRequestsReceived.emit();
      }
    });
  }
}

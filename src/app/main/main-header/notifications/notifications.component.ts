import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import type { User } from '../../user/user.model';
import { ConnectionsService } from '../../services/connections.service';
import { ToastService } from '../../../shared/toast-container/toast.service';

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
export class NotificationsComponent {
  private connectionsService = inject(ConnectionsService);
  private toastService = inject(ToastService);
  isFriendRequest = input.required<boolean>();
  friendRequests = input.required<
    { id: string; from: User; userId: string }[] | undefined
  >();

  onAcceptRequest(fromId: string, notificationId: string) {
    this.connectionsService
      .acceptConnectionRequest(fromId, notificationId)
      .then(() => {
        this.toastService.toast$.next({
          message: 'Request has been accepted successfully',
          isError: false,
        });
      })
      .catch(() => {
        this.toastService.toast$.next({
          message: 'Error happened while accepting the request',
          isError: true,
        });
      });
  }
}

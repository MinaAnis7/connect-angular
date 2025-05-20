import { Component, effect, inject, input, signal } from '@angular/core';
import type { User } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { FormsModule } from '@angular/forms';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-chat',
  imports: [FormsModule, FontAwesomeModule],
  templateUrl: './user-chat.component.html',
  styleUrl: './user-chat.component.css',
})
export class UserChatComponent {
  private userService = inject(UserService);
  uid = input.required<string>();
  user = signal<User | undefined>(undefined);

  constructor(library: FaIconLibrary) {
    library.addIcons(faPaperPlane);

    effect((onCleanUp) => {
      const userSubs = this.userService.getUserById(this.uid()).subscribe({
        next: (user) => {
          this.user.set(user as User);
        },
      });

      onCleanUp(() => {
        userSubs.unsubscribe();
      });
    });
  }
}

import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import type { User } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { FormsModule } from '@angular/forms';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { ChatService } from '../chat.service';
import { Message } from '../message.model';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-user-chat',
  imports: [FormsModule, FontAwesomeModule, LoadingSpinnerComponent],
  templateUrl: './user-chat.component.html',
  styleUrl: './user-chat.component.css',
})
export class UserChatComponent {
  @ViewChild('msgsContainer') messagesContainer!: ElementRef<HTMLDivElement>;
  private userService = inject(UserService);
  private chatService = inject(ChatService);
  private firstRender = true;
  uid = input.required<string>();
  user = signal<User | undefined>(undefined);
  chat = signal<Message[] | undefined>(undefined);

  constructor(library: FaIconLibrary) {
    library.addIcons(faPaperPlane);

    effect((onCleanUp) => {
      const userSubs = this.userService.getUserById(this.uid()).subscribe({
        next: (user) => {
          this.user.set(user as User);
        },
      });

      const chatSubs = this.chatService.getChat(this.uid()).subscribe({
        next: (chat) => {
          this.chat.set(chat);

          if (this.firstRender || chat[0]?.id !== this.uid()) {
            requestAnimationFrame(() => {
              this.messagesContainer.nativeElement.scrollTo({
                behavior: 'instant',
                top: this.messagesContainer.nativeElement.scrollHeight,
              });

              this.firstRender = false;
            });
          }
        },
      });

      onCleanUp(() => {
        userSubs.unsubscribe();
        chatSubs.unsubscribe();
      });
    });
  }

  onSubmit(msgCtrl: HTMLInputElement) {
    this.chatService.sendMessage(this.uid(), msgCtrl.value);
    msgCtrl.value = '';
  }
}

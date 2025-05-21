import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
  faBell,
  faCommentDots,
  faUser,
  faUserCircle,
} from '@fortawesome/free-regular-svg-icons';

import {
  faMagnifyingGlass,
  faSliders,
  faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import type { User } from '../user/user.model';
import { LogoComponent } from '../../shared/logo/logo.component';
import { InputCtrlComponent } from '../../shared/input-ctrl/input-ctrl.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationsService } from './notifications/notifications.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-main-header',
  imports: [
    LogoComponent,
    FontAwesomeModule,
    NgbDropdownModule,
    MatIconModule,
    InputCtrlComponent,
    RouterLink,
    NotificationsComponent,
  ],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.css',
})
export class MainHeaderComponent implements OnInit {
  private store = inject(Store);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private notificationsService = inject(NotificationsService);
  private destroyRef = inject(DestroyRef);
  private eRef = inject(ElementRef);
  allUsers = signal<User[] | undefined>(undefined);
  usersData = signal<User[] | undefined>(undefined);
  newfriendReqsNum = signal<number | undefined>(undefined);
  newNotifNum = signal<number | undefined>(undefined);
  friendReqs = signal<{ id: string; from: User; userId: string }[] | undefined>(
    undefined
  );
  notifications = signal<
    { id: string; from: User; type: string }[] | undefined
  >(undefined);
  hasOpenedFriendReqNotifications = false;
  hasOpenedNotifications = false;
  isSearching = false;
  currectId = computed(() => this.authService.currentUserId());
  currentUser?: User;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const clickedInsideSearchArea =
      target.closest('.search-results') || target.closest('.search-wrapper');

    if (!clickedInsideSearchArea) {
      this.isSearching = false;
    }
  }

  constructor(library: FaIconLibrary) {
    library.addIcons(
      faBell,
      faCommentDots,
      faUser,
      faMagnifyingGlass,
      faUserCircle,
      faSliders,
      faArrowRightFromBracket
    );
  }

  ngOnInit(): void {
    const currentUserSubs = this.store.select('currentUser').subscribe({
      next: (user) => {
        this.currentUser = user;
      },
    });

    const friendReqsSubs = this.notificationsService
      .getFriendRequests()
      .subscribe({
        next: (reqs) => {
          this.friendReqs.set(reqs);
          this.newfriendReqsNum.set(reqs.length);
        },
      });

    const notifSubs = this.notificationsService.getNotifications().subscribe({
      next: (notifs) => {
        this.notifications.set(notifs);
        this.newNotifNum.set(notifs.length);
      },
    });

    const allUserSubs = this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers.set(users as User[]);
        this.usersData.set(users as User[]);
      },
    });

    this.destroyRef.onDestroy(() => {
      currentUserSubs.unsubscribe();
      friendReqsSubs.unsubscribe();
      notifSubs.unsubscribe();
      allUserSubs.unsubscribe();
    });
  }

  onLogout() {
    this.authService.logout();
  }

  onToggleFriendReqNotifications() {
    this.hasOpenedNotifications = false;
    this.hasOpenedFriendReqNotifications =
      !this.hasOpenedFriendReqNotifications;
  }

  onToggleNotifications() {
    this.hasOpenedFriendReqNotifications = false;
    this.hasOpenedNotifications = !this.hasOpenedNotifications;
  }

  showSearchResults() {
    this.isSearching = !this.isSearching;
  }

  onFocusChanges(state: boolean) {
    this.isSearching = state;
  }

  onSearch(value: string) {
    this.allUsers.set(this.usersData());

    this.allUsers.update((users) => {
      return users?.filter((users) =>
        (users.fName + ' ' + users.lName)
          .toLowerCase()
          .includes(value.toLocaleLowerCase())
      );
    });
  }
}

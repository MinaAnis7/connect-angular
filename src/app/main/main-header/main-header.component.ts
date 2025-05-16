import { Component, computed, inject, OnInit } from '@angular/core';
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
import { User } from '../user/user.model';
import { LogoComponent } from '../../shared/logo/logo.component';
import { InputCtrlComponent } from '../../shared/input-ctrl/input-ctrl.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { NotificationsComponent } from './notifications/notifications.component';

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
  private authService = inject(AuthService);
  newFriendRequests = false;
  hasOpenedFriendReqNotifications = false;
  hasOpenedNotifications = false;
  currectId = computed(() => this.authService.currentUserId());
  currentUser?: User;

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
    this.store.select('currentUser').subscribe({
      next: (user) => {
        this.currentUser = user;
      },
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

  onNewFriendRequests() {
    this.newFriendRequests = true;
  }
}

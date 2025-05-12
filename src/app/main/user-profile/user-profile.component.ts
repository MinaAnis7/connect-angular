import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import type { User } from '../user/user.model';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  private store = inject(Store);
  user?: User;

  ngOnInit(): void {
    this.store.select('currentUser').subscribe({
      next: (user) => {
        this.user = user;
      },
    });
  }

  get userFullName() {
    return this.user?.fName + ' ' + this.user?.lName;
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import type { User } from '../user/user.model';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-profile',
  imports: [FontAwesomeModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent implements OnInit {
  private store = inject(Store);
  user = signal<User | undefined>(undefined);

  constructor(library: FaIconLibrary) {
    library.addIcons(faPencil);
  }

  ngOnInit(): void {
    this.store.select('currentUser').subscribe({
      next: (user) => {
        this.user.set(user);
      },
    });
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faXmark, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import type { User } from '../../user/user.model';

@Component({
  selector: 'app-comments-dialog',
  imports: [MatDialogModule, FontAwesomeModule],
  templateUrl: './comments-dialog.component.html',
  styleUrl: './comments-dialog.component.css',
})
export class CommentsDialogComponent implements OnInit {
  private store = inject(Store);
  currentUser = signal<User | undefined>(undefined);

  constructor(library: FaIconLibrary) {
    library.addIcons(faXmark, faPaperPlane);
  }

  ngOnInit(): void {
    this.store.select('currentUser').subscribe({
      next: (user) => {
        this.currentUser.set(user as User);
      },
    });
  }
}

import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../user/user.model';

@Component({
  selector: 'app-connections-dialog',
  imports: [MatDialogModule, FontAwesomeModule],
  templateUrl: './connections-dialog.component.html',
  styleUrl: './connections-dialog.component.css',
})
export class ConnectionsDialogComponent {
  users = inject<User[]>(MAT_DIALOG_DATA);

  constructor(library: FaIconLibrary) {
    library.addIcons(faXmark);
  }
}

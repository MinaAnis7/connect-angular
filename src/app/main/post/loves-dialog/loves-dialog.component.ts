import { Component, inject, signal, Signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.model';

@Component({
  selector: 'app-loves-dialog',
  imports: [MatDialogModule, FontAwesomeModule],
  templateUrl: './loves-dialog.component.html',
  styleUrl: './loves-dialog.component.css',
})
export class LovesDialogComponent {
  private lovesIds = inject<Signal<string[]>>(MAT_DIALOG_DATA);
  private userService = inject(UserService);
  loves = signal<User[] | undefined>(undefined);

  constructor(library: FaIconLibrary) {
    library.addIcons(faXmark);

    this.userService.getUsersFromIdList(this.lovesIds()).then((users) => {
      this.loves.set(users);
    });
  }
}

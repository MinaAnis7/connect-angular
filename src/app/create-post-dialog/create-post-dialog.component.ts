import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-post-dialog',
  imports: [MatDialogModule, FontAwesomeModule],
  templateUrl: './create-post-dialog.component.html',
  styleUrl: './create-post-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePostDialogComponent {
  uploadedImg = signal(true);

  constructor(library: FaIconLibrary) {
    library.addIcons(faXmark, faImage);
  }
}

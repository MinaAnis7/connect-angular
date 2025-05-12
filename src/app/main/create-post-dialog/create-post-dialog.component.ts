import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { PostsService } from '../post/posts.service';

@Component({
  selector: 'app-create-post-dialog',
  imports: [MatDialogModule, FontAwesomeModule],
  templateUrl: './create-post-dialog.component.html',
  styleUrl: './create-post-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePostDialogComponent {
  @ViewChild('imageSelector') imageSelector!: ElementRef<HTMLInputElement>;
  uploadedImg = signal<string | ArrayBuffer | null>(null);
  selectedImage: File | null = null;
  private postService = inject(PostsService);
  private dialogRef = inject(MatDialogRef<CreatePostDialogComponent>);

  constructor(library: FaIconLibrary) {
    library.addIcons(faXmark, faImage);
  }

  onImageSelected() {
    const files = this.imageSelector.nativeElement.files;

    if (files && files.length > 0) {
      const fileReader = new FileReader();
      this.selectedImage = files[0];

      fileReader.onload = () => {
        this.uploadedImg.set(fileReader.result);
      };

      fileReader.readAsDataURL(this.selectedImage);
    }
  }

  onCreatePost(postText: string) {
    if (postText.length === 0 && !this.selectedImage) return;

    this.postService.createNewPost(postText, this.selectedImage);
    this.dialogRef.close();
  }
}

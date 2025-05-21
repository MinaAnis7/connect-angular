import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import type { User } from '../user/user.model';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { EditProfileService } from './edit-profile.service';
import { ToastService } from '../../shared/toast-container/toast.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { updateCurrentUser } from '../../store/user.actions';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  imports: [FontAwesomeModule, LoadingSpinnerComponent, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent implements OnInit {
  @ViewChild('profileSelector') profileSelector!: ElementRef<HTMLInputElement>;
  @ViewChild('coverSelector') coverSelector!: ElementRef<HTMLInputElement>;
  private store = inject(Store);
  private editProfileService = inject(EditProfileService);
  private toastSerivce = inject(ToastService);
  uploadedProfileImg = signal<string | ArrayBuffer | null>(null);
  selectedProfileImage: File | null = null;
  uploadedCoverImg = signal<string | ArrayBuffer | null>(null);
  selectedCoverImage: File | null = null;
  user = signal<User | undefined>(undefined);
  info = {
    fName: '',
    lName: '',
    bio: '',
  };
  isLoading = false;

  constructor(library: FaIconLibrary) {
    library.addIcons(faPencil);
  }

  ngOnInit(): void {
    this.store.select('currentUser').subscribe({
      next: (user) => {
        this.user.set(user);
        this.info = {
          fName: user?.fName,
          lName: user?.lName,
          bio: user?.bio,
        };
      },
    });
  }

  onProfileImgSelected() {
    const files = this.profileSelector.nativeElement.files;

    if (files && files.length > 0) {
      const fileReader = new FileReader();
      this.selectedProfileImage = files[0];

      fileReader.onload = () => {
        this.uploadedProfileImg.set(fileReader.result);
      };

      fileReader.readAsDataURL(this.selectedProfileImage);
    }
  }

  onCoverImgSelected() {
    const files = this.coverSelector.nativeElement.files;

    if (files && files.length > 0) {
      const fileReader = new FileReader();
      this.selectedCoverImage = files[0];

      fileReader.onload = () => {
        this.uploadedCoverImg.set(fileReader.result);
      };

      fileReader.readAsDataURL(this.selectedCoverImage);
    }
  }

  onUpdateImgs() {
    this.isLoading = true;
    this.editProfileService
      .uploadProfileImages(this.selectedProfileImage, this.selectedCoverImage)
      .then((data) => {
        this.toastSerivce.toast$.next({
          message: 'Uploaded Successfully! ✅',
          isError: false,
        });

        this.store.dispatch(updateCurrentUser({ data: data! }));
      })
      .catch(() => {
        this.toastSerivce.toast$.next({
          message: 'Error happened while uploading',
          isError: true,
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.editProfileService
      .updateInfo(this.info)
      .then(() => {
        this.toastSerivce.toast$.next({
          message: 'Updated Successfully! ✅',
          isError: false,
        });
      })
      .catch(() => {
        this.toastSerivce.toast$.next({
          message: 'Error happened while updating info.',
          isError: true,
        });
      });
  }
}

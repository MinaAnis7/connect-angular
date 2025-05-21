import { inject, Injectable } from '@angular/core';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { ToastService } from '../../shared/toast-container/toast.service';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class EditProfileService {
  private db = inject(Firestore);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  async uploadProfileImages(profileImg: File | null, coverImg: File | null) {
    const userDoc = doc(this.db, 'users', this.authService.currentUserId()!);
    let coverUrl, profileUrl;
    let data;

    if (profileImg && coverImg) {
      profileUrl = await this.uploadImage(profileImg);
      coverUrl = await this.uploadImage(coverImg);
      data = {
        profileImage: profileUrl,
        cover: coverUrl,
      };
    } else if (profileImg) {
      profileUrl = await this.uploadImage(profileImg);
      data = {
        profileImage: profileUrl,
      };
    } else if (coverImg) {
      coverUrl = await this.uploadImage(coverImg);
      data = {
        cover: coverUrl,
      };
    }

    return await updateDoc(userDoc, data!);
  }

  private async uploadImage(Img: File) {
    const formData = new FormData();

    formData.append('file', Img);
    formData.append('upload_preset', 'unsigned_preset');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dnhvn7s3i/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      return data.secure_url;
    } catch (error) {
      this.toastService.toast$.next({
        message: 'Error occured while uploading cover image.',
        isError: true,
      });
    }
  }
}

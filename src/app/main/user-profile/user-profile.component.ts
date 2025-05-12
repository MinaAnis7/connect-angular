import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import type { User } from '../user/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreatePostDialogComponent } from '../create-post-dialog/create-post-dialog.component';
import { Post } from '../post/post.model';
import { doc } from '@firebase/firestore';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-user-profile',
  imports: [MatIconModule, MatDialogModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  private store = inject(Store);
  private readonly dialog = inject(MatDialog);
  user?: User;
  post?: Post;

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

  openCreatePostDialog() {
    this.dialog.open(CreatePostDialogComponent);
  }
}

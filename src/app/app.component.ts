import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { ToastContainerComponent } from './shared/toast-container/toast-container.component';
import { CloudinaryModule } from '@cloudinary/ng/dist';
import { UserService } from './main/user/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent, CloudinaryModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}

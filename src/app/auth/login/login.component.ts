import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LogoComponent } from '../../shared/logo/logo.component';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { AuthCtrlComponent } from '../../shared/auth-ctrl/auth-ctrl.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { ToastContainerComponent } from '../../shared/toast-container/toast-container.component';
import { ToastService } from '../../shared/toast-container/toast.service';

@Component({
  selector: 'app-login',
  imports: [
    LogoComponent,
    ReactiveFormsModule,
    FontAwesomeModule,
    AuthCtrlComponent,
    RouterLink,
    LoadingSpinnerComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  passwordVisible = false;
  isLoading = signal(false);

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  constructor(library: FaIconLibrary) {
    library.addIcons(faEye, faEyeSlash);
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  checkErrors(field: FormControl) {
    return field.touched && field.invalid;
  }

  showEmailError() {
    const emailCtrl = this.form.controls.email;
    if (emailCtrl.errors) {
      if (emailCtrl.errors['required']) return 'This field is required!';
      else if (emailCtrl.errors['email']) return 'Please, enter a valid email.';
    }
    return '';
  }

  showPasswordError() {
    const passwordCtrl = this.form.controls.password;

    if (passwordCtrl.errors) {
      if (passwordCtrl.errors['required']) return 'This field is required!';
      else if (passwordCtrl.errors['minlength'])
        return 'Please, enter at least 8 characters';
    }
    return '';
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService
      .login(
        this.form.controls.email.value!,
        this.form.controls.password.value!
      )
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error: Error) => {
          this.toastService.toast$.next({
            message: error.message,
            isError: true,
          });
          this.isLoading.set(false);
        },
        complete: () => {
          this.router.navigate(['newsfeed']);
          this.isLoading.set(false);
        },
      });

    this.form.reset();
  }
}

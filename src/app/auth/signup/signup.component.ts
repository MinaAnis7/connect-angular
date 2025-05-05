import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { AuthCtrlComponent } from '../../shared/auth-ctrl/auth-ctrl.component';
import { LogoComponent } from '../../shared/logo/logo.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { ToastService } from '../../shared/toast-container/toast.service';

function checkPasswordsEquality(ctrl: AbstractControl) {
  const password = ctrl.get('password')?.value;
  const confirmPassword = ctrl.get('confirmPassword')?.value;

  if (password === confirmPassword) return null;

  return {
    notEqual: true,
  };
}

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
    AuthCtrlComponent,
    LogoComponent,
    RouterLink,
    LoadingSpinnerComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  passwordVisible = false;
  confirmPasswordVisible = false;
  isLoading = signal(false);

  form = new FormGroup({
    fName: new FormControl('', {
      validators: [Validators.required],
    }),
    lName: new FormControl('', {
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
        }),
        confirmPassword: new FormControl('', {
          validators: [Validators.required],
        }),
      },
      { validators: [checkPasswordsEquality] }
    ),
  });

  constructor(library: FaIconLibrary) {
    library.addIcons(faEye, faEyeSlash);
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  nameHasErrors() {
    const fName = this.form.controls.fName;
    const lName = this.form.controls.lName;

    return (fName.touched && fName.invalid) || (lName.touched && lName.invalid);
  }

  checkErrors(formField: FormControl) {
    return formField.touched && formField.invalid;
  }

  checkConfirmPasswordErrors() {
    const confPass = this.form.controls.passwords.controls.confirmPassword;

    return (
      (confPass.dirty || confPass.touched) &&
      (confPass.invalid || this.form.controls.passwords.errors)
    );
  }

  passwordsMatch() {
    const confPass = this.form.controls.passwords.controls.confirmPassword;

    return (
      confPass.dirty && confPass.valid && this.form.controls.passwords.valid
    );
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
    const passwordCtrl = this.form.controls.passwords.controls.password;

    if (passwordCtrl.errors) {
      if (passwordCtrl.errors['required']) return 'This field is required!';
      else if (passwordCtrl.errors['pattern'])
        return 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g. @, $, !, %, , ?, &).';
    }
    return '';
  }

  showConfirmPasswordError() {
    const passwordCtrl = this.form.controls.passwords.controls.confirmPassword;
    const passwordsCtrl = this.form.controls.passwords;

    if (passwordCtrl.errors && passwordCtrl.errors['required'])
      return 'This field is required!';
    else if (passwordsCtrl.errors && passwordsCtrl.errors['notEqual'])
      return "Passwords don't match!";

    return '';
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService
      .signup(
        this.form.controls.email.value!,
        this.form.controls.passwords.controls.password.value!
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
          this.router.navigate(['app']);
          this.isLoading.set(false);
        },
      });

    this.form.reset();
  }
}

import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { UserService } from '../main/user/user.service';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private injectionContext = inject(EnvironmentInjector);
  private userService = inject(UserService);
  private router = inject(Router);
  currentUserId = signal<string | null | undefined>(undefined);

  constructor() {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this.currentUserId.set(user.uid);
        this.userService.getLoggedInUser(user.uid);
      } else {
        this.currentUserId.set(null);
      }
    });
  }

  signup(email: string, password: string, formValues: any) {
    return runInInjectionContext(this.injectionContext, () => {
      return createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          this.saveUserToFirestore(formValues, userCredential.user.uid);
        })
        .catch(this.handleError);
    });
  }

  login(email: string, password: string) {
    return runInInjectionContext(this.injectionContext, () => {
      return signInWithEmailAndPassword(this.auth, email, password).catch(
        this.handleError
      );
    });
  }

  logout() {
    runInInjectionContext(this.injectionContext, () => {
      signOut(this.auth).then(() => {
        this.router.navigate(['/auth']);
      });
    });
  }

  private saveUserToFirestore(formValues: any, id: string) {
    this.userService.storeNewUser(
      {
        fName: formValues.fName!,
        lName: formValues.lName!,
        bio: 'Hi There! 👋🏻',
        profileImage:
          'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png',
        cover:
          'https://www.suicidecallbackservice.org.au/wp-content/uploads/2018/03/Nature-as-a-healer-header-1600x1067.jpg',
      },
      id
    );
  }

  private handleError(error: any) {
    let message = 'An unknown error occurred!';
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'This email address is already in use.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many requests. Try again later.';
          break;
        case 'auth/invalid-credential':
          message = 'Invalid email or password.';
          break;
        case 'auth/user-disabled':
          message = 'This user account has been disabled.';
          break;
      }
    }
    throw new Error(message);
  }
}

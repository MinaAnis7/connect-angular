import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideStore } from '@ngrx/store';
import { userReducer } from './store/user.reducer';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'connect-angular-34177',
        appId: '1:239537143789:web:dc61f4d079ab700eb931e4',
        storageBucket: 'connect-angular-34177.firebasestorage.app',
        apiKey: 'AIzaSyCLhIq5-sFP3PUsq8D86E7UaezAolHq1XQ',
        authDomain: 'connect-angular-34177.firebaseapp.com',
        messagingSenderId: '239537143789',
        measurementId: 'G-KSWLL2R8DE',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStore({ currentUser: userReducer }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};

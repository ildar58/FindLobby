import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import ApplicationVerifier = firebase.auth.ApplicationVerifier;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: firebase.User | null = null;

  constructor(private readonly afAuth: AngularFireAuth) {
    this.afAuth.onAuthStateChanged(user => {
      console.log('Changed: ', user);
      this.currentUser = user;
    });
  }

  public signIn(
    phoneNumber: string,
    applicationVerifier: ApplicationVerifier
  ): ReturnType<firebase.auth.Auth['signInWithPhoneNumber']> {
    return this.afAuth.signInWithPhoneNumber(phoneNumber, applicationVerifier);
  }

  public signOut(): void {
    this.afAuth.signOut();
  }
}

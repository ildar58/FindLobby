import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import RecaptchaVerifier = firebase.auth.RecaptchaVerifier;

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private confirmationResult!: firebase.auth.ConfirmationResult;
    private currentUser: firebase.User | null = null;

    constructor(private readonly afAuth: AngularFireAuth) {
        this.afAuth.onAuthStateChanged(user => {
            console.log('Changed: ', user);
            this.currentUser = user;
        });
    }

    public signInWithPhoneNumber(
        recaptchaVerifier: RecaptchaVerifier,
        phoneNumber: string
    ) {
        return new Promise<any>((resolve, reject) => {
            this.afAuth
                .signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
                .then(confirmationResult => {
                    this.confirmationResult = confirmationResult;
                    resolve(confirmationResult);
                })
                .catch(error => {
                    console.log(error);
                    reject('SMS not sent');
                });
        });
    }
    public async enterVerificationCode(code: string) {
        if (this.confirmationResult) {
            return new Promise<any>((resolve, reject) => {
                this.confirmationResult
                    .confirm(code)
                    .then(async result => {
                        console.log(result);
                        const user = result.user;
                        resolve(user);
                    })
                    .catch(error => {
                        reject(error.message);
                    });
            });
        }
    }

    public signOut(): void {
        this.afAuth.signOut();
    }
}

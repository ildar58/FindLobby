import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import RecaptchaVerifier = firebase.auth.RecaptchaVerifier;
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private confirmationResult!: firebase.auth.ConfirmationResult;
    private currentUser: firebase.User | null = null;

    constructor(
        private readonly _afAuth: AngularFireAuth,
        private readonly _router: Router
    ) {
        this._afAuth.onAuthStateChanged(user => {
            this.currentUser = user;
        });
    }

    public signInWithPhoneNumber(
        recaptchaVerifier: RecaptchaVerifier,
        phoneNumber: string
    ) {
        return new Promise<any>((resolve, reject) => {
            this._afAuth
                .signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
                .then(confirmationResult => {
                    this.confirmationResult = confirmationResult;
                    resolve(confirmationResult);
                })
                .catch(() => {
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
                        const user = result.user;
                        resolve(user);
                    })
                    .catch(error => {
                        reject(error.message);
                    });
            });
        }
    }

    async signOut(): Promise<any> {
        await this._afAuth.signOut();
        this._router.navigate(['/']);
    }
}

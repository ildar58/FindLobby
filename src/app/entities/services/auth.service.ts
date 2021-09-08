import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import RecaptchaVerifier = firebase.auth.RecaptchaVerifier;
import {Router} from '@angular/router';
import {of} from 'rxjs';
import ConfirmationResult = firebase.auth.ConfirmationResult;
import {UserService} from './user.service';
import auth = firebase.auth;
import User = firebase.User;

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _confirmationResult!: firebase.auth.ConfirmationResult;
    private _verificationId = '';
    private _cachedPhoneNumber = '';

    constructor(
        private readonly _afAuth: AngularFireAuth,
        private readonly _router: Router,
        private readonly _userService: UserService
    ) {}

    signInWithPhoneNumber(
        recaptchaVerifier: RecaptchaVerifier,
        phoneNumber?: string
    ) {
        this._cachedPhoneNumber = phoneNumber
            ? phoneNumber
            : this._cachedPhoneNumber;

        return new Promise<ConfirmationResult>((resolve, reject) => {
            this._afAuth
                .signInWithPhoneNumber(
                    this._cachedPhoneNumber,
                    recaptchaVerifier
                )
                .then(confirmationResult => {
                    this._confirmationResult = confirmationResult;
                    resolve(confirmationResult);
                })
                .catch(() => {
                    reject('Не удалось отправить SMS');
                });
        });
    }

    enterVerificationCode(code: string) {
        if (this._confirmationResult) {
            return new Promise((resolve, reject) => {
                return this._confirmationResult
                    .confirm(code)
                    .then(async credential => {
                        this._cachedPhoneNumber = '';
                        const user = credential.user;
                        await this.createUserInDb(user as firebase.User);
                        resolve(user);
                    })
                    .catch(error => {
                        reject(error.message);
                    });
            });
        } else {
            return of(null).toPromise();
        }
    }

    async updatePhoneNumber(
        recaptchaVerifier: RecaptchaVerifier,
        phoneNumber?: string
    ) {
        const provider = new auth.PhoneAuthProvider();
        this._cachedPhoneNumber = phoneNumber
            ? phoneNumber
            : this._cachedPhoneNumber;

        return provider
            .verifyPhoneNumber(this._cachedPhoneNumber, recaptchaVerifier)
            .then(verificationId => (this._verificationId = verificationId));
    }

    verifyPhoneNumber(code: string) {
        const phoneCredential = auth.PhoneAuthProvider.credential(
            this._verificationId,
            code
        );

        return (<User>auth().currentUser)
            .updatePhoneNumber(phoneCredential)
            .then(data => {
                const uid = auth().currentUser?.uid as string;
                // TODO перенести в Cloud Functions
                this._userService.updateUserData(uid, {
                    phoneNumber: this._cachedPhoneNumber,
                });
                this._cachedPhoneNumber = '';
                return data;
            });
    }

    private async createUserInDb(user: firebase.User) {
        const isExist = await this._userService.userExist(user.uid);

        if (!isExist) {
            return await this._userService.createUser(user.uid);
        } else {
            return of(null);
        }
    }

    async signOut() {
        this._userService.unsubscribe();
        await this._afAuth.signOut();
        this._router.navigateByUrl('/login');
    }
}

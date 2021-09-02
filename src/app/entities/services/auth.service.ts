import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import RecaptchaVerifier = firebase.auth.RecaptchaVerifier;
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {BehaviorSubject, from, Observable, of, Subject} from 'rxjs';
import {map, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import ConfirmationResult = firebase.auth.ConfirmationResult;
import {IUser} from '../interfaces/user.interface';
import auth = firebase.auth;
import User = firebase.User;

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    user: Observable<any> | undefined;
    _currentUser: BehaviorSubject<User | null> =
        new BehaviorSubject<User | null>(null);
    private _confirmationResult!: firebase.auth.ConfirmationResult;
    unsubscribe: Subject<void> = new Subject<void>();

    constructor(
        private readonly _afAuth: AngularFireAuth,
        private readonly _router: Router,
        private readonly _db: AngularFirestore,
        private readonly _storage: AngularFireStorage
    ) {
        this._afAuth.onAuthStateChanged(user => {
            this.user = this._afAuth.authState.pipe(
                switchMap(user => {
                    if (user) {
                        return this._db
                            .doc<User>(`users/${user.uid}`)
                            .valueChanges()
                            .pipe(
                                take(1),
                                tap(data => {
                                    if (data) {
                                        this._currentUser.next(data);
                                    }
                                })
                            );
                    } else {
                        this._currentUser.next(null);
                        return of(null);
                    }
                })
            );
        });
    }

    signInWithPhoneNumber(
        recaptchaVerifier: RecaptchaVerifier,
        phoneNumber: string
    ) {
        return new Promise<ConfirmationResult>((resolve, reject) => {
            this._afAuth
                .signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
                .then(confirmationResult => {
                    this._confirmationResult = confirmationResult;
                    resolve(confirmationResult);
                })
                .catch(() => {
                    reject('Не удалось отправить SMS');
                });
        });
    }
    public async enterVerificationCode(
        code: string
    ): Promise<firebase.User | null | void> {
        if (this._confirmationResult) {
            return new Promise<firebase.User | null | void>(
                (resolve, reject) => {
                    return this._confirmationResult
                        .confirm(code)
                        .then(async credential => {
                            const user = credential.user;
                            await this.createUserInDb(user as firebase.User);
                            resolve(user);
                        })
                        .catch(error => {
                            reject(error.message);
                        });
                }
            );
        }
    }

    private async createUserInDb(user: firebase.User) {
        const isExist = await this._db
            .doc(`users/${user.uid}`)
            .get()
            .pipe(map(d => d.exists));

        if (!isExist) {
            return this._db.doc(`users/${user?.uid}`).set({
                created: firebase.firestore.FieldValue.serverTimestamp(),
            });
        } else {
            return of(null);
        }
    }

    async signOut() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        await this._afAuth.signOut();
        this._router.navigate(['/']);
    }

    getUserId() {
        return auth()?.currentUser?.uid as string;
    }

    getUserData() {
        return this._db
            .doc<IUser>(`users/${this.getUserId()}`)
            .valueChanges()
            .pipe(takeUntil(this.unsubscribe));
    }

    uploadAvatar(base64String: string) {
        const filePath = `${this.getUserId()}/avatar`;
        const fileRef = this._storage.ref(filePath);
        const task: AngularFireUploadTask = fileRef.putString(
            base64String,
            'base64',
            {contentType: 'image/png'}
        );

        return from(task).pipe(
            switchMap(result => {
                // Upload Task finished, get URL to the image
                return fileRef.getDownloadURL();
            }),
            switchMap(photoURL => {
                // Set the URL to the user document
                const uploadPromise = this._db
                    .doc(`users/${this.getUserId()}`)
                    .set({photoURL}, {merge: true});
                return from(uploadPromise);
            }),
            takeUntil(this.unsubscribe)
        );
    }

    public checkLogin(login: string) {
        return from(
            this._db
                .collection('users')
                .ref.where('login', '==', login)
                .get()
                .then(d => !!d.docs[0])
        );
    }
}

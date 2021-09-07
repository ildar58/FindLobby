import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {IUser} from '../interfaces/user.interface';
import {map, switchMap, takeUntil} from 'rxjs/operators';
import firebase from 'firebase';
import {from, Subject} from 'rxjs';
import auth = firebase.auth;
import User = firebase.User;

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private _unsubscribe: Subject<void> = new Subject<void>();

    constructor(
        private readonly _db: AngularFirestore,
        private readonly _storage: AngularFireStorage
    ) {}

    getUser(uid: string) {
        return this._db.doc<IUser>(`users/${uid}`);
    }

    getUserData() {
        const uid = auth()?.currentUser?.uid as string;

        return this.getUser(uid)
            .valueChanges()
            .pipe(
                map(data => {
                    if (data) {
                        data.uid = uid;
                    }
                    return data;
                }),
                takeUntil(this._unsubscribe)
            );
    }

    userExist(uid: string) {
        return this.getUser(uid)
            .get()
            .pipe(map(u => u.exists))
            .toPromise();
    }

    userHasLogin() {
        const uid = auth()?.currentUser?.uid as string;

        return this.getUser(uid)
            .get()
            .pipe(
                map(u => {
                    return !!u.data()?.login;
                })
            );
    }

    createUser(uid: string) {
        return this.getUser(uid).set({
            uid,
            phoneNumber: (<User>auth().currentUser).phoneNumber as string,
            created: firebase.firestore.FieldValue.serverTimestamp(),
        });
    }

    updateUserData(uid: string, data: IUser) {
        return this.getUser(uid).set(
            {
                ...data,
            },
            {merge: true}
        );
    }

    loginAvailable(login: string) {
        return this._db
            .collection<IUser[]>('users', ref =>
                ref.where('login', '==', login)
            )
            .get()
            .toPromise()
            .then(u => u.size === 0);
    }

    uploadAvatar(base64String: string) {
        const uid = auth()?.currentUser?.uid as string;
        const filePath = `${uid}/avatar`;
        const fileRef = this._storage.ref(filePath);
        const task: AngularFireUploadTask = fileRef.putString(
            base64String,
            'base64',
            {contentType: 'image/png'}
        );

        return from(task).pipe(
            switchMap(() => {
                // Upload Task finished, get URL to the image
                return fileRef.getDownloadURL();
            }),
            switchMap(photoUrl => {
                // Set the URL to the user document
                const uploadPromise = this.updateUserData(uid, {photoUrl});
                return from(uploadPromise);
            }),
            takeUntil(this._unsubscribe)
        );
    }

    unsubscribe(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }
}

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
    // Отписка при разрушении сервиса
    private _unsubscribe: Subject<void> = new Subject<void>();

    constructor(
        private readonly _db: AngularFirestore,
        private readonly _storage: AngularFireStorage
    ) {}

    /**
     * Получение FireBase entity пользователя
     * @param {string} uid - уникальный идентификатор пользователя
     * @return AngularFirestoreDocument<IUser>
     */
    getUser(uid: string) {
        return this._db.doc<IUser>(`users/${uid}`);
    }

    /**
     * Получение данных о текущем пользователе в realTime
     * @return Observable<IUser>
     */
    getUserData() {
        const uid = auth()?.currentUser?.uid as string;

        return this.getUser(uid)
            .valueChanges()
            .pipe(takeUntil(this._unsubscribe));
    }

    /**
     * Проверка существования пользователя в FireStore
     * @param {string} uid - уникальный идентификатор пользователя
     * @return Promise<boolean>
     */
    userExist(uid: string) {
        return this.getUser(uid)
            .get()
            .pipe(map(u => u.exists))
            .toPromise();
    }

    /**
     * Проверка наличия логина у текущего пользователя
     * @return Observable<boolean>
     */
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

    /**
     * Создание пользователя в FireStore с минимальных набором данных
     * @param {string} uid - уникальный идентификатор пользователя
     * @return Promise<void>
     */
    createUser(uid: string) {
        return this.getUser(uid).set({
            uid,
            phoneNumber: (<User>auth().currentUser).phoneNumber as string,
            created: firebase.firestore.FieldValue.serverTimestamp(),
        });
    }

    /**
     * Обновление данных о пользователе в FireStore
     * @param {string} uid - уникальный идентификатор пользователя
     * @param {IUser} data - данные, которые необходимо обновить
     * @return Promise<void>
     */
    updateUserData(uid: string, data: IUser) {
        return this.getUser(uid).set(
            {
                ...data,
            },
            {merge: true}
        );
    }

    /**
     * Проверка доступности логина в FireStore
     * @param {string} login - логин для проверка
     * @return Promise<boolean>
     */
    loginAvailable(login: string) {
        return this._db
            .collection<IUser[]>('users', ref =>
                ref.where('login', '==', login)
            )
            .get()
            .toPromise()
            .then(u => u.size === 0);
    }

    /**
     * Загрузка аватарки в FireStorage
     * Добавление photoUrl для текущего пользователя в FireStore
     * @param {string} base64String - фото в выбранном формате
     * @return Observable<void>
     */
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

    /**
     * Отписка от всех subscriber's
     */
    unsubscribe(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }
}

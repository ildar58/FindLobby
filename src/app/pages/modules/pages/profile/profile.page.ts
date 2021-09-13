import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../../entities/services/auth.service';
import {IUser} from '../../../../entities/interfaces/user.interface';
import {UserService} from '../../../../entities/services/user.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {formatPhone} from '../../../../common/utils/format-phone';
import {
    ActionSheetController,
    AlertController,
    LoadingController,
} from '@ionic/angular';
import {CameraResultType, CameraSource} from '@capacitor/camera';
import firebase from 'firebase';
import auth = firebase.auth;
import {CameraWeb} from '@capacitor/camera/dist/esm/web';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
    public userData$: Observable<IUser | undefined> = this._userService
        .getUserData()
        .pipe(
            map(data => {
                if (data) {
                    data.phoneNumber = formatPhone(
                        data.phoneNumber as string,
                        '+7',
                        '(###) ###-##-##'
                    );

                    if (!data.photoUrl) {
                        data.photoUrl =
                            'https://i.pinimg.com/originals/0c/a9/e2/0ca9e28dcb12dc698cfd2beda6d6fa64.jpg';
                    }
                }
                return data;
            })
        );

    constructor(
        private readonly _router: Router,
        private readonly _route: ActivatedRoute,
        private readonly _userService: UserService,
        private readonly _auth: AuthService,
        private readonly _loadingCtrl: LoadingController,
        private readonly _alertCtrl: AlertController,
        private readonly _actionCtrl: ActionSheetController,
        private readonly _camera: CameraWeb
    ) {}

    routeTo(page: string): void {
        this._router.navigate([page], {relativeTo: this._route});
    }

    async changeAvatar() {
        const image = await this._camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.Base64,
            source: CameraSource.Photos,
            webUseInput: true,
        });

        const loading = await this._loadingCtrl.create();
        await loading.present();

        this._userService
            .uploadAvatar(image.base64String as string)
            .subscribe(() => {
                loading.dismiss();
            });
    }

    async deleteAvatar() {
        const uid = auth().currentUser?.uid as string;
        const loading = await this._loadingCtrl.create();
        loading.present();

        this._userService
            .updateUserData(uid, {photoUrl: ''})
            .then(() => loading.dismiss())
            .catch(async err => {
                await loading.dismiss();
                const alert = await this._alertCtrl.create({
                    header: 'Ошибка',
                    message: err.message,
                    buttons: ['OK'],
                });

                await alert.present();
            });
    }

    async showAction() {
        const actionSheet = await this._actionCtrl.create({
            buttons: [
                {
                    text: 'Открыть фотографию',
                    role: 'open',
                },
                {
                    text: 'Изменить фотографию',
                    handler: () => this.changeAvatar(),
                },
                {
                    text: 'Удалить фотографию',
                    role: 'destructive',
                    handler: () => this.deleteAvatar(),
                },
                {
                    text: 'Отмена',
                    role: 'cancel',
                },
            ],
        });
        await actionSheet.present();
    }

    signOut(): void {
        this._auth.signOut();
    }
}

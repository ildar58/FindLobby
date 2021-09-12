import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../../../../entities/services/user.service';
import {AuthService} from '../../../../../../entities/services/auth.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import firebase from 'firebase';
import auth = firebase.auth;
import {Observable} from 'rxjs';
import {IUser} from '../../../../../../entities/interfaces/user.interface';

@Component({
    selector: 'app-info',
    templateUrl: './info.page.html',
    styleUrls: ['./info.page.scss'],
})
export class InfoPage {
    public userData$: Observable<IUser | undefined> =
        this._userService.getUserData();

    form: FormGroup = new FormGroup({
        login: new FormControl(null, [
            Validators.required,
            Validators.minLength(5),
        ]),
        firstName: new FormControl(null, [Validators.required]),
        lastName: new FormControl(null, [Validators.required]),
    });

    get login(): FormControl {
        return this.form.get('login') as FormControl;
    }

    get isLoginExist(): boolean {
        return this.login.hasError('loginExist');
    }

    get firstName(): FormControl {
        return this.form.get('firstName') as FormControl;
    }

    get lastName(): FormControl {
        return this.form.get('lastName') as FormControl;
    }

    constructor(
        private readonly _userService: UserService,
        private readonly _auth: AuthService,
        private readonly _loadingCtrl: LoadingController,
        private readonly _alertCtrl: AlertController,
        private readonly _router: Router
    ) {}

    async submit() {
        const loading = await this._loadingCtrl.create();
        await loading.present();

        this._userService.loginAvailable(this.login.value).then(
            async isAvailable => {
                if (isAvailable) {
                    const uid = auth().currentUser?.uid;
                    await this._userService.updateUserData(
                        uid as string,
                        this.form.value
                    );
                    this._router.navigateByUrl('/app/interface/profile');
                } else {
                    this.login.setErrors({loginExist: true});
                }
                await loading.dismiss();
            },
            async err => {
                await loading.dismiss();
                const alert = await this._alertCtrl.create({
                    header: 'Ошибка',
                    message: err.message,
                    buttons: ['OK'],
                });

                await alert.present();
            }
        );
    }

    signOut() {
        this._auth.signOut();
    }
}

import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {
    AlertController,
    LoadingController,
    ModalController,
} from '@ionic/angular';
import {AuthService} from '../../entities/services/auth.service';
import {deFormatPhone} from '../../common/utils/format-phone';
import {PhoneInputClass} from '../../common/classes/phone-input.class';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage extends PhoneInputClass {
    public control = new FormControl('');

    constructor(
        private readonly _loadingCtrl: LoadingController,
        protected readonly _modalCtrl: ModalController,
        private readonly _authService: AuthService,
        private readonly _alertCtrl: AlertController
    ) {
        super(_modalCtrl, 'add');
    }

    async handleSubmit() {
        const control = this.control;

        if (!control.value || control.value.length < 18) {
            control.setErrors({minLength: true});
        } else {
            const loading = await this._loadingCtrl.create({
                spinner: 'crescent',
                cssClass: 'loading',
            });
            await loading.present();
            const phone = deFormatPhone(control.value);
            this._authService
                .signInWithPhoneNumber(this.recaptchaVerifier, phone)
                .then(
                    async () => {
                        await loading.dismiss();
                        await this.openVerifier();
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
    }
}

import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {
    AlertController,
    LoadingController,
    ModalController,
} from '@ionic/angular';
import {PhoneInputClass} from '../../../../../../common/classes/phone-input.class';
import {AuthService} from '../../../../../../entities/services/auth.service';
import {deFormatPhone} from '../../../../../../common/utils/format-phone';

@Component({
    selector: 'app-phone',
    templateUrl: './phone.page.html',
    styleUrls: ['./phone.page.scss'],
})
export class PhonePage extends PhoneInputClass {
    public control: FormControl = new FormControl('');

    constructor(
        private readonly _loadingCtrl: LoadingController,
        protected readonly _modalCtrl: ModalController,
        private readonly _authService: AuthService,
        private readonly _alertCtrl: AlertController
    ) {
        super(_modalCtrl, 'edit');
    }

    async handleSubmit() {
        const control = this.control;

        if (!control.value || control.value.length < 18) {
            control.setErrors({minLength: true});
        } else {
            const loading = await this._loadingCtrl.create();
            await loading.present();
            const phone = deFormatPhone(control.value);
            this._authService
                .updatePhoneNumber(this.recaptchaVerifier, phone)
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

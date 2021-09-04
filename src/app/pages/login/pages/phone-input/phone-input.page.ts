import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl} from '@angular/forms';
import firebase from 'firebase';
import {UniDestroyService} from '../../../../common/services/destroy.service';
import {Observable} from 'rxjs';
import {AlertController, LoadingController} from '@ionic/angular';
import {AuthService} from '../../../../entities/services/auth.service';
import {Router} from '@angular/router';
import {deFormatPhone} from '../../../../common/utils/format-phone';

@Component({
    selector: 'app-phone-input',
    templateUrl: './phone-input.page.html',
    styleUrls: ['./phone-input.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UniDestroyService],
})
export class PhoneInputPage {
    public control = new FormControl('');
    private recaptchaVerifier!: firebase.auth.RecaptchaVerifier;

    constructor(
        @Inject(UniDestroyService)
        private readonly _destroy$: Observable<void>,
        private readonly _loadingCtrl: LoadingController,
        private readonly _authService: AuthService,
        private readonly _alertCtrl: AlertController,
        private readonly _router: Router
    ) {}

    async ionViewDidEnter() {
        this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            'recaptcha-container',
            {
                size: 'invisible',
                callback: () => {},
                'expired-callback': () => {},
            }
        );
    }
    ionViewDidLoad() {
        this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            'recaptcha-container',
            {
                size: 'invisible',
                callback: () => {},
                'expired-callback': () => {},
            }
        );
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
                        await this.redirectToCodeInput();
                        this.control.setValue(null);
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

    redirectToCodeInput() {
        return this._router.navigateByUrl('/login/code-input');
    }
}

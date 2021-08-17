import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {UniDestroyService} from '../../common/services/destroy.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {deFormatPhone} from '../../common/utils/format-phone';
import {
    AlertController,
    LoadingController,
    ModalController,
} from '@ionic/angular';
import {CodeInputModal} from './pages/code-input/code-input-modal.component';
import firebase from 'firebase';
import {AuthService} from '../../entities/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UniDestroyService],
})
export class LoginPage {
    public control = new FormControl('');
    private recaptchaVerifier!: firebase.auth.RecaptchaVerifier;

    constructor(
        @Inject(UniDestroyService)
        private readonly _destroy$: Observable<void>,
        private readonly _modalCtrl: ModalController,
        private readonly _loadingCtrl: LoadingController,
        private readonly _authService: AuthService,
        private readonly _alertCtrl: AlertController
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

    async handleSubmit(): Promise<any> {
        const control = this.control;

        if (control.value.length < 18) {
            control.setErrors({minLength: true});
        } else {
            const loading = await this._loadingCtrl.create();
            await loading.present();
            const phone = deFormatPhone(control.value);
            this._authService
                .signInWithPhoneNumber(this.recaptchaVerifier, phone)
                .then(
                    async () => {
                        await loading.dismiss();
                        await this.openModal();
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

    async openModal() {
        const modal = await this._modalCtrl.create({
            component: CodeInputModal,
            swipeToClose: true,
        });
        return await modal.present();
    }
}

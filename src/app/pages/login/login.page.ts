import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {UniDestroyService} from '../../common/services/destroy.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {deFormatPhone} from '../../common/utils/format-phone';
import {ModalController} from '@ionic/angular';
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
        private readonly _modalController: ModalController,
        private readonly _authService: AuthService
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

    public handleSubmit(): void {
        const control = this.control;

        if (control.value.length < 18) {
            control.setErrors({minLength: true});
        } else {
            const phone = deFormatPhone(control.value);
            this._authService
                .signInWithPhoneNumber(this.recaptchaVerifier, phone)
                .then(() => this.openModal());
        }
    }

    async openModal() {
        const modal = await this._modalController.create({
            component: CodeInputModal,
        });
        return await modal.present();
    }
}

import {ModalController} from '@ionic/angular';
import firebase from 'firebase';
import {CodeInputPage} from '../../entities/pages/code-input/code-input.page';

export abstract class PhoneInputClass {
    protected recaptchaVerifier!: firebase.auth.RecaptchaVerifier;

    protected constructor(
        protected readonly _modalCtrl: ModalController,
        private readonly _mode: string
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

    async openVerifier() {
        const modal = await this._modalCtrl.create({
            component: CodeInputPage,
            componentProps: {
                mode: this._mode,
                _recaptchaVerifier: this.recaptchaVerifier,
            },
        });

        return modal.present();
    }
}

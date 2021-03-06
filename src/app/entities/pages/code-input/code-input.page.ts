import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
} from '@angular/core';
import {UniDestroyService} from '../../../common/services/destroy.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {createTimer} from '../../../common/utils/create-timer';
import {
    AlertController,
    LoadingController,
    ModalController,
} from '@ionic/angular';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';
import firebase from 'firebase';

@Component({
    selector: 'app-code-input',
    templateUrl: './code-input.page.html',
    styleUrls: ['./code-input.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UniDestroyService],
})
export class CodeInputPage {
    public control = new FormControl('');
    public mode = 'add';
    public timer$ = createTimer(0, 60);
    public recaptchaVerifier!: firebase.auth.RecaptchaVerifier;
    public sendPhoneFn =
        this.mode === 'add'
            ? this._authService.signInWithPhoneNumber.bind(this._authService)
            : this._authService.updatePhoneNumber.bind(this._authService);
    public sendCodeFn =
        this.mode === 'add'
            ? this._authService.enterVerificationCode.bind(this._authService)
            : this._authService.verifyPhoneNumber.bind(this._authService);

    constructor(
        @Inject(UniDestroyService)
        private readonly _destroy$: Observable<void>,
        private readonly _cdRef: ChangeDetectorRef,
        private readonly _alertCtrl: AlertController,
        private readonly _loadingCtrl: LoadingController,
        private readonly _modalCtrl: ModalController,
        private readonly _authService: AuthService,
        private readonly _router: Router
    ) {}

    ionViewDidEnter(): void {
        this.control.valueChanges
            .pipe(
                takeUntil(this._destroy$),
                filter(code => code.length === 6)
            )
            .subscribe(this.sendCode.bind(this));
    }

    async sendPhone(): Promise<void> {
        this.timer$ = createTimer(0, 60);
        const loading = await this._loadingCtrl.create();
        await loading.present();

        await this.sendPhoneFn(this.recaptchaVerifier)
            .then(async () => {
                await loading.dismiss();
            })
            .catch(async err => {
                await loading.dismiss();
                const alert = await this._alertCtrl.create({
                    header: '????????????',
                    message: err.message,
                    buttons: ['OK'],
                });

                await alert.present();
            });
    }

    async sendCode(code: string): Promise<void> {
        const loading = await this._loadingCtrl.create();
        await loading.present();

        this.sendCodeFn(code).then(
            async () => {
                await loading.dismiss();
                await this.close();

                if (this.mode === 'add') {
                    this._router.navigateByUrl('/app/interface');
                }
            },
            async err => {
                await loading.dismiss();
                const alert = await this._alertCtrl.create({
                    header: '????????????',
                    message: err.message,
                    buttons: ['OK'],
                });

                await alert.present();
            }
        );
    }

    close() {
        return this._modalCtrl.dismiss();
    }
}

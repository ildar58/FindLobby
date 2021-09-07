import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
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
export class CodeInputPage implements OnInit {
    public control = new FormControl('');
    public mode = 'add';
    public timer$ = createTimer(0, 60);
    public recaptchaVerifier!: firebase.auth.RecaptchaVerifier;

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

    ngOnInit(): void {
        this.control.valueChanges
            .pipe(
                takeUntil(this._destroy$),
                filter(code => code.length === 6)
            )
            .subscribe(this.sendCode.bind(this));
    }

    async resendCode(): Promise<void> {
        this.timer$ = createTimer(0, 60);
        const loading = await this._loadingCtrl.create({
            spinner: 'crescent',
            cssClass: 'loading',
        });
        const sendCodeFn =
            this.mode === 'add'
                ? this._authService.signInWithPhoneNumber
                : this._authService.updatePhoneNumber;
        await loading.present();

        await sendCodeFn(this.recaptchaVerifier)
            .then(async () => {
                await loading.dismiss();
            })
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

    async sendCode(code: string): Promise<void> {
        const loading = await this._loadingCtrl.create({
            spinner: 'crescent',
            cssClass: 'loading',
        });
        const verifyFn =
            this.mode === 'add'
                ? this._authService.enterVerificationCode
                : this._authService.verifyPhoneNumber;

        await loading.present();

        verifyFn(code).then(
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
                    header: 'Ошибка',
                    message: err.message,
                    buttons: ['OK'],
                });

                await alert.present();
            }
        );
    }

    close() {
        this._modalCtrl.dismiss();
    }
}

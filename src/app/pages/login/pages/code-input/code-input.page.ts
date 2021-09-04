import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {UniDestroyService} from '../../../../common/services/destroy.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {createTimer} from '../../../../common/utils/create-timer';
import {AlertController, LoadingController} from '@ionic/angular';
import {AuthService} from '../../../../entities/services/auth.service';
import {Router} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-code-input',
    templateUrl: './code-input.page.html',
    styleUrls: ['./code-input.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UniDestroyService],
})
export class CodeInputPage implements OnInit {
    public control = new FormControl('');
    public timer$ = createTimer(0, 60);

    constructor(
        @Inject(UniDestroyService)
        private readonly _destroy$: Observable<void>,
        private readonly _cdRef: ChangeDetectorRef,
        private readonly _alertCtrl: AlertController,
        private readonly _loadingCtrl: LoadingController,
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
        const code = this.control.value;
        await this.sendCode(code);
    }

    async sendCode(code: string): Promise<void> {
        const loading = await this._loadingCtrl.create();
        await loading.present();
        this._authService.enterVerificationCode(code).then(
            async () => {
                await loading.dismiss();
                await this.redirectToInfoInput();
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

    redirectToInfoInput() {
        return this._router.navigateByUrl('/app/info-input');
    }
}

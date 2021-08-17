import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {UniDestroyService} from '../../../../common/services/destroy.service';
import {filter, takeUntil} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {
    AlertController,
    LoadingController,
    ModalController,
} from '@ionic/angular';
import {createTimer} from '../../../../common/utils/create-timer';
import {AuthService} from '../../../../entities/services/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-code-input',
    templateUrl: './code-input-modal.component.html',
    styleUrls: ['./code-input-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UniDestroyService],
})
export class CodeInputModal implements OnInit {
    public control = new FormControl('');
    public timer$ = createTimer(0, 60);

    constructor(
        @Inject(UniDestroyService)
        private readonly _destroy$: Observable<void>,
        private readonly _cdRef: ChangeDetectorRef,
        private readonly _modalCtrl: ModalController,
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
            .subscribe(this.changeCode.bind(this));
    }

    public resendCode(): void {
        this.timer$ = createTimer(0, 60);
        console.log('resended');
    }

    private async changeCode(code: string): Promise<any> {
        if (code.length === 6) {
            const loading = await this._loadingCtrl.create();
            await loading.present();
            this._authService.enterVerificationCode(code).then(
                () => {
                    loading.dismiss();
                    this.dismiss();
                    this._router.navigateByUrl('/app');
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

    dismiss() {
        this._modalCtrl.dismiss({
            dismissed: true,
        });
    }
}

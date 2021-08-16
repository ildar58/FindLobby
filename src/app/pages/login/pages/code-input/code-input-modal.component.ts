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
import {ModalController} from '@ionic/angular';
import {createTimer} from '../../../../common/utils/create-timer';
import {AuthService} from '../../../../entities/services/auth.service';

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
    public controlDisable = false;

    constructor(
        @Inject(UniDestroyService)
        private readonly destroy$: Observable<void>,
        private readonly cdRef: ChangeDetectorRef,
        private readonly modalController: ModalController,
        private readonly authService: AuthService
    ) {}

    ngOnInit(): void {
        this.control.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                filter(code => code.length === 6)
            )
            .subscribe(this.changeCode.bind(this));
    }

    public resendCode(): void {
        this.timer$ = createTimer(0, 60);
        console.log('resended');
    }

    private changeCode(code: string): void {
        if (code.length === 6) {
            this.controlDisable = true;
            this.authService
                .enterVerificationCode(code)
                .then(() => this.dismiss())
                .catch(() => (this.controlDisable = false));
        }
    }

    dismiss() {
        this.modalController.dismiss({
            dismissed: true,
        });
    }
}

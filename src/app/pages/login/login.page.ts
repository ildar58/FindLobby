import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {UniDestroyService} from '../../common/services/destroy.service';
import {Observable} from 'rxjs';
import {deFormatPhone} from '../../common/utils/format-phone';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    providers: [UniDestroyService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
    public form = new FormGroup({
        phone: new FormControl(''),
        code: new FormControl(''),
    });

    public get phoneControl(): FormControl {
        return this.form.get('phone') as FormControl;
    }

    public get codeControl(): FormControl {
        return this.form.get('code') as FormControl;
    }

    constructor(
        @Inject(UniDestroyService)
        private readonly destroy$: Observable<void>,
        private readonly cdRef: ChangeDetectorRef
    ) {}

    public handleSubmit(): void {
        const control = this.phoneControl;

        if (control.value.length < 18) {
            control.setErrors({minLength: true});
        } else {
            const phone = deFormatPhone(control.value);
        }
    }
}

import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../entities/services/auth.service';
import {loginAsyncValidator} from '../../../../common/validators/login-exist';

@Component({
    selector: 'app-introduction',
    templateUrl: './introduction.page.html',
    styleUrls: ['./introduction.page.scss'],
})
export class IntroductionPage implements OnInit {
    form: FormGroup = new FormGroup({
        login: new FormControl(null, {
            validators: [Validators.required, Validators.minLength(5)],
            asyncValidators: [loginAsyncValidator(this._auth)],
        }),
        firstName: new FormControl(null, [Validators.required]),
        lastName: new FormControl(null, [Validators.required]),
    });

    get login(): FormControl {
        return this.form.get('login') as FormControl;
    }

    get isLoginExist(): boolean {
        return this.login.hasError('loginExist');
    }

    get firstName(): FormControl {
        return this.form.get('firstName') as FormControl;
    }

    get lastName(): FormControl {
        return this.form.get('lastName') as FormControl;
    }

    constructor(private readonly _auth: AuthService) {}

    ngOnInit() {}

    submit() {}
}

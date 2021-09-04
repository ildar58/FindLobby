import {ChangeDetectionStrategy, Component} from '@angular/core';
import {UniDestroyService} from '../../common/services/destroy.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UniDestroyService],
})
export class LoginPage {}

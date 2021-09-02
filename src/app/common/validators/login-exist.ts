import {AuthService} from '../../entities/services/auth.service';
import {FormControl} from '@angular/forms';
import {timer} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

export const loginAsyncValidator: any = (
    authService: AuthService,
    time = 200
) => {
    return (input: FormControl) => {
        return timer(time).pipe(
            switchMap(() => authService.checkLogin(input.value)),
            map(res => {
                return !res ? null : {loginExist: true};
            })
        );
    };
};

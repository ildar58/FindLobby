import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../../../entities/services/user.service';
import {map, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class LoginExistGuard implements CanActivate {
    constructor(
        private readonly _userService: UserService,
        private readonly _router: Router
    ) {}

    canActivate():
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this._userService.userHasLogin().pipe(
            tap(hasLogin => {
                if (hasLogin) {
                    this._router.navigateByUrl('/app/interface');
                }
            }),
            map(hasLogin => !hasLogin)
        );
    }
}

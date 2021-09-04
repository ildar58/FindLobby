import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../../entities/services/auth.service';
import {IUser} from '../../../../entities/interfaces/user.interface';
import {UserService} from '../../../../entities/services/user.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
    user?: IUser;
    avatar = '';

    constructor(
        private readonly _router: Router,
        private readonly _route: ActivatedRoute,
        private readonly _userService: UserService,
        private readonly _auth: AuthService
    ) {}

    ngOnInit() {
        this._userService.getUserData().subscribe((user: IUser | undefined) => {
            this.user = user;
            if (!this.user?.photoUrl) {
                this.avatar =
                    'https://i.pinimg.com/originals/0c/a9/e2/0ca9e28dcb12dc698cfd2beda6d6fa64.jpg';
            }
        });
    }

    routeTo(page: string): void {
        this._router.navigate([page], {relativeTo: this._route});
    }

    signOut(): void {
        this._auth.signOut();
    }
}

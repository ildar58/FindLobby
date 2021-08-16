import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../entities/services/auth.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
    constructor(private authService: AuthService) {}

    ngOnInit() {}

    signOut(): void {
        this.authService.signOut();
    }
}

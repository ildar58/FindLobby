import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-phone',
    templateUrl: './phone.page.html',
    styleUrls: ['./phone.page.scss'],
})
export class PhonePage implements OnInit {
    public control: FormControl = new FormControl('');

    constructor() {}

    ngOnInit() {}

    handleSubmit(): void {}
}

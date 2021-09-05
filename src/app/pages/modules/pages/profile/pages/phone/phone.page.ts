import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {LoadingController} from '@ionic/angular';

@Component({
    selector: 'app-phone',
    templateUrl: './phone.page.html',
    styleUrls: ['./phone.page.scss'],
})
export class PhonePage implements OnInit {
    public control: FormControl = new FormControl('');

    constructor(private readonly _loadingCtrl: LoadingController) {}

    ngOnInit() {}

    async handleSubmit() {
        const control = this.control;

        if (!control.value || control.value.length < 18) {
            control.setErrors({minLength: true});
        } else {
            const loading = await this._loadingCtrl.create({
                spinner: 'crescent',
                cssClass: 'loading',
                duration: 1000,
            });
            await loading.present();
        }
    }
}

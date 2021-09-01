import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {PhonePage} from './phone.page';
import {PhonePageRoutingModule} from './phone-routing.module';
import {SharedModule} from '../../../../../../common/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PhonePageRoutingModule,
        ReactiveFormsModule,
        SharedModule,
    ],
    declarations: [PhonePage],
})
export class PhonePageModule {}

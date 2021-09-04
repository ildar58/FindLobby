import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {PhoneInputPageRoutingModule} from './phone-input-routing.module';

import {PhoneInputPage} from './phone-input.page';
import {SharedModule} from '../../../../common/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PhoneInputPageRoutingModule,
        ReactiveFormsModule,
        SharedModule,
    ],
    declarations: [PhoneInputPage],
})
export class PhoneInputPageModule {}

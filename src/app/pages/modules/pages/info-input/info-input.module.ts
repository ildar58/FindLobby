import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {InfoInputPageRoutingModule} from './info-input-routing.module';

import {InfoInputPage} from './info-input.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        InfoInputPageRoutingModule,
        ReactiveFormsModule,
    ],
    declarations: [InfoInputPage],
})
export class InfoInputPageModule {}

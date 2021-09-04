import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {CodeInputPageRoutingModule} from './code-input-routing.module';

import {CodeInputPage} from './code-input.page';
import {SharedModule} from '../../../../common/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CodeInputPageRoutingModule,
        ReactiveFormsModule,
        SharedModule,
    ],
    declarations: [CodeInputPage],
})
export class CodeInputPageModule {}

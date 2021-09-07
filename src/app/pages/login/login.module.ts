import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {LoginPage} from './login.page';
import {LoginRoutingModule} from './login-routing.module';
import {SharedModule} from '../../common/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CodeInputPageModule} from '../../entities/pages/code-input/code-input.module';

@NgModule({
    declarations: [LoginPage],
    imports: [
        CommonModule,
        CodeInputPageModule,
        FormsModule,
        IonicModule,
        LoginRoutingModule,
        SharedModule,
        ReactiveFormsModule,
    ],
})
export class LoginPageModule {}

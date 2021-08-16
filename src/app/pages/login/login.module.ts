import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CodeInputModal} from './pages/code-input/code-input-modal.component';
import {SharedModule} from '../../common/shared.module';
import {IonicModule} from '@ionic/angular';
import {LoginPage} from './login.page';
import {LoginRoutingModule} from './login-routing.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [CodeInputModal, LoginPage],
    imports: [
        CommonModule,
        SharedModule,
        IonicModule,
        LoginRoutingModule,
        ReactiveFormsModule,
    ],
})
export class LoginPageModule {}

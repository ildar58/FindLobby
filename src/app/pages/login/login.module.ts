import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {LoginPage} from './login.page';
import {LoginRoutingModule} from './login-routing.module';

@NgModule({
    declarations: [LoginPage],
    imports: [CommonModule, IonicModule, LoginRoutingModule],
})
export class LoginPageModule {}

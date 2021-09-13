import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ProfilePageRoutingModule} from './profile-routing.module';

import {ProfilePage} from './profile.page';
import {SharedModule} from '../../../../common/shared.module';
import {CameraWeb} from '@capacitor/camera/dist/esm/web';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProfilePageRoutingModule,
        SharedModule,
    ],
    declarations: [ProfilePage],
    providers: [CameraWeb],
})
export class ProfilePageModule {}

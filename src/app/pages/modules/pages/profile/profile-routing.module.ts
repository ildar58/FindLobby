import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ProfilePage} from './profile.page';

const routes: Routes = [
    {
        path: '',
        component: ProfilePage,
    },
    {
        path: 'phone',
        loadChildren: () =>
            import('./pages/phone/phone.module').then(m => m.PhonePageModule),
    },
    {
        path: 'language',
        loadChildren: () =>
            import('./pages/language/language.module').then(
                m => m.LanguagePageModule
            ),
    },
    {
        path: 'notifications',
        loadChildren: () =>
            import('./pages/notifications/notifications.module').then(
                m => m.NotificationsPageModule
            ),
    },
    {
        path: 'info',
        loadChildren: () =>
            import('./pages/info/info.module').then(m => m.InfoPageModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProfilePageRoutingModule {}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginPage} from './login.page';

const routes: Routes = [
    {
        path: '',
        component: LoginPage,
        children: [
            {
                path: 'phone-input',
                loadChildren: () =>
                    import('./pages/phone-input/phone-input.module').then(
                        m => m.PhoneInputPageModule
                    ),
            },
            {
                path: 'code-input',
                loadChildren: () =>
                    import('./pages/code-input/code-input.module').then(
                        m => m.CodeInputPageModule
                    ),
            },
            {
                path: '**',
                redirectTo: 'phone-input',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LoginRoutingModule {}

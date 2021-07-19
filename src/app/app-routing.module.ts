import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {
    canActivate,
    redirectLoggedInTo,
    redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import {LoginPage} from './pages/login/login.page';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/']);
const redirectLoggedIntoApp = () => redirectLoggedInTo(['/app']);

const routes: Routes = [
    {
        path: '',
        component: LoginPage,
        ...canActivate(redirectLoggedIntoApp),
    },
    {
        path: 'app',
        loadChildren: () =>
            import('./pages/modules/modules.module').then(
                m => m.ModulesPageModule
            ),
        ...canActivate(redirectUnauthorizedToLogin),
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}

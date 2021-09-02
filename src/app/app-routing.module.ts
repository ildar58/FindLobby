import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {
    canActivate,
    redirectLoggedInTo,
    redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedIntoApp = () => redirectLoggedInTo(['/app']);

const routes: Routes = [
    {
        path: 'app',
        loadChildren: () =>
            import('./pages/modules/modules.module').then(
                m => m.ModulesPageModule
            ),
        // ...canActivate(redirectUnauthorizedToLogin),
    },
    {
        path: 'login',
        loadChildren: () =>
            import('./pages/login/login.module').then(m => m.LoginPageModule),
        // ...canActivate(redirectLoggedIntoApp),
    },
    {
        path: '**',
        redirectTo: 'app',
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules,
            relativeLinkResolution: 'legacy',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}

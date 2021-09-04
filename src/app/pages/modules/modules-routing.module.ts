import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ModulesPage} from './modules.page';
import {LoginExistGuard} from './guards/login-exist.guard';
import {LoginNotExistGuard} from './guards/login-not-exist.guard';

const routes: Routes = [
    {
        path: 'interface',
        component: ModulesPage,
        children: [
            {
                path: 'lobby',
                loadChildren: () =>
                    import('./pages/lobby/lobby.module').then(
                        m => m.LobbyPageModule
                    ),
            },
            {
                path: 'search',
                loadChildren: () =>
                    import('./pages/search/search.module').then(
                        m => m.SearchPageModule
                    ),
            },
            {
                path: 'messages',
                loadChildren: () =>
                    import('./pages/messages/messages.module').then(
                        m => m.MessagesPageModule
                    ),
            },
            {
                path: 'profile',
                loadChildren: () =>
                    import('./pages/profile/profile.module').then(
                        m => m.ProfilePageModule
                    ),
            },
            {
                path: '**',
                redirectTo: 'lobby',
                pathMatch: 'full',
            },
        ],
        canActivate: [LoginNotExistGuard],
    },
    {
        path: 'info-input',
        loadChildren: () =>
            import('./pages/info-input/info-input.module').then(
                m => m.InfoInputPageModule
            ),
        canActivate: [LoginExistGuard],
    },
    {
        path: '**',
        redirectTo: 'info-input',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ModulesPageRoutingModule {}

import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ModulesPage} from './modules.page';

const routes: Routes = [
    {
        path: '',
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
                path: '',
                redirectTo: 'lobby',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ModulesPageRoutingModule {}

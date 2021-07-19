import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ModulesPage} from './modules.page';

const routes: Routes = [
    {
        path: '',
        component: ModulesPage,
        children: [
            {
                path: 'search',
                loadChildren: () =>
                    import('./pages/search/search.module').then(
                        m => m.SearchPageModule
                    ),
            },
            {
                path: 'analytics',
                loadChildren: () =>
                    import('./pages/analytics/analytics.module').then(
                        m => m.AnalyticsPageModule
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
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ModulesPageRoutingModule {}

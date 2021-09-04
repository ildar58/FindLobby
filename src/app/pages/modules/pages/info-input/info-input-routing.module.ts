import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {InfoInputPage} from './info-input.page';

const routes: Routes = [
    {
        path: '',
        component: InfoInputPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InfoInputPageRoutingModule {}

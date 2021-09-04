import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {PhoneInputPage} from './phone-input.page';

const routes: Routes = [
    {
        path: '',
        component: PhoneInputPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PhoneInputPageRoutingModule {}

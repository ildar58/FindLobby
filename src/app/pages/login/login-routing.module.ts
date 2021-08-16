import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginPage} from './login.page';
import {UniLetDirective} from '../../common/directives/let.directive';

const routes: Routes = [
    {
        path: '',
        component: LoginPage,
    },
];

@NgModule({
    declarations: [UniLetDirective],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule, UniLetDirective],
})
export class LoginRoutingModule {}

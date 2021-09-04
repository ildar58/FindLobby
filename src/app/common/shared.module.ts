import {NgModule} from '@angular/core';
import {PhoneInputDirective} from './directives/phone-input.directive';
import {UniLetDirective} from './directives/let.directive';

@NgModule({
    declarations: [PhoneInputDirective, UniLetDirective],
    exports: [PhoneInputDirective, UniLetDirective],
})
export class SharedModule {}

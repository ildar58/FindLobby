import {NgModule} from '@angular/core';
import {PhoneInputDirective} from './directives/phone-input.directive';

@NgModule({
    declarations: [PhoneInputDirective],
    exports: [PhoneInputDirective],
})
export class SharedModule {}

import {Directive, ElementRef, HostListener} from '@angular/core';
import {formatPhone} from '../utils/format-phone';

const NON_PLUS_AND_DIGITS_REGEX = /[ \-_()]/g;

@Directive({
    selector: '[uniPhoneInput]',
})
export class PhoneInputDirective {
    public countryCode = '+7';

    public phoneMaskAfterCountryCode = '(###) ###-##-##';

    @HostListener('ionChange') onChange() {
        const value = this.element.nativeElement.value;

        const parsed = isText(value)
            ? value
            : value.replace(NON_PLUS_AND_DIGITS_REGEX, '');

        this.element.nativeElement.value = formatPhone(
            parsed === this.countryCode || isText(parsed) ? '' : parsed,
            this.countryCode,
            this.phoneMaskAfterCountryCode
        );
    }

    constructor(private element: ElementRef) {}
}

function isText(value: string): boolean {
    return isNaN(parseInt(value.replace(NON_PLUS_AND_DIGITS_REGEX, ''), 10));
}

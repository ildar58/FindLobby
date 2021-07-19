import {UniContextWithImplicit} from '../interfaces/context-with-implicit.interface';
import {UniLetDirective} from './let.directive';

/**
 * @internal
 */
export class UniLetContext<T> implements UniContextWithImplicit<T> {
    constructor(
        private readonly internalDirectiveInstance: UniLetDirective<T>
    ) {}

    get $implicit(): T {
        return this.internalDirectiveInstance.uniLet;
    }

    get uniLet(): T {
        return this.internalDirectiveInstance.uniLet;
    }
}

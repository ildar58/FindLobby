/**
 * Works like *ngIf but does not have a condition — use it to declare
 * the result of pipes calculation (i.e. async pipe)
 */
import {
    Directive,
    Inject,
    Input,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';
import {UniLetContext} from './let-context';

@Directive({
    selector: '[uniLet]',
})
export class UniLetDirective<T> {
    @Input()
    uniLet!: T;

    constructor(
        @Inject(ViewContainerRef) viewContainer: ViewContainerRef,
        @Inject(TemplateRef) templateRef: TemplateRef<UniLetContext<T>>
    ) {
        viewContainer.createEmbeddedView(
            templateRef,
            new UniLetContext<T>(this)
        );
    }

    /**
     * Asserts the correct type of the context for the template that `UniLet` will render.
     *
     * The presence of this method is a signal to the Ivy template type-check compiler that the
     * `UniLet` structural directive renders its template with a specific context type.
     */
    static ngTemplateContextGuard<T>(
        _dir: UniLetDirective<T>,
        _ctx: any
    ): _ctx is UniLetDirective<T> {
        return true;
    }
}

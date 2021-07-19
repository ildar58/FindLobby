import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

/**
 * Отписывается при разрушении компонента (для использования с takeUntil)
 */
@Injectable()
export class UniDestroyService extends Subject<void> implements OnDestroy {
    ngOnDestroy() {
        this.next();
        this.complete();
    }
}

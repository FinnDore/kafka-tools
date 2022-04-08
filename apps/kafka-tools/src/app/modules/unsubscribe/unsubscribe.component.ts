import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    template: `kafka-tools-priv-unsubscribe`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Unsubscribe implements OnDestroy {
    readonly onDestroy$ = new Subject<void>();

    /**
     * Calls the on describe subject
     */
    ngOnDestroy(): void {
        this.onDestroy$.next();
    }
}

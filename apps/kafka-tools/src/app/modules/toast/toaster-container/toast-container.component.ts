import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component
} from '@angular/core';
import { takeUntil, tap } from 'rxjs';
import { Unsubscribe } from '../../unsubscribe/unsubscribe.component';
import { ToasterStore } from '../toaster.store';
import { ToastOptions } from '../_models/toast-options.model';

@Component({
    selector: 'kafka-tools-toast-container',
    templateUrl: './toast-container.component.html',
    styleUrls: ['./toast-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToasterContainerComponent extends Unsubscribe {
    /**
     * Call cd on toast events
     */
    readonly toastEvents$ = this.toastService.toastEvents$.pipe(
        tap(() => this.ref.detectChanges()),
        takeUntil(this.onDestroy$)
    );

    constructor(
        private ref: ChangeDetectorRef,
        public toastService: ToasterStore
    ) {
        super();
        this.toastEvents$.subscribe();
    }

    /**
     * Closes the toast with the given id
     * @param id the id of the toast to close
     */
    closeToast(id: number): void {
        this.toastService.unPop(id);
    }

    /**
     * Track by function for the toasts
     * @param index the index of the item
     * @param item the item
     * @returns
     */
    trackByFn(index: number, item: ToastOptions): number {
        return item.id;
    }
}

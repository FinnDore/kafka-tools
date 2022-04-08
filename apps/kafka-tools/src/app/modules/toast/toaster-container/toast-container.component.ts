import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToasterStore } from '../toaster.store';
import { ToastOptions } from '../_models/toast-options.model';

@Component({
    selector: 'kafka-tools-toast-container',
    templateUrl: './toast-container.component.html',
    styleUrls: ['./toast-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToasterContainerComponent {
    constructor(public toastService: ToasterStore) {}

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

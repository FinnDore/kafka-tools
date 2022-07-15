import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ToastOptions } from '../_models/toast-options.model';

@Component({
    selector: 'kafka-tools-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
    @Input() options!: ToastOptions;
}

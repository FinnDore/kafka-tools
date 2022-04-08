import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'kafka-tools-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {}

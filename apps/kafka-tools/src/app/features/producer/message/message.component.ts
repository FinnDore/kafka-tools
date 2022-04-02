import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { KafkaMessage } from '../../../../_interfaces/kafka-message.model';

@Component({
    selector: 'kafka-tools-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
    @Input()
    message!: KafkaMessage;
}

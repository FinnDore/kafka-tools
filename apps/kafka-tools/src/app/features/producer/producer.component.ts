import { ChangeDetectionStrategy, Component } from '@angular/core';
import { invoke } from '@tauri-apps/api';
@Component({
    selector: 'kafka-tools-producer',
    templateUrl: './producer.component.html',
    styleUrls: ['./producer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProducerComponent {
    /**
     * Sends a kafka message to a topic
     * @param topic the topic to send the message to
     * @param message the message to send
     */
    sendMessage(topic: string, message: string): void {
        invoke('send_kafka_message', { topic, message });
    }
}

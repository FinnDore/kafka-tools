import { ChangeDetectionStrategy, Component } from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { Event, listen } from '@tauri-apps/api/event';
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

    /**
     * Listens to a kafka topic
     * @param topic the topic to listen to
     */
    listenToTopic(topic: string): void {
        invoke('subscribe_to_topic', { topic });
    }
    /**
     * unlistens to a kafka topic
     * @param topic the topic to listen to
     */
    unsubscribeToTopic(topic: string): void {
        invoke('unsubscribe_from_topic', { topic });
    }

    // eslint-disable-next-line require-jsdoc
    constructor() {
        this.listenForEvent();
    }
    /**
     * Listens for tauri events
     */
    async listenForEvent(): Promise<void> {
        console.log('lisening');
        await listen('kafka-message', (e: Event<string>) => {
            const m: { payload: string; topic: string } = JSON.parse(e.payload);

            console.log(
                `%c KAFKA-MESSAGE - ${m.topic} `,
                'background: #8000ff; color: white; font-weight: bolder',
                `: ${m.payload}`
            );
        });
    }
}

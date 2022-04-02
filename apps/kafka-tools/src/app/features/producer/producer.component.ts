import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    ViewChild,
} from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { Event, listen } from '@tauri-apps/api/event';
import { KafkaMessage } from '../../../_interfaces/kafka-message.model';
@Component({
    selector: 'kafka-tools-producer',
    templateUrl: './producer.component.html',
    styleUrls: ['./producer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProducerComponent {
    readonly broker = 'localhost:9092';

    messages: KafkaMessage[] = [];
    currentTopic: string | null = null;

    @ViewChild('terminal', { read: ElementRef })
    terminal!: ElementRef<HTMLDivElement>;
    @ViewChild('terminalFooter', { read: ElementRef })
    terminalFooter!: ElementRef<HTMLDivElement>;

    /**
     * constructor for the producer component
     * @param ref the CD ref
     */
    constructor(private ref: ChangeDetectorRef) {
        this.listenForEvent();
        this.listenToTopic('topic-test');
    }

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
        if (this.currentTopic) {
            this.unsubscribeToTopic(this.currentTopic);
        }
        this.currentTopic = topic;
        invoke('subscribe_to_topic', { topic, broker: this.broker });
    }

    /**
     * unlistens to a kafka topic
     * @param topic the topic to listen to
     */
    unsubscribeToTopic(topic: string): void {
        invoke('unsubscribe_from_topic', { topic });
        this.messages = [];
    }

    /**
     * Listens for tauri events
     */
    async listenForEvent(): Promise<void> {
        console.log('listening');
        await listen('kafka-message', this.processMessage.bind(this));
    }

    /**
     * Processes a kafka event message
     * @param e the event to process
     */
    processMessage(e: Event<string>): void {
        const m: KafkaMessage = JSON.parse(e.payload);

        if (m.topic !== this.currentTopic) {
            return;
        }

        console.log(
            `%c KAFKA-MESSAGE - ${m.topic} `,
            'background: #8000ff; color: white; font-weight: bolder',
            `: ${m.payload}`
        );
        this.messages.push(m);
        this.ref.detectChanges();
        const terminal = this.terminal.nativeElement;

        if (
            Math.abs(
                terminal.scrollHeight -
                    terminal.clientHeight -
                    terminal.scrollTop
            ) < 50
        ) {
            this.terminalFooter.nativeElement.scrollIntoView({});
        }
    }
}

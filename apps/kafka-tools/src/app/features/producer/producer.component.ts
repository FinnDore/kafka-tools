import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    ViewChild
} from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { Event, listen } from '@tauri-apps/api/event';
import { KafkaMessage } from '../../../shared/_interfaces/kafka-message.model';
@Component({
    selector: 'kafka-tools-producer',
    templateUrl: './producer.component.html',
    styleUrls: ['./producer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProducerComponent {
    readonly broker = 'localhost:9092';

    messages: KafkaMessage[] = [];
    currentTopic: string | null = null;

    @ViewChild('terminal', { read: ElementRef })
    terminal!: ElementRef<HTMLDivElement>;
    @ViewChild('terminalFooter', { read: ElementRef })
    terminalFooter!: ElementRef<HTMLDivElement>;

    constructor(private ref: ChangeDetectorRef) {}

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
     * Unlistens to a kafka topic
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

        const terminal = this.terminal.nativeElement;
        const should_scroll =
            Math.abs(
                terminal.scrollHeight -
                    terminal.clientHeight -
                    terminal.scrollTop
            ) < 1;
        this.messages.push(m);

        this.ref.detectChanges();

        if (should_scroll) {
            this.terminalFooter.nativeElement.scrollIntoView();
        }
    }
}

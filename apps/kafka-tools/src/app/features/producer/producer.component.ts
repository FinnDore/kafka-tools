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
import { ToasterStore, ToastLevel } from '../../modules/toast';
@Component({
    selector: 'kafka-tools-producer',
    templateUrl: './producer.component.html',
    styleUrls: ['./producer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProducerComponent {
    readonly broker = 'localhost:9092';
    loading = false;
    messages: KafkaMessage[] = [];
    currentTopic: string | null = null;

    @ViewChild('terminal', { read: ElementRef })
    terminal!: ElementRef<HTMLDivElement>;
    @ViewChild('terminalFooter', { read: ElementRef })
    terminalFooter!: ElementRef<HTMLDivElement>;

    constructor(
        private ref: ChangeDetectorRef,
        private toastStore: ToasterStore
    ) {
        this.listenForEvent();
        this.listenToTopic('topic-test');
        this.popToast(ToastLevel.SUCCESS);
        this.popToast(ToastLevel.ERROR);
        this.popToast(ToastLevel.ATTENTION);
        this.popToast(ToastLevel.INFO);
    }

    popToast(level: ToastLevel = ToastLevel.SUCCESS) {
        this.toastStore.pop({
            content:
                'Connected to broker. You can now send messages to a topic of your choice.',
            level
        });
    }

    /**
     * Sends a kafka message to a topic
     * @param topic the topic to send the message to
     * @param message the message to send
     */
    async sendMessage(topic: string, message: string): Promise<void> {
        this.loading = true;
        this.ref.detectChanges();
        const res = await invoke('send_kafka_message', { topic, message });
        console.log(res);
        this.loading = false;
        this.ref.detectChanges();
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

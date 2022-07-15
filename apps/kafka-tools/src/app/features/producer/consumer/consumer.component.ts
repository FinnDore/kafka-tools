import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { invoke } from '@tauri-apps/api';

@Component({
    selector: 'kafka-tools-consumer',
    templateUrl: './consumer.component.html',
    styleUrls: ['./consumer.component.scss']
})
export class ConsumerComponent {
    @Input() topic: string | null = null;

    @ViewChild('terminal', { read: ElementRef })
    terminal!: ElementRef<HTMLDivElement>;
    @ViewChild('terminalFooter', { read: ElementRef })
    terminalFooter!: ElementRef<HTMLDivElement>;

    /**
     * Sends a kafka message to a topic
     * @param message the message to send
     */
    async sendMessage(message: string): Promise<void> {
        if (this.topic) {
            const res = await invoke('send_kafka_message', {
                topic: this.topic,
                message
            });
            console.log(res);
        }
    }
}

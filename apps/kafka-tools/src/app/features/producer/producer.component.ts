import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'kafka-tools-producer',
    templateUrl: './producer.component.html',
    styleUrls: ['./producer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProducerComponent {
    readonly paletteArray = new Array(100);
}

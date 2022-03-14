import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ProducerRoutingModule } from './producer-routing.module';
import { ProducerComponent } from './producer.component';

@NgModule({
    imports: [
        CommonModule,

        // Angular material
        MatButtonModule,

        // Local
        ProducerRoutingModule,
    ],
    declarations: [ProducerComponent],
    exports: [ProducerComponent],
})
export class ProducerModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProducerRoutingModule } from './producer-routing.module';
import { ProducerComponent } from './producer.component';
@NgModule({
    imports: [
        CommonModule,

        // Angular material

        // Local
        ProducerRoutingModule,
    ],
    declarations: [ProducerComponent],
    exports: [ProducerComponent],
})
export class ProducerModule {}

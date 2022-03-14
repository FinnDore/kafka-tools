import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ProducerRoutingModule } from './producer-routing.module';
import { ProducerComponent } from './producer.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@NgModule({
    imports: [
        CommonModule,

        // Angular material
        MatButtonModule,
        MatSlideToggleModule,

        // Local
        ProducerRoutingModule,
    ],
    declarations: [ProducerComponent],
    exports: [ProducerComponent],
})
export class ProducerModule {}

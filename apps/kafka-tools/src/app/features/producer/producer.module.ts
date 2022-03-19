import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ProducerRoutingModule } from './producer-routing.module';
import { ProducerComponent } from './producer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
@NgModule({
    imports: [
        CommonModule,

        // Angular material
        MatFormFieldModule,
        MatButtonModule,

        // Local
        ProducerRoutingModule,
    ],
    declarations: [ProducerComponent],
    exports: [ProducerComponent],
})
export class ProducerModule {}

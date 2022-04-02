import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ProducerRoutingModule } from './producer-routing.module';
import { ProducerComponent } from './producer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageComponent } from './message/message.component';
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,

        // Angular material
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,

        // Local
        ProducerRoutingModule,
    ],
    declarations: [ProducerComponent, MessageComponent],
    exports: [ProducerComponent],
})
export class ProducerModule {}

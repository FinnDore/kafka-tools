import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormatPipeModule } from 'ngx-date-fns';
import { ToastModule } from '../../modules/toast';
import { ConsumerComponent } from './consumer/consumer.component';
import { MessageComponent } from './message/message.component';
import { ProducerRoutingModule } from './producer-routing.module';
import { ProducerComponent } from './producer.component';
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormatPipeModule,

        // Angular material
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,

        // Local
        ProducerRoutingModule,
        ToastModule
    ],
    declarations: [ProducerComponent, MessageComponent, ConsumerComponent],
    exports: [ProducerComponent]
})
export class ProducerModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ProducerRoutingModule } from './producer-routing.module';
import { ProducerComponent } from './producer.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
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

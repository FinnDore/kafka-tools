import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WindowControlsComponent } from './window-controls.component';

@NgModule({
    declarations: [WindowControlsComponent],
    imports: [
        //libs
        CommonModule,
        FontAwesomeModule,

        // Angular material
        MatButtonModule,
    ],
    exports: [WindowControlsComponent],
})
export class WindowControlsModule {}

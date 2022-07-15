import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToasterContainerComponent } from './toaster-container/toast-container.component';
import { ToastComponent } from './toast/toast.component';
import { UnsubscribeModule } from '../unsubscribe';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
    imports: [
        // Libs
        CommonModule,

        // Angular material
        MatRippleModule,

        // Local
        UnsubscribeModule
    ],
    declarations: [ToasterContainerComponent, ToastComponent],
    exports: [ToasterContainerComponent]
})
export class ToastModule {}

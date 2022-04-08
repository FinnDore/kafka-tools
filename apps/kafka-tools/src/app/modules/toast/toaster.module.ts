import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToasterContainerComponent } from './toaster-container/toast-container.component';
import { ToastComponent } from './toast/toast.component';

@NgModule({
    declarations: [ToasterContainerComponent, ToastComponent],
    exports: [ToasterContainerComponent],
    imports: [CommonModule]
})
export class ToastModule {}

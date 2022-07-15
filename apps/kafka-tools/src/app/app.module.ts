import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { ToastModule } from './modules/toast';
import { WindowControlsModule } from './modules/window-controls/window-controls.module';
import { AppRoutingModule } from './routing/app-routing.module';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,

        // Angular material

        // Local modules
        AppRoutingModule,
        WindowControlsModule,
        ToastModule
    ],
    declarations: [AppComponent],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}

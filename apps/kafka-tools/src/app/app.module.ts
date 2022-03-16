import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './routing/app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WindowControlsModule } from './modules/window-controls/window-controls.module';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,

        // Angular material

        // Local modules
        AppRoutingModule,
        FontAwesomeModule,
        WindowControlsModule,
    ],
    declarations: [AppComponent],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}

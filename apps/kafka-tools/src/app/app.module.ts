import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './routing/app-routing.module';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,

        // Angular material
        MatButtonModule,

        // Local modules
        AppRoutingModule,
    ],
    declarations: [AppComponent],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}

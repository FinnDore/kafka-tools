import { Component } from '@angular/core';

@Component({
    selector: 'kafka-tools-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'kafka-tools';

    readonly themes = ['light', 'dark', 'git-hub', 'pop-n-lock'];
    currentThemeIndex = 2;

    /**
     * Shuffles the current color theme
     */
    shuffleTheme(): void {
        this.currentThemeIndex =
            this.currentThemeIndex === this.themes.length - 1
                ? 0
                : this.currentThemeIndex + 1;
    }
}

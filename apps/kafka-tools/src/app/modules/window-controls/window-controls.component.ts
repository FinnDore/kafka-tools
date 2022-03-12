import { Component } from '@angular/core';
import { appWindow } from '@tauri-apps/api/window';

@Component({
    selector: 'kafka-tools-window-controls',
    templateUrl: './window-controls.component.html',
    styleUrls: ['./window-controls.component.scss'],
})
export class WindowControlsComponent {
    async maximizeOrMinimize() {
        if (await appWindow.isMaximized()) {
            appWindow.unmaximize();
        } else {
            this.minimize;
        }
    }

    minimize() {
        appWindow.maximize();
    }

    close() {
        appWindow.close();
    }
}

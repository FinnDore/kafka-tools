import { Component } from '@angular/core';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { faMinus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { appWindow } from '@tauri-apps/api/window';
@Component({
    selector: 'kafka-tools-window-controls',
    templateUrl: './window-controls.component.html',
    styleUrls: ['./window-controls.component.scss'],
})
export class WindowControlsComponent {
    readonly faXmark = faXmark;
    readonly faSquare = faSquare;
    readonly faMinus = faMinus;

    /**
     * Minimizes the window or maximized dependent on wether its currently maximized
     */
    async maximizeOrMinimize(): Promise<void> {
        if (await appWindow.isMaximized()) {
            appWindow.unmaximize();
        } else {
            appWindow.maximize();
        }
    }

    /**
     * Minimizes the window
     */
    minimize(): void {
        appWindow.minimize();
    }

    /**
     * Closes the window
     */
    close(): void {
        appWindow.close();
    }
}

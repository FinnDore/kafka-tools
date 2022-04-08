import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { mergeMap, Observable, of, Subject } from 'rxjs';
import { ToastEvent } from './_enums/toast-event';
import { PopOptions } from './_models/pop-options.model';
import { ToastOptions } from './_models/toast-options.model';

interface ToasterStoreState {
    activeToasts: string[];
}

const DEFAULT_STATE = {
    activeToasts: []
};

@Injectable({
    providedIn: 'root'
})
export class ToasterStore extends ComponentStore<ToasterStoreState> {
    private toastRef = 0;

    readonly toastEvents$ = new Subject<ToastEvent>();
    readonly activeToasts: ToastOptions[] = [];

    /** Effects */

    /**
     * Pops a toast with the given options
     * @param popOptions the options to pop the toast with
     */
    readonly pop = this.effect((source$: Observable<PopOptions>) =>
        source$.pipe(
            mergeMap(options => {
                const { duration } = options;
                const toastId = this._pop(options);

                if (duration) {
                    return of(setTimeout(() => this._unPop(toastId), duration));
                }

                return of(null);
            })
        )
    );

    /**
     * Removes a toast with the given id
     * @param toastId the id of the toast to be removed
     */
    private _unPop(toastId: number) {
        const index = this.activeToasts.findIndex(x => x.id === toastId);

        if (index === -1) {
            return;
        }

        this.activeToasts.splice(index, 1);
        this.toastEvents$.next(ToastEvent.ACTIVE_TOAST_UPDATE);
        return this.toastRef;
    }

    /**
     * Pops a toast with the given options
     * @param popOptions the options to pop the toast with
     * @returns the toasts id
     */
    private _pop(popOptions: PopOptions): number {
        this.toastRef++;
        const toastOptions: ToastOptions = { ...popOptions, id: this.toastRef };

        this.activeToasts.push(toastOptions);
        this.toastEvents$.next(ToastEvent.ACTIVE_TOAST_UPDATE);
        return this.toastRef;
    }

    constructor() {
        super(DEFAULT_STATE);
    }
}

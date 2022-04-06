import { ComponentStore } from '@ngrx/component-store';
import { mergeMap, Observable, of } from 'rxjs';
import { PopOptions } from '../models/pop-options.model';

export interface ToasterStoreState {
    activeToasts: string[];
}

const DEFAULT_STATE = {
    activeToasts: [],
};

export class ToasterStore extends ComponentStore<ToasterStoreState> {
    /** Effects */

    readonly pop = this.effect((source$: Observable<PopOptions>) =>
        source$.pipe(
            mergeMap(options => {
                const { duration } = options;
                this._pop(options);

                if (duration && duration !== 0) {
                    return of(setTimeout(() => this._unPop(), duration));
                }

                return of(null);
            })
        )
    );

    private _unPop() {}

    private _pop(popOptions: PopOptions) {
        // this.patchState((state) => {state, [...state.activeToasts, ]})
    }

    constructor() {
        super(DEFAULT_STATE);
    }
}

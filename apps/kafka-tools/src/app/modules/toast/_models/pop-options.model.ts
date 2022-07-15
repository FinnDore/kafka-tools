import { ToastLevel } from '../_enums/toast-level';

/**
 * Options for popping a toast
 */
export interface PopOptions {
    level: ToastLevel;
    content: string;
    title?: string | null;
    duration?: number | null;
}

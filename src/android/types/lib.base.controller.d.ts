declare global {
    namespace android.lib.base {
        export interface Controller<T extends View> extends androme.lib.base.Controller<T> {
            renderColumnSpace(depth: number, width?: string, height?: string, columnSpan?: number): string;
        }

        export class Controller<T extends View> implements Controller<T> {}
    }
}

export {};
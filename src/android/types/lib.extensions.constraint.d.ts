type View = android.lib.base.View;

declare global {
    namespace android.lib.extensions.constraint {
        export class Guideline<T extends View> extends androme.lib.base.Extension<T> {}
    }
}

export {};
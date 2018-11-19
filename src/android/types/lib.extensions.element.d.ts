type View = android.lib.base.View;

declare global {
    namespace android.lib.extensions.element {
        export class Custom<T extends View> extends androme.lib.base.Extension<T> {}
    }
}

export {};
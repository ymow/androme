type View = android.lib.base.View;

declare global {
    namespace android.lib.extensions.delegate {
        export class Element<T extends View> extends androme.lib.base.Extension<T> {}

        export class ScrollBar<T extends View> extends androme.lib.base.Extension<T> {}

        export class VerticalAlign<T extends View> extends androme.lib.base.Extension<T> {}
    }
}

export {};
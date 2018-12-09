type View = android.lib.base.View;

declare global {
    namespace android.lib.extensions.delegate {
        export class Element<T extends View> extends androme.lib.base.Extension<T> {}

        export class MaxWidthHeight<T extends View> extends androme.lib.base.Extension<T> {}

        export class Percent<T extends View> extends androme.lib.base.Extension<T> {}

        export class RadioGroup<T extends View> extends androme.lib.base.Extension<T> {}

        export class ScrollBar<T extends View> extends androme.lib.base.Extension<T> {}
    }
}

export {};
type View = android.lib.base.View;

declare global {
    namespace android.lib.extensions.resource {
        export class Dimens<T extends View> extends androme.lib.base.Extension<T> {}
        export class Styles<T extends View> extends androme.lib.base.Extension<T> {}
        export class Svg<T extends View> extends androme.lib.base.Extension<T> {}
    }
}

export {};
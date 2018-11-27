type View = android.lib.base.View;

declare global {
    namespace android.lib.extensions.resource {
        export class Background<T extends View> extends androme.lib.base.Extension<T> {}

        export class Dimens<T extends View> extends androme.lib.base.Extension<T> {}

        export class Fonts<T extends View> extends androme.lib.base.Extension<T> {}

        export class Includes<T extends View> extends androme.lib.base.Extension<T> {}

        export class Strings<T extends View> extends androme.lib.base.Extension<T> {}

        export class Styles<T extends View> extends androme.lib.base.Extension<T> {}

        export class Svg<T extends View> extends androme.lib.base.Extension<T> {}
    }
}

export {};
type View = android.lib.base.View;

declare global {
    namespace android.lib.extensions {
        export class Accessibility<T extends View> extends androme.lib.extensions.Accessibility<T> {}

        export class CssGrid<T extends View> extends androme.lib.extensions.CssGrid<T> {}

        export class External<T extends View> extends androme.lib.extensions.External<T> {}

        export class Grid<T extends View> extends androme.lib.extensions.Grid<T> {}

        export class List<T extends View> extends androme.lib.extensions.List<T> {}

        export class Sprite<T extends View> extends androme.lib.extensions.Sprite<T> {}

        export class Table<T extends View> extends androme.lib.extensions.Table<T> {}

        export class VerticalAlign<T extends View> extends androme.lib.extensions.VerticalAlign<T> {}

        export class WhiteSpace<T extends View> extends androme.lib.extensions.WhiteSpace<T> {}
    }
}

export {};
type View = android.lib.base.View;

declare global {
    namespace android.lib.extensions.resource {
        export class Accessibility<T extends View> extends androme.lib.extensions.Accessibility<T> {}
        export class CssGrid<T extends View> extends androme.lib.extensions.CssGrid<T> {}
        export class Custom<T extends View> extends androme.lib.extensions.Custom<T> {}
        export class External<T extends View> extends androme.lib.extensions.External<T> {}
        export class Grid<T extends View> extends androme.lib.extensions.Grid<T> {}
        export class List<T extends View> extends androme.lib.extensions.List<T> {}
        export class Origin<T extends View> extends androme.lib.extensions.Origin<T> {}
        export class Percent<T extends View> extends androme.lib.extensions.Percent<T> {}
        export class Sprite<T extends View> extends androme.lib.extensions.Sprite<T> {}
        export class Table<T extends View> extends androme.lib.extensions.Table<T> {}
    }
}

export {};
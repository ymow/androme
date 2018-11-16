import { Constraint, LocalSettings } from './module';

declare global {
    namespace android.lib.base {
        export interface View extends androme.lib.base.Node {
            readonly constraint: Constraint;
            readonly renderChildren: View[];
            readonly stringId: string;
            readonly anchored: boolean;
            readonly localSettings: LocalSettings;
            android(attr: string, value?: string, overwrite?: boolean);
            app(attr: string, value?: string, overwrite?: boolean);
            formatted(value: string, overwrite?: boolean): void;
            mergeGravity(attr: string, ...alignment: string[]): string;
            anchor(position: string, adjacent?: string, orientation?: string, overwrite?: boolean): void;
            anchorParent(position: string): boolean;
            anchorSibling(position: string): string;
            anchorDelete(...position: string[]): void;
            horizontalBias(): number;
            verticalBias(): number;
            supported(obj: string, attr: string, result?: {}): boolean;
            combine(...objs: string[]): string[];
        }

        export class View implements View {
            public static documentBody(): View;
            public static getCustomizationValue(api: number, tagName: string, obj: string, attr: string): string;
            public static getControlName(nodeType: number): string;
            constructor(id: number, element?: Element, afterInit?: SelfWrapped<View, void>);
        }

        export class ViewGroup<T extends View> extends View {}
    }
}

export {};
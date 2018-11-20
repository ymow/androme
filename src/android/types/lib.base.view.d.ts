import { Constraint, LocalSettings } from './module';

declare global {
    namespace android.lib.base {
        export interface View extends androme.lib.base.Node {
            anchored: boolean;
            readonly constraint: Constraint;
            readonly stringId: string;
            readonly localSettings: LocalSettings;
            android(attr: string, value?: string, overwrite?: boolean);
            app(attr: string, value?: string, overwrite?: boolean);
            formatted(value: string, overwrite?: boolean): void;
            mergeGravity(attr: string, ...alignment: string[]): string;
            anchor(position: string, stringId?: string, overwrite?: boolean): void;
            anchorParent(orientation: string, overwrite?: boolean, constraintBias?: boolean): void;
            anchorDelete(...position: string[]): void;
            alignParent(position: string): boolean;
            alignSibling(position: string): string;
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
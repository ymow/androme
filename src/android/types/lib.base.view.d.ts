import { Constraint, LocalSettings } from './local';

declare global {
    namespace android.lib.base {
        export interface View extends androme.lib.base.Node {
            constraint: Constraint;
            readonly stringId: string;
            readonly anchored: boolean;
            readonly localSettings: LocalSettings;
            android(attr: string, value?: string, overwrite?: boolean);
            app(attr: string, value?: string, overwrite?: boolean);
            formatted(value: string, overwrite?: boolean): void;
            anchor(position: string, adjacent?: string, orientation?: string, overwrite?: boolean): void;
            alignParent(position: string): boolean;
            horizontalBias(): number;
            verticalBias(): number;
            supported(obj: string, attr: string, result?: {}): boolean;
            combine(...objs: string[]): string[];
        }
        export class View {
            public static documentBody(): View;
            public static getCustomizationValue(api: number, tagName: string, obj: string, attr: string): string;
            public static getControlName(nodeType: number): string;
            constructor(id: number, element?: Element, afterInit?: SelfWrapped<View, void>);
        }
        export class ViewGroup<T extends View> extends View {}
    }
}

export {};
import { Constraint, LocalSettings } from './local';

declare global {
    namespace android.lib.base {
        export class View extends androme.lib.base.Node {
            public static documentBody(): View;
            public static getCustomizationValue(api: number, tagName: string, obj: string, attr: string): string;
            public static getControlName(nodeType: number): string;
            public constraint: Constraint;
            public readonly stringId: string;
            public readonly anchored: boolean;
            public readonly localSettings: LocalSettings;
            constructor(id: number, element?: Element, afterInit?: SelfWrapped<View, void>);
            public android(attr: string, value?: string, overwrite?: boolean);
            public app(attr: string, value?: string, overwrite?: boolean);
            public formatted(value: string, overwrite?: boolean): void;
            public anchor(position: string, adjacent?: string, orientation?: string, overwrite?: boolean): void;
            public alignParent(position: string): boolean;
            public horizontalBias(): number;
            public verticalBias(): number;
            public supported(obj: string, attr: string, result?: {}): boolean;
            public combine(...objs: string[]): string[];
        }
        export class ViewGroup<T extends View> extends View {}
    }
}

export {};
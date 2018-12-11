import { Constraint, LocalSettings } from './module';

declare global {
    namespace android.lib.base {
        export interface View extends androme.lib.base.Node {
            anchored: boolean;
            readonly constraint: Constraint;
            readonly localSettings: LocalSettings;
            readonly documentId: string;
            readonly layoutFrame: boolean;
            readonly layoutLinear: boolean;
            readonly layoutRelative: boolean;
            readonly layoutConstraint: boolean;
            readonly singleChild: boolean;
            readonly absoluteParent: androme.lib.base.Node;
            android(attr: string, value?: string, overwrite?: boolean): string;
            app(attr: string, value?: string, overwrite?: boolean): string;
            formatted(value: string, overwrite?: boolean): void;
            mergeGravity(attr: string, ...alignment: string[]): string;
            anchor(position: string, documentId?: string, overwrite?: boolean): void;
            anchorParent(orientation: string, overwrite?: boolean, constraintBias?: boolean): void;
            anchorDelete(...position: string[]): void;
            alignSibling(position: string): string;
            horizontalBias(): number;
            verticalBias(): number;
            supported(obj: string, attr: string, result?: {}): boolean;
            combine(...objs: string[]): string[];
            setBoxSpacing(): void;
        }

        export class View implements View {
            public static documentBody(): View;
            public static getCustomizationValue(api: number, tagName: string, obj: string, attr: string): string;
            public static getControlName(containerType: number): string;
            constructor(id: number, element?: Element | null, afterInit?: SelfWrapped<View, void>);
        }

        export class ViewGroup<T extends View> extends View {}
    }
}

export {};
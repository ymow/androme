import { UserSettingsAndroid } from './module';

declare global {
    namespace android.lib.base {
        export interface Controller<T extends View> extends androme.lib.base.Controller<T> {
            readonly userSettings: UserSettingsAndroid;
            checkFrameHorizontal(data: androme.lib.base.Layout<T>): boolean;
            checkConstraintFloat(data: androme.lib.base.Layout<T>): boolean;
            checkConstraintHorizontal(data: androme.lib.base.Layout<T>): boolean;
            checkRelativeHorizontal(data: androme.lib.base.Layout<T>): boolean;
            renderSpace(depth: number, width: string, height?: string, columnSpan?: number, rowSpan?: number): string;
            addGuideline(node: T, parent: T, orientation?: string, percent?: boolean, opposite?: boolean): void;
        }

        export class Controller<T extends View> implements Controller<T> {
            public static evaluateAnchors<T extends View>(nodes: T[]): void;
            public static dimensionConstraint<T extends View>(node: T): void;
            public static dimensionFlexbox<T extends View>(node: T, horizontal: boolean): void;
        }
    }
}

export {};
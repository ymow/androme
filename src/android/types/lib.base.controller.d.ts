declare global {
    namespace android.lib.base {
        export interface Controller<T extends View> extends androme.lib.base.Controller<T> {
            renderColumnSpace(depth: number, width?: string, height?: string, columnSpan?: number): string;
            addGuideline(node: T, orientation?: string, percent?: boolean, opposite?: boolean): void;
        }

        export class Controller<T extends View> implements Controller<T> {
            public static getEnclosingTag(controlName: string, id: number, depth: number, xml?: string, preXml?: string, postXml?: string): string;
        }
    }
}

export {};
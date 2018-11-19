import Application from './application';
import Node from './node';
import NodeList from './nodelist';

export default abstract class Controller<T extends Node> implements androme.lib.base.Controller<T> {
    public static partitionHorizontal<T extends Node>(list: T[], parent?: T) {
        const cleared = parent && this.clearedElement(parent) && NodeList.cleared(list);
        const result: T[][] = [];
        let row: T[] = [];
        for (let i = 0; i < list.length; i++) {
            const node = list[i];
            const previous = node.previousSibling() as T;
            if (i === 0 || previous === null) {
                row.push(node);
            }
            else {
                if (node.alignedVertically(previous, cleared)) {
                    result.push(row);
                    row = [node];
                }
                else {
                    row.push(node);
                }
                if (i === list.length - 1) {
                    result.push(row);
                }
            }
        }
        return result;
    }

    public static alignRowPrevious<T extends Node>(list: T[], node: T, maxBottom?: number) {
        const result: T[] = [];
        const preferred: T[] = [];
        if (maxBottom) {
            list = list.filter(item => item.linear.bottom === maxBottom);
        }
        for (let i = 0; i < list.length; i++) {
            const above = list[i];
            if (node.intersectY(above.linear)) {
                if (maxBottom === undefined) {
                    if (node.linear.top >= above.linear.bottom) {
                        result.push(above);
                    }
                }
                else {
                    if (maxBottom === above.linear.bottom) {
                        preferred.push(above);
                    }
                }
            }
            else {
                if (maxBottom === above.linear.bottom) {
                    result.push(above);
                }
            }
        }
        return preferred.length > 0 ? preferred : result;
    }

    public static clearedElement<T extends Node>(parent: T) {
        const documentParent = parent.filter(item => item.siblingflow).map(item => item.documentParent);
        if (documentParent.length > 0) {
            if (new Set(documentParent).size !== 1) {
                return undefined;
            }
            else {
                return NodeList.cleared(Array.from(documentParent[0].baseElement.children).map((element: Element) => Node.getNodeFromElement(element) as T).filter(item => item));
            }
        }
        return new Map<T, string>();
    }

    public cache: NodeList<T>;
    public application: Application<T>;
    public abstract settings: Settings;
    public abstract readonly localSettings: ControllerSettings;

    private _before: ObjectIndex<string[]> = {};
    private _after: ObjectIndex<string[]> = {};

    public abstract createGroup(parent: T, node: T, children: T[]): T;
    public abstract renderGroup(node: T, parent: T, nodeType: number, options?: {}): string;
    public abstract renderNode(node: T, parent: T, nodeType: number, options?: {}): string;
    public abstract renderNodeStatic(controlName: string, depth: number, options?: {}, width?: string, height?: string, node?: T, children?: boolean): string;
    public abstract renderInclude(node: T, parent: T, name: string): string;
    public abstract renderMerge(name: string, content: string[]): string;
    public abstract renderColumnSpace(depth: number, width?: string, height?: string, columnSpan?: number): string;
    public abstract baseRenderDepth(name: string): number;
    public abstract setConstraints(): void;
    public abstract finalize(viewData: ViewData<NodeList<T>>);
    public abstract get delegateNodeInit(): SelfWrapped<T, void>;

    public reset() {
        this._before = {};
        this._after = {};
    }

    public replaceRenderQueue(output: string) {
        for (const id in this._before) {
            output = output.replace(`{<${id}}`, this._before[id].join(''));
        }
        for (const id in this._after) {
            output = output.replace(`{>${id}}`, this._after[id].join(''));
        }
        return output;
    }

    public prependBefore(id: number, output: string, index = -1) {
        if (this._before[id] === undefined) {
            this._before[id] = [];
        }
        if (index !== -1 && index < this._before[id].length) {
            this._before[id].splice(index, 0, output);
        }
        else {
            this._before[id].push(output);
        }
    }

    public appendAfter(id: number, output: string, index = -1) {
        if (this._after[id] === undefined) {
            this._after[id] = [];
        }
        if (index !== -1 && index < this._after[id].length) {
            this._after[id].splice(index, 0, output);
        }
        else {
            this._after[id].push(output);
        }
    }

    public hasAppendProcessing(id: number) {
        return this._before[id] !== undefined || this._after[id] !== undefined;
    }
}
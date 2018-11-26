import { ELEMENT_MAP } from '../lib/constant';

import Application from './application';
import Layout from './layout';
import Node from './node';
import NodeList from './nodelist';

export default abstract class Controller<T extends Node> implements androme.lib.base.Controller<T> {
    public static getContainerType(tagName: string) {
        return ELEMENT_MAP[tagName] || 0;
    }

    public abstract userSettings: UserSettings;

    public abstract readonly localSettings: ControllerSettings;

    public application: Application<T>;
    public cache: NodeList<T>;

    private _before: ObjectIndex<string[]> = {};
    private _after: ObjectIndex<string[]> = {};

    public abstract checkConstraintFloat(parent: T, nodes: T[], floated?: Set<string>, cleared?: Map<T, string>, linearX?: boolean): boolean;
    public abstract checkConstraintHorizontal(parent: T, nodes: T[], floated?: Set<string>, cleared?: Map<T, string>, linearX?: boolean): boolean;
    public abstract checkRelativeHorizontal(parent: T, nodes: T[], floated?: Set<string>, cleared?: Map<T, string>, linearX?: boolean): boolean;
    public abstract checkFrameHorizontal(parent: T, nodes: T[], floated?: Set<string>, cleared?: Map<T, string>, linearX?: boolean): boolean;
    public abstract setConstraints(): void;
    public abstract createNodeGroup(node: T, parent: T, children: T[]): T;
    public abstract renderNode(data: Layout<T>): string;
    public abstract renderNodeGroup(data: Layout<T>): string;
    public abstract renderNodeStatic(controlName: string, depth: number, options?: {}, width?: string, height?: string, node?: T, children?: boolean): string;
    public abstract finalize(data: SessionData<NodeList<T>>);
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
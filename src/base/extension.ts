import { ExtensionDependency, ExtensionResult, IExtension, Null, ObjectIndex, ObjectMap } from '../lib/types';
import Application from './application';
import Node from './node';
import NodeList from './nodelist';

export default abstract class Extension<T extends Node, U extends NodeList<T>> implements IExtension {
    public application: Application<T, U>;
    public node: T;
    public parent: Null<T>;
    public element: Null<HTMLElement>;
    public options: ObjectMap<any> = {};
    public tagNames: string[] = [];
    public enabled = true;
    public dependencies: ExtensionDependency[] = [];
    public activityMain = false;

    constructor(
        public name: string,
        tagNames?: string[],
        options?: ObjectMap<any>)
    {
        if (Array.isArray(tagNames)) {
            this.tagNames = tagNames.map(value => value.trim().toUpperCase());
        }
        if (options != null) {
            Object.assign(this.options, options);
        }
    }

    public setTarget(node: T, parent?: Null<T>, element?: Null<HTMLElement>) {
        this.node = (<T> node);
        this.parent = parent;
        this.element = (element == null && this.node != null ? this.node.element : element);
    }

    public is(node: T) {
        return (node.hasElement && (this.tagNames.length === 0 || this.tagNames.includes(node.element.tagName)));
    }

    public require(value: string, init = false) {
        this.dependencies.push({ name: value, init });
    }

    public included(element?: HTMLElement) {
        if (element == null) {
            element = (<HTMLElement> this.element);
        }
        return (element != null && element.dataset && element.dataset.ext != null ? element.dataset.ext.split(',').map(value => value.trim()).includes(this.name) : false);
    }

    public beforeInit(internal = false) {
        if (!internal && this.included()) {
            this.dependencies.filter(item => item.init).forEach(item => {
                const extension = this.application.findExtension(item.name);
                if (extension != null) {
                    extension.setTarget(this.node, this.parent, this.element);
                    extension.beforeInit(true);
                }
            });
        }
    }

    public init(element: HTMLElement) {
        return false;
    }

    public afterInit(internal = false) {
        if (!internal && this.included()) {
            this.dependencies.filter(item => item.init).forEach(item => {
                const extension = this.application.findExtension(item.name);
                if (extension != null) {
                    extension.setTarget(this.node, this.parent, this.element);
                    extension.afterInit(true);
                }
            });
        }
    }

    public condition() {
        if (this.node && this.node.hasElement && this.node.element.dataset != null) {
            if (!this.node.element.dataset.ext) {
                return (this.tagNames.length > 0);
            }
            else {
                const extensions = this.node.element.dataset.ext.split(',');
                return (this.tagNames.length === 0 && extensions.length > 1 ? false : this.included());
            }
        }
        return false;
    }

    public processNode(mapX?: ObjectIndex<ObjectIndex<T[]>>, mapY?: ObjectIndex<ObjectIndex<T[]>>): ExtensionResult {
        return { xml: '' };
    }

    public processChild(mapX?: ObjectIndex<ObjectIndex<T[]>>, mapY?: ObjectIndex<ObjectIndex<T[]>>): ExtensionResult {
        return { xml: '', proceed: this.application.elements.has(this.node.element) };
    }

    public afterRender() {
        return;
    }

    public insert() {
        return;
    }

    public afterInsert() {
        return;
    }

    public finalize() {
        return;
    }
}
import Node from './node';
import Application from './application';

import { includes } from '../lib/util';
import { isStyleElement } from '../lib/dom';

export default abstract class Extension<T extends Node> implements androme.lib.base.Extension<T> {
    public application: Application<T>;
    public tagNames: string[] = [];
    public documentRoot = false;
    public eventOnly = false;
    public readonly options: ExternalData = {};
    public readonly dependencies: ExtensionDependency[] = [];
    public readonly subscribers = new Set<T>();
    public readonly subscribersChild = new Set<T>();

    protected constructor(
        public readonly name: string,
        public readonly framework: number,
        tagNames?: string[],
        options?: ExternalData)
    {
        if (Array.isArray(tagNames)) {
            this.tagNames = tagNames.map(value => value.trim().toUpperCase());
        }
        if (options) {
            Object.assign(this.options, options);
        }
    }

    public is(node: T) {
        return this.tagNames.length === 0 || this.tagNames.includes(node.tagName);
    }

    public require(value: string, preload = false) {
        this.dependencies.push({
            name: value,
            preload
        });
    }

    public included(element: HTMLElement) {
        return includes(element.dataset.ext, this.name);
    }

    public beforeInit(element: HTMLElement, internal = false) {
        if (!internal && this.included(element)) {
            this.dependencies.filter(item => item.preload).forEach(item => {
                const ext = this.application.getExtension(item.name);
                if (ext) {
                    ext.beforeInit(element, true);
                }
            });
        }
    }

    public init(element: HTMLElement) {
        return false;
    }

    public afterInit(element: HTMLElement, internal = false) {
        if (!internal && this.included(element)) {
            this.dependencies.filter(item => item.preload).forEach(item => {
                const ext = this.application.getExtension(item.name);
                if (ext) {
                    ext.afterInit(element, true);
                }
            });
        }
    }

    public condition(node: T, parent?: T) {
        if (isStyleElement(node.element)) {
            const ext = node.dataset.ext;
            if (!ext) {
                return this.tagNames.length > 0;
            }
            else {
                return this.included(node.element);
            }
        }
        return false;
    }

    public processNode(node: T, parent: T, mapX?: LayoutMapX<T>, mapY?: LayoutMapY<T>): ExtensionResult<T> {
        return { output: '', complete: false };
    }

    public processChild(node: T, parent: T, mapX?: LayoutMapX<T>, mapY?: LayoutMapY<T>): ExtensionResult<T> {
        return { output: '', complete: false };
    }

    public postRenderElement(node: T) {}
    public postRenderDocument(node: T) {}
    public postProcedure(node: T) {}

    public beforeRenderDocument() {}
    public afterRenderElement() {}
    public afterConstraints() {}
    public afterResources() {}
    public afterRenderDocument() {}
    public afterProcedure() {}
    public afterFinalize() {}

    public get loaded() {
        return this.application ? this.application.getExtension(this.name) !== null : false;
    }
}

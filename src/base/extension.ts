import Application from './application';
import Node from './node';

import { isStyleElement } from '../lib/dom';
import { includes } from '../lib/util';

export default abstract class Extension<T extends Node> implements androme.lib.base.Extension<T> {
    public application: Application<T>;
    public tagNames: string[] = [];
    public documentRoot = false;
    public eventOnly = false;
    public preloaded = false;

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

    public require(name: string, preload = false) {
        this.dependencies.push({
            name,
            preload
        });
    }

    public included(element: HTMLElement) {
        return includes(element.dataset.import, this.name);
    }

    public beforeInit(element: HTMLElement, internal = false) {
        if (!internal && this.included(element)) {
            this.dependencies.filter(item => item.preload).forEach(item => {
                const ext = this.application.getExtension(item.name);
                if (ext && !ext.preloaded) {
                    ext.beforeInit(element, true);
                    ext.preloaded = true;
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
                if (ext && ext.preloaded) {
                    ext.afterInit(element, true);
                    ext.preloaded = false;
                }
            });
        }
    }

    public condition(node: T, parent?: T) {
        if (isStyleElement(node.element)) {
            const ext = node.dataset.import;
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

    public postBaseLayout(node: T) {}
    public postConstraints(node: T) {}
    public postParseDocument(node: T) {}
    public postProcedure(node: T) {}

    public beforeParseDocument() {}
    public afterDepthLevel() {}
    public afterBaseLayout() {}
    public afterConstraints() {}
    public afterResources() {}
    public afterParseDocument() {}
    public afterProcedure() {}
    public afterFinalize() {}

    public get installed() {
        return this.application ? this.application.extensions.has(this) : false;
    }
}

import { APP_SECTION, BOX_STANDARD, NODE_ALIGNMENT, NODE_CONTAINER, NODE_PROCEDURE, NODE_RESOURCE, USER_AGENT } from '../lib/enumeration';

import Controller from './controller';
import Extension from './extension';
import Layout from './layout';
import Node from './node';
import NodeList from './nodelist';
import Resource from './resource';

import { cssParent, cssResolveUrl, deleteElementCache, getElementCache, getLastChildElement, getStyle, hasFreeFormText, isElementVisible, isPlainText, isStyleElement, isUserAgent, setElementCache } from '../lib/dom';
import { convertCamelCase, convertPX, convertWord, hasBit, hasValue, isNumber, isPercent, isString, maxArray, resolvePath, sortAsc, trimNull, trimString } from '../lib/util';
import { formatPlaceholder, replaceIndent, replacePlaceholder } from '../lib/xml';

function prioritizeExtensions<T extends Node>(documentRoot: HTMLElement, element: HTMLElement, extensions: Extension<T>[]) {
    const tagged: string[] = [];
    let current: HTMLElement | null = element;
    do {
        if (current.dataset.import) {
            tagged.push(...current.dataset.import.split(',').map(value => value.trim()));
        }
        current = current !== documentRoot ? current.parentElement : null;
    }
    while (current);
    if (tagged.length) {
        const result: Extension<T>[] = [];
        const untagged: Extension<T>[] = [];
        for (const item of extensions) {
            const index = tagged.indexOf(item.name);
            if (index !== -1) {
                result[index] = item;
            }
            else {
                untagged.push(item);
            }
        }
        return [...result.filter(item => item), ...untagged];
    }
    else {
        return extensions;
    }
}

function checkPositionStatic<T extends Node>(node: T, parent: T) {
    const nextSiblings = node.nextSiblings();
    if (node.positionAuto && (node.element === getLastChildElement(parent.element) || nextSiblings.length && nextSiblings.every(item => item.blockStatic || item.lineBreak || item.excluded))) {
        node.css({
            'position': 'static',
            'display': 'inline-block',
            'verticalAlign': 'top'
        });
        node.unsetCache();
        return true;
    }
    return false;
}

export default class Application<T extends Node> implements androme.lib.base.Application<T> {
    public viewController: Controller<T>;
    public resourceHandler: Resource<T>;
    public nodeObject: Constructor<T>;
    public loading = false;
    public closed = false;

    public readonly builtInExtensions: ObjectMap<Extension<T>> = {};
    public readonly extensions = new Set<Extension<T>>();
    public readonly parseElements = new Set<HTMLElement>();

    public readonly session: AppSession<T, NodeList<T>> = {
        cache: new NodeList<T>(),
        image: new Map<string, ImageAsset>(),
        renderQueue: new Map<string, string[]>(),
        excluded: []
    };

    public readonly processing: AppProcessing<T, NodeList<T>> = {
        cache: new NodeList<T>(),
        depthMap: new Map<string, Map<number, string>>(),
        node: null,
        layout: null,
        excluded: []
    };

    private _userSettings: UserSettings;
    private _cacheRoot = new Set<Element>();
    private _renderPosition = new Map<number, T[]>();
    private _renderPositionReverseMap = new Map<number, T>();

    private readonly _views: FileAsset[] = [];
    private readonly _includes: FileAsset[] = [];

    constructor(public readonly framework: number) {
    }

    public registerController(controller: Controller<T>) {
        controller.application = this;
        controller.cache = this.processing.cache;
        this.viewController = controller;
    }

    public registerResource(resource: Resource<T>) {
        resource.application = this;
        resource.cache = this.processing.cache;
        this.resourceHandler = resource;
    }

    public installExtension(ext: Extension<T>) {
        const found = this.getExtension(ext.name);
        if (found) {
            if (Array.isArray(ext.tagNames)) {
                found.tagNames = ext.tagNames;
            }
            Object.assign(found.options, ext.options);
            return true;
        }
        else {
            if ((ext.framework === 0 || hasBit(ext.framework, this.framework)) && ext.dependencies.every(item => !!this.getExtension(item.name))) {
                ext.application = this;
                this.extensions.add(ext);
                return true;
            }
        }
        return false;
    }

    public removeExtension(ext: Extension<T>) {
        return this.extensions.delete(ext);
    }

    public finalize() {
        const nodes = this.session.cache.filter(node => node.visible && node.rendered && !node.hasAlign(NODE_ALIGNMENT.SPACE));
        for (const node of nodes) {
            if (!node.hasBit('excludeProcedure', NODE_PROCEDURE.LAYOUT)) {
                node.setLayout();
            }
            if (!node.hasBit('excludeProcedure', NODE_PROCEDURE.ALIGNMENT)) {
                node.setAlignment();
            }
        }
        for (const node of nodes) {
            if (!node.hasBit('excludeProcedure', NODE_PROCEDURE.OPTIMIZATION)) {
                node.applyOptimizations();
            }
            if (!node.hasBit('excludeProcedure', NODE_PROCEDURE.CUSTOMIZATION)) {
                node.applyCustomizations();
            }
        }
        for (const ext of this.extensions) {
            for (const node of ext.subscribers) {
                ext.postProcedure(node);
            }
        }
        for (const ext of this.extensions) {
            ext.afterProcedure();
        }
        this.processRenderQueue();
        this.resourceHandler.finalize(this.sessionData);
        this.viewController.finalize(this.sessionData);
        for (const ext of this.extensions) {
            ext.afterFinalize();
        }
        this.closed = true;
    }

    public saveAllToDisk() {
        this.resourceHandler.fileHandler.saveAllToDisk(this.sessionData);
    }

    public reset() {
        this.session.cache.each(node => node.domElement && deleteElementCache(node.element, 'node', 'style', 'styleMap', 'inlineSupport'));
        for (const element of this._cacheRoot as Set<HTMLElement>) {
            delete element.dataset.iteration;
            delete element.dataset.layoutName;
        }
        this.appName = '';
        this.session.renderQueue.clear();
        this.session.image.clear();
        this.session.cache.reset();
        this.session.excluded = [];
        this.processing.cache.reset();
        this.viewController.reset();
        this.resourceHandler.reset();
        this._cacheRoot.clear();
        this._views.length = 0;
        this._includes.length = 0;
        this._renderPosition.clear();
        this._renderPositionReverseMap.clear();
        for (const ext of this.extensions) {
            ext.subscribers.clear();
            ext.subscribersChild.clear();
        }
        this.closed = false;
    }

    public parseDocument(...elements: any[]): FunctionMap<void> {
        let __THEN: () => void;
        this.parseElements.clear();
        this.loading = false;
        this.setStyleMap();
        if (this.appName === '' && elements.length === 0) {
            elements.push(document.body);
        }
        for (const item of elements) {
            const element = typeof item === 'string' ? document.getElementById(item) : item;
            if (element && isStyleElement(element)) {
                this.parseElements.add(element);
            }
        }
        const documentRoot = this.parseElements.values().next().value;
        const parseResume = () => {
            this.loading = false;
            if (this.userSettings.preloadImages) {
                Array.from(documentRoot.getElementsByClassName('androme.preload')).forEach(element => documentRoot.removeChild(element));
            }
            for (const [uri, image] of this.session.image.entries()) {
                Resource.ASSETS.images.set(uri, image);
            }
            for (const ext of this.extensions) {
                ext.beforeParseDocument();
            }
            for (const element of this.parseElements as Set<HTMLElement>) {
                if (this.appName === '') {
                    this.appName = element.id || 'untitled';
                }
                let filename = trimNull(element.dataset.filename).replace(new RegExp(`\.${this.viewController.localSettings.layout.fileExtension}$`), '');
                if (filename === '') {
                    filename = element.id || `document_${this.size}`;
                }
                const iteration = parseInt(element.dataset.iteration || '0') + 1;
                element.dataset.iteration = iteration.toString();
                element.dataset.layoutName = convertWord(iteration > 1 ? `${filename}_${iteration}` : filename);
                if (this.createCache(element)) {
                    this.setBaseLayout();
                    this.setConstraints();
                    this.setResources();
                    this._cacheRoot.add(element);
                }
            }
            for (const ext of this.extensions) {
                for (const node of ext.subscribers) {
                    ext.postParseDocument(node);
                }
            }
            for (const ext of this.extensions) {
                ext.afterParseDocument();
            }
            if (typeof __THEN === 'function') {
                __THEN.call(this);
            }
        };
        if (this.userSettings.preloadImages) {
            Array.from(this.parseElements).forEach(element => {
                element.querySelectorAll('svg image').forEach((image: SVGImageElement) => {
                    if (image.href) {
                        const uri = resolvePath(image.href.baseVal);
                        if (uri) {
                            this.session.image.set(uri, {
                                width: image.width.baseVal.value,
                                height: image.height.baseVal.value,
                                uri
                            });
                        }
                    }
                });
            });
            for (const image of this.session.image.values()) {
                if (image.width === 0 && image.height === 0 && image.uri) {
                    const imageElement = <HTMLImageElement> document.createElement('IMG');
                    imageElement.src = image.uri;
                    if (imageElement.complete && imageElement.naturalWidth > 0 && imageElement.naturalHeight > 0) {
                        image.width = imageElement.naturalWidth;
                        image.height = imageElement.naturalHeight;
                    }
                    else {
                        imageElement.className = 'androme.preload';
                        imageElement.style.display = 'none';
                        documentRoot.appendChild(imageElement);
                    }
                }
            }
        }
        const images: HTMLImageElement[] = [];
        for (const element of this.parseElements) {
            Array.from(element.querySelectorAll('IMG')).forEach((image: HTMLImageElement) => {
                if (!(image instanceof SVGImageElement)) {
                    if (image.complete) {
                        this.addPreloadImage(image);
                    }
                    else {
                        images.push(image);
                    }
                }
            });
        }
        if (images.length === 0) {
            parseResume();
        }
        else {
            this.loading = true;
            Promise.all(images.map(image => {
                return new Promise((resolve, reject) => {
                    image.onload = resolve;
                    image.onerror = reject;
                });
            }))
            .then((result: Event[]) => {
                if (Array.isArray(result)) {
                    for (const item of result) {
                        try {
                            this.addPreloadImage(<HTMLImageElement> item.srcElement);
                        }
                        catch {
                        }
                    }
                }
                parseResume();
            })
            .catch((error: Event) => {
                const message = error.srcElement ? (<HTMLImageElement> error.srcElement).src : '';
                if (!hasValue(message) || confirm(`FAIL: ${message}`)) {
                    parseResume();
                }
            });
        }
        return {
            then: (resolve: () => void) => {
                if (this.loading) {
                    __THEN = resolve;
                }
                else {
                    resolve();
                }
            }
        };
    }

    public renderNode(layout: Layout<T>) {
        if (layout.itemCount === 0) {
            return this.viewController.renderNode(layout);
        }
        else {
            this.setRenderPosition(layout.node);
            return this.viewController.renderNodeGroup(layout);
        }
    }

    public addLayoutFile(filename: string, content: string, pathname?: string, documentRoot = false) {
        pathname = pathname || this.viewController.localSettings.layout.pathName;
        const layout: FileAsset = {
            pathname,
            filename,
            content
        };
        if (documentRoot && this._views.length && this._views[0].content === '') {
            this._views[0] = layout;
        }
        else {
            this._views.push(layout);
        }
        this.processing.layout = layout;
    }

    public addIncludeFile(filename: string, content: string) {
        this._includes.push({
            pathname: this.viewController.localSettings.layout.pathName,
            filename,
            content
        });
    }

    public addRenderTemplate(node: T, parent: T, output: string, group = false) {
        if (output !== '') {
            if (group) {
                node.renderChildren.some((item: T) => {
                    for (const templates of this.processing.depthMap.values()) {
                        let content = templates.get(item.id);
                        if (content) {
                            const indent = node.renderDepth + 1;
                            if (item.renderDepth !== indent) {
                                content = replaceIndent(content, indent);
                                item.renderDepth = indent;
                            }
                            templates.set(item.id, content);
                            return true;
                        }
                    }
                    return false;
                });
            }
            if (!this.parseElements.has(<HTMLElement> node.element)) {
                if (node.dataset.target) {
                    const target = document.getElementById(node.dataset.target);
                    if (target && target !== parent.element) {
                        this.addRenderQueue(node.dataset.target, [output]);
                        node.positioned = true;
                        return;
                    }
                }
                else if (parent.dataset.target) {
                    const target = document.getElementById(parent.dataset.target);
                    if (target) {
                        this.addRenderQueue(parent.controlId, [output]);
                        node.dataset.target = parent.controlId;
                        return;
                    }
                }
            }
            const key = parent.id + (node.renderPosition !== -1 ? `:${node.renderPosition}` : '');
            if (!this.processing.depthMap.has(key)) {
                this.processing.depthMap.set(key, new Map<number, string>());
            }
            const template = this.processing.depthMap.get(key);
            if (template) {
                template.set(node.id, output);
            }
        }
    }

    public addRenderQueue(id: string, templates: string[]) {
        const items = this.session.renderQueue.get(id) || [];
        items.push(...templates);
        this.session.renderQueue.set(id, items);
     }

    public addPreloadImage(element: HTMLImageElement) {
        if (element && element.complete && hasValue(element.src)) {
            this.session.image.set(element.src, {
                width: element.naturalWidth,
                height: element.naturalHeight,
                uri: element.src
            });
        }
    }

    public setRenderPosition(parent: T, node?: T) {
        let result: T[];
        const renderMap = this._renderPosition.get(parent.id);
        if (renderMap) {
            const filtered = node ? [node] : parent.duplicate() as T[];
            result = renderMap.filter(item => !filtered.includes(item));
            result.push(...filtered);
        }
        else {
            if (node) {
                result = [node];
            }
            else {
                result = parent.duplicate() as T[];
            }
        }
        const axisZ: T[] = [];
        const below: T[] = [];
        const middle: T[] = [];
        const above: T[] = [];
        for (const item of result) {
            const zIndex = item.toInt('zIndex');
            if (item.pageFlow || item.actualParent !== parent) {
                middle.push(item);
            }
            else {
                if (zIndex >= 0) {
                    above.push(item);
                }
                else {
                    below.push(item);
                }
            }
        }
        axisZ.push(...sortAsc(below, 'style.zIndex', 'id'));
        axisZ.push(...middle);
        axisZ.push(...sortAsc(above, 'style.zIndex', 'id'));
        this._renderPosition.set(parent.id, axisZ);
    }

    public getExtension(name: string) {
        return Array.from(this.extensions).find(item => item.name === name) || null;
    }

    public getExtensionOptionValue(name: string, attr: string) {
        const ext = this.getExtension(name);
        if (ext && typeof ext.options === 'object') {
            return ext.options[attr];
        }
        return undefined;
    }

    public getExtensionOptionValueAsObject(name: string, attr: string) {
        const value = this.getExtensionOptionValue(name, attr);
        if (typeof value === 'object') {
            return value as object;
        }
        return null;
    }

    public getExtensionOptionValueAsString(name: string, attr: string) {
        const value = this.getExtensionOptionValue(name, attr);
        return typeof value === 'string' ? value : '';
    }

    public getExtensionOptionValueAsNumber(name: string, attr: string) {
        const value = this.getExtensionOptionValue(name, attr);
        return typeof value === 'number' ? value : 0;
    }

    public getExtensionOptionValueAsBoolean(name: string, attr: string) {
        const value = this.getExtensionOptionValue(name, attr);
        return typeof value === 'boolean' ? value : false;
    }

    public toString() {
        return this._views.length ? this._views[0].content : '';
    }

    protected createCache(documentRoot: HTMLElement) {
        const settings = this.userSettings;
        let nodeTotal = 0;
        if (documentRoot === document.body) {
            Array.from(document.body.childNodes).some((item: Element) => isElementVisible(item, settings.hideOffScreenElements) && ++nodeTotal > 1);
        }
        const elements = documentRoot !== document.body ? documentRoot.querySelectorAll('*') : document.querySelectorAll(nodeTotal > 1 ? 'body, body *' : 'body *');
        this.processing.cache.delegateAppend = undefined;
        this.processing.cache.clear();
        this.processing.node = null;
        this.processing.excluded = [];
        for (const ext of this.extensions) {
            ext.beforeInit(documentRoot);
        }
        const nodeRoot = this.insertNode(documentRoot);
        if (nodeRoot) {
            nodeRoot.parent = new this.nodeObject(0, (documentRoot === document.body ? documentRoot : documentRoot.parentElement) || document.body, this.viewController.delegateNodeInit);
            nodeRoot.documentRoot = true;
            nodeRoot.documentParent = nodeRoot.parent;
            this.processing.node = nodeRoot;
        }
        else {
            return false;
        }
        const localSettings = this.viewController.localSettings;
        const inlineAlways = localSettings.inline.always;
        const inlineSupport = settings.renderInlineText ? new Set<string>() : localSettings.inline.tagName;
        function inlineElement(element: Element) {
            const styleMap = getElementCache(element, 'styleMap');
            return (
                (styleMap === undefined || Object.keys(styleMap).length === 0) &&
                element.children.length === 0 &&
                inlineSupport.has(element.tagName)
            );
        }
        for (const element of Array.from(elements) as HTMLElement[]) {
            if (!this.parseElements.has(element)) {
                prioritizeExtensions(documentRoot, element, Array.from(this.extensions)).some(item => item.init(element));
                if (!this.parseElements.has(element) && !localSettings.unsupported.tagName.has(element.tagName)) {
                    if (inlineAlways.includes(element.tagName) ||
                        inlineElement(element) && element.parentElement && Array.from(element.parentElement.children).every(item => inlineElement(item)))
                    {
                        setElementCache(element, 'inlineSupport', true);
                    }
                    let valid = true;
                    let current = element.parentElement;
                    while (current) {
                        if (current === documentRoot) {
                            break;
                        }
                        else if (current !== documentRoot && this.parseElements.has(current)) {
                            valid = false;
                            break;
                        }
                        current = current.parentElement;
                    }
                    if (valid) {
                        this.insertNode(element);
                    }
                }
            }
        }
        if (this.processing.cache.length) {
            for (const node of this.processing.cache) {
                const nodes: Element[] = [];
                let valid = false;
                Array.from(node.element.childNodes).forEach((element: Element) => {
                    if (element.nodeName === '#text') {
                        if (node.tagName !== 'SELECT') {
                            nodes.push(element);
                        }
                    }
                    else if (!inlineAlways.includes(element.tagName)) {
                        const item = Node.getElementAsNode(element);
                        if (!inlineSupport.has(element.tagName) || item && !item.excluded) {
                            valid = true;
                        }
                    }
                });
                if (valid) {
                    nodes.forEach(element => this.insertNode(element, node));
                }
            }
            const preAlignment: ObjectIndex<StringMap> = {};
            const direction = new Set<HTMLElement>();
            for (const node of this.processing.cache) {
                if (node.styleElement) {
                    const element = <HTMLElement> node.element;
                    const reset: StringMap = {};
                    const textAlign = node.css('textAlign');
                    ['right', 'end', element.tagName !== 'BUTTON' && (<HTMLInputElement> element).type !== 'button' ? 'center' : ''].some(value => {
                        if (value === textAlign) {
                            reset.textAlign = value;
                            element.style.textAlign = 'left';
                            return true;
                        }
                        return false;
                    });
                    if (node.pageFlow) {
                        ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].forEach(attr => {
                            const value = node.style[attr];
                            if (parseInt(value) < 0) {
                                reset[attr] = value;
                                element.style[attr] = '0px';
                            }
                        });
                    }
                    if (node.positionRelative && !node.positionStatic) {
                        ['top', 'right', 'bottom', 'left'].forEach(attr => {
                            if (node.has(attr)) {
                                reset[attr] = node.styleMap[attr];
                                element.style[attr] = 'auto';
                            }
                        });
                    }
                    if (node.overflowX || node.overflowY) {
                        if (node.has('width')) {
                            reset.width = node.styleMap.width;
                            element.style.width = 'auto';
                        }
                        if (node.has('height')) {
                            reset.height = node.styleMap.height;
                            element.style.height = 'auto';
                        }
                        reset.overflow = node.style.overflow || '';
                        element.style.overflow = 'visible';
                    }
                    if (element.dir === 'rtl') {
                        element.dir = 'ltr';
                        direction.add(element);
                    }
                    preAlignment[node.id] = reset;
                }
            }
            for (const node of this.processing.cache) {
                node.setBounds();
            }
            for (const node of this.processing.excluded) {
                node.setBounds();
            }
            for (const node of this.processing.cache) {
                if (node.styleElement) {
                    const reset = preAlignment[node.id];
                    if (reset) {
                        const element = <HTMLElement> node.element;
                        for (const attr in reset) {
                            element.style[attr] = reset[attr];
                        }
                        if (direction.has(element)) {
                            element.dir = 'rtl';
                        }
                    }
                }
            }
            for (const node of this.processing.cache) {
                if (!node.documentRoot) {
                    let parent = node.actualParent;
                    switch (node.position) {
                        case 'fixed': {
                            if (!node.positionAuto) {
                                parent = nodeRoot;
                                break;
                            }
                            else if (parent && checkPositionStatic(node, parent)) {
                                break;
                            }
                        }
                        case 'absolute': {
                            if (parent && checkPositionStatic(node, parent)) {
                                break;
                            }
                            else if (this.userSettings.supportNegativeLeftTop) {
                                let relativeParent: T | null = null;
                                let outside = false;
                                while (parent && (parent !== nodeRoot || parent.id !== 0)) {
                                    if (relativeParent === null) {
                                        if (!parent.positionStatic || parent.positionRelative) {
                                            relativeParent = parent as T;
                                            if (parent.css('overflow') === 'hidden') {
                                                break;
                                            }
                                            else {
                                                if (node.left < 0 && node.outsideX(parent.box) || node.top < 0 && node.outsideY(parent.box)) {
                                                    outside = true;
                                                }
                                                else {
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    else if (outside) {
                                        if (parent.documentRoot || parent.css('overflow') === 'hidden' || node.withinX(parent.box) && node.withinY(parent.box)) {
                                            relativeParent = parent as T;
                                            break;
                                        }
                                    }
                                    parent = parent.actualParent as T;
                                }
                                if (relativeParent) {
                                    parent = relativeParent;
                                }
                                break;
                            }
                            else {
                                parent = node.absoluteParent;
                            }
                        }
                    }
                    if (!node.pageFlow && (parent === null || parent.id === 0)) {
                        parent = nodeRoot;
                    }
                    if (parent) {
                        node.parent = parent;
                        node.documentParent = parent;
                    }
                    else {
                        node.hide();
                    }
                }
            }
            for (const node of this.processing.cache.elements) {
                if (node.htmlElement) {
                    let i = 0;
                    Array.from(node.element.childNodes).forEach((element: Element) => {
                        const item = Node.getElementAsNode(element);
                        if (item && !item.excluded && (item.pageFlow || item.actualParent === node)) {
                            item.siblingIndex = i++;
                        }
                    });
                    const layer: Array<T[]> = [];
                    node.each((item: T) => {
                        if (item.siblingIndex === Number.MAX_VALUE) {
                            for (const adjacent of node.children) {
                                if (adjacent.actualChildren.includes(item) || item.ascend().some(child => adjacent.cascade().includes(child))) {
                                    let index = -1;
                                    if (item.toInt('zIndex') >= 0 || adjacent !== item.actualParent) {
                                        index = adjacent.siblingIndex + 1;
                                    }
                                    else {
                                        index = adjacent.siblingIndex - 1;
                                    }
                                    if (layer[index] === undefined) {
                                        layer[index] = [];
                                    }
                                    layer[index].push(item);
                                    break;
                                }
                            }
                        }
                    });
                    for (let j = 0; j < layer.length; j++) {
                        const order = layer[j];
                        if (order) {
                            order.sort((a, b) => {
                                const indexA = a.toInt('zIndex');
                                const indexB = b.toInt('zIndex');
                                if (indexA === indexB) {
                                    return a.id < b.id ? -1 : 1;
                                }
                                return indexA < indexB ? -1 : 1;
                            });
                            node.each((item: T) => {
                                if (item.siblingIndex !== Number.MAX_VALUE && item.siblingIndex >= j) {
                                    item.siblingIndex += order.length;
                                }
                            });
                            for (let k = 0 ; k < order.length; k++) {
                                order[k].siblingIndex = j + k;
                            }
                        }
                    }
                    if (node.length) {
                        node.sort(NodeList.siblingIndex);
                        node.initial.children.push(...node.duplicate());
                    }
                }
            }
            sortAsc(this.processing.cache.children, 'depth', 'id');
            for (const ext of this.extensions) {
                ext.afterInit(documentRoot);
            }
            return true;
        }
        return false;
    }

    protected setBaseLayout() {
        const settings = this.userSettings;
        const localSettings = this.viewController.localSettings;
        const documentRoot = this.processing.node as T;
        const mapX: LayoutMapX<T> = [];
        const mapY: LayoutMapY<T> = new Map<number, Map<number, T>>();
        const extensions = Array.from(this.extensions).filter(item => !item.eventOnly);
        let baseTemplate = localSettings.baseTemplate;
        let empty = true;
        function setMapY(depth: number, id: number, node: T) {
            const index = mapY.get(depth) || new Map<number, T>();
            index.set(id, node);
            mapY.set(depth, index);
        }
        function deleteMapY(id: number) {
            for (const mapNode of mapY.values()) {
                for (const node of mapNode.values()) {
                    if (node.id === id) {
                        mapNode.delete(node.id);
                        return;
                    }
                }
            }
        }
        setMapY(-1, 0, documentRoot.parent as T);
        let maxDepth = 0;
        for (const node of this.processing.cache.visible) {
            const x = Math.floor(node.linear.left);
            if (mapX[node.depth] === undefined) {
                mapX[node.depth] = {};
            }
            if (mapX[node.depth][x] === undefined) {
                mapX[node.depth][x] = [];
            }
            mapX[node.depth][x].push(node);
            setMapY(node.depth, node.id, node);
            maxDepth = Math.max(node.depth, maxDepth);
        }
        for (let i = 0; i < maxDepth; i++) {
            mapY.set((i * -1) - 2, new Map<number, T>());
        }
        this.processing.cache.delegateAppend = (node: T) => {
            deleteMapY(node.id);
            setMapY((node.initial.depth * -1) - 2, node.id, node);
            node.cascade().forEach((item: T) => {
                deleteMapY(item.id);
                setMapY((item.initial.depth * -1) - 2, item.id, item);
            });
        };
        for (const depth of mapY.values()) {
            this.processing.depthMap.clear();
            for (const parent of depth.values()) {
                if (parent.length === 0 || parent.every(node => node.rendered)) {
                    continue;
                }
                const axisY = parent.duplicate() as T[];
                const hasFloat = axisY.some(node => node.floating);
                const cleared = hasFloat ? NodeList.clearedAll(parent) : new Map<T, string>();
                let k = -1;
                while (++k < axisY.length) {
                    let nodeY = axisY[k];
                    if (!nodeY.visible ||
                        nodeY.rendered ||
                        !nodeY.documentRoot && this.parseElements.has(<HTMLElement> nodeY.element))
                    {
                        continue;
                    }
                    let parentY = nodeY.parent as T;
                    if (nodeY.renderAs) {
                        nodeY.hide();
                        nodeY = nodeY.renderAs as T;
                        if (nodeY.positioned) {
                            parentY = nodeY.parent as T;
                        }
                    }
                    if (!nodeY.hasBit('excludeSection', APP_SECTION.DOM_TRAVERSE) && axisY.length > 1 && k < axisY.length - 1) {
                        const extendable = nodeY.hasAlign(NODE_ALIGNMENT.EXTENDABLE);
                        const unknownParent = parentY.hasAlign(NODE_ALIGNMENT.UNKNOWN);
                        if (nodeY.pageFlow && !parentY.hasAlign(NODE_ALIGNMENT.AUTO_LAYOUT) && (parentY.alignmentType === NODE_ALIGNMENT.NONE || unknownParent || extendable)) {
                            const linearVertical = parentY.linearVertical;
                            const horizontal: T[] = [];
                            const vertical: T[] = [];
                            const floatAvailable = new Set(['left', 'right']);
                            let verticalExtended = false;
                            function checkHorizontal(node: T) {
                                if (vertical.length || verticalExtended) {
                                    return false;
                                }
                                horizontal.push(node);
                                return true;
                            }
                            function checkVertical(node: T) {
                                if (linearVertical && vertical.length) {
                                    const previousAbove = vertical[vertical.length - 1];
                                    if (previousAbove.linearVertical) {
                                        node.parent = previousAbove;
                                        return true;
                                    }
                                }
                                vertical.push(node);
                                return true;
                            }
                            let l = k;
                            let m = 0;
                            if (extendable && parentY.layoutVertical) {
                                horizontal.push(nodeY);
                                l++;
                                m++;
                            }
                            domNested: {
                                for ( ; l < axisY.length; l++, m++) {
                                    const item = axisY[l];
                                    if (item.pageFlow) {
                                        if (hasFloat) {
                                            const float = cleared && cleared.get(item);
                                            if (float) {
                                                if (float === 'both') {
                                                    floatAvailable.clear();
                                                }
                                                else {
                                                    floatAvailable.delete(float);
                                                }
                                            }
                                            if (item.floating) {
                                                floatAvailable.add(item.float);
                                            }
                                        }
                                        const previousSiblings = item.previousSiblings() as T[];
                                        const previous = previousSiblings[previousSiblings.length - 1];
                                        const next = item.nextSiblings().shift();
                                        if (m === 0 && next) {
                                            if (item.blockStatic || next.alignedVertically([item], [item], cleared)) {
                                                vertical.push(item);
                                            }
                                            else {
                                                horizontal.push(item);
                                            }
                                        }
                                        else if (previous) {
                                            if (hasFloat) {
                                                const floated = NodeList.floated([...horizontal, ...vertical]);
                                                const pending = [...horizontal, ...vertical, item];
                                                const startNewRow = item.alignedVertically(previousSiblings, undefined, cleared);
                                                if (startNewRow ||
                                                    cleared.has(item) ||
                                                    settings.floatOverlapDisabled && previous.floating && item.blockStatic && floatAvailable.size === 2)
                                                {
                                                    if (horizontal.length) {
                                                        if (!settings.floatOverlapDisabled &&
                                                            floatAvailable.size > 0 &&
                                                            !previousSiblings.some(node => node.lineBreak && !cleared.has(node)) &&
                                                            !pending.some(node => cleared.get(node) === 'both') && (
                                                                floated.size === 0 ||
                                                                item.bounds.top < maxArray(horizontal.filter(node => node.floating).map(node => node.bounds.bottom))
                                                           ))
                                                        {
                                                            if (cleared.has(item)) {
                                                                if (floatAvailable.size < 2 && floated.size === 2 && !item.floating) {
                                                                    item.alignmentType |= NODE_ALIGNMENT.EXTENDABLE;
                                                                    verticalExtended = true;
                                                                    horizontal.push(item);
                                                                    continue;
                                                                }
                                                                break domNested;
                                                            }
                                                            else if (!startNewRow) {
                                                                horizontal.push(item);
                                                                continue;
                                                            }
                                                            if (floated.size === 1 && (!item.floating || floatAvailable.has(item.float))) {
                                                                horizontal.push(item);
                                                                continue;
                                                            }
                                                        }
                                                        break domNested;
                                                    }
                                                    checkVertical(item);
                                                }
                                                else {
                                                    if (!checkHorizontal(item)) {
                                                        break domNested;
                                                    }
                                                }
                                            }
                                            else {
                                                if (item.alignedVertically(previousSiblings)) {
                                                    checkVertical(item);
                                                }
                                                else {
                                                    if (!checkHorizontal(item)) {
                                                        break domNested;
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            break domNested;
                                        }
                                    }
                                }
                            }
                            let layout: Layout<T> | undefined;
                            let output = '';
                            let grouped = true;
                            if (horizontal.length > 1) {
                                layout = new Layout(parentY, null as any, 0, 0, horizontal.length, horizontal);
                                layout.init();
                                const segmentEnd = horizontal[horizontal.length - 1];
                                if (this.viewController.checkConstraintFloat(layout)) {
                                    layout.node = this.viewController.createNodeGroup(nodeY, parentY, horizontal);
                                    layout.setType(NODE_CONTAINER.CONSTRAINT);
                                }
                                else if (this.viewController.checkFrameHorizontal(layout)) {
                                    layout.node = this.viewController.createNodeGroup(nodeY, parentY, horizontal);
                                    output = this.processLayoutHorizontal(layout);
                                }
                                else if (horizontal.length !== axisY.length) {
                                    let containerType = 0;
                                    layout.node = this.viewController.createNodeGroup(nodeY, parentY, horizontal);
                                    if (this.viewController.checkConstraintHorizontal(layout)) {
                                        containerType = NODE_CONTAINER.CONSTRAINT;
                                    }
                                    else if (this.viewController.checkRelativeHorizontal(layout)) {
                                        containerType = NODE_CONTAINER.RELATIVE;
                                    }
                                    else {
                                        containerType = NODE_CONTAINER.LINEAR;
                                    }
                                    layout.setType(containerType, NODE_ALIGNMENT.HORIZONTAL);
                                }
                                else {
                                    parentY.alignmentType |= NODE_ALIGNMENT.HORIZONTAL;
                                    grouped = false;
                                }
                                if (output === '' && layout.floated.size > 0) {
                                    NodeList.sortByAlignment(horizontal, NODE_ALIGNMENT.FLOAT);
                                }
                                if (unknownParent && segmentEnd === axisY[axisY.length - 1]) {
                                    parentY.alignmentType ^= NODE_ALIGNMENT.UNKNOWN;
                                }
                            }
                            else if (vertical.length > 1) {
                                layout = new Layout(parentY, nodeY, 0, 0, vertical.length, vertical);
                                layout.init();
                                const segmentEnd = vertical[vertical.length - 1];
                                if (layout.floated.size > 0 && layout.cleared.size > 0 && !(layout.floated.size === 1 && vertical.every((node, index) => index === 0 || !!layout && layout.cleared.has(node)))) {
                                    if (parentY.linearVertical && !hasValue(nodeY.dataset.import)) {
                                        output = this.processLayoutVertical(layout);
                                    }
                                    else {
                                        layout.node = this.viewController.createNodeGroup(nodeY, parentY, vertical);
                                        output = this.processLayoutVertical(layout, layout.node);
                                    }
                                }
                                else if (vertical.length !== axisY.length) {
                                    if (!linearVertical) {
                                        layout.node = this.viewController.createNodeGroup(nodeY, parentY, vertical);
                                        layout.setType(NODE_CONTAINER.LINEAR, NODE_ALIGNMENT.VERTICAL);
                                    }
                                    else {
                                        grouped = false;
                                    }
                                    if (!segmentEnd.blockStatic && segmentEnd !== axisY[axisY.length - 1]) {
                                        segmentEnd.alignmentType |= NODE_ALIGNMENT.EXTENDABLE;
                                    }
                                }
                                else {
                                    parentY.alignmentType |= NODE_ALIGNMENT.VERTICAL;
                                    grouped = false;
                                }
                                if (unknownParent && segmentEnd === axisY[axisY.length - 1]) {
                                    parentY.alignmentType ^= NODE_ALIGNMENT.UNKNOWN;
                                }
                            }
                            else {
                                grouped = false;
                            }
                            if (layout && grouped) {
                                if (output === '') {
                                    output = this.renderNode(layout);
                                }
                                this.addRenderTemplate(layout.node, parentY, output, true);
                                parentY = nodeY.parent as T;
                            }
                            if (extendable) {
                                nodeY.alignmentType ^= NODE_ALIGNMENT.EXTENDABLE;
                            }
                        }
                    }
                    if (!nodeY.hasBit('excludeSection', APP_SECTION.EXTENSION) && !nodeY.rendered) {
                        let next = false;
                        for (const ext of [...parentY.renderExtension, ...extensions.filter(item => item.subscribersChild.has(nodeY))]) {
                            const result = ext.processChild(nodeY, parentY);
                            if (result.output !== '') {
                                this.addRenderTemplate(nodeY, parentY, result.output);
                            }
                            if (result.renderAs && result.outputAs) {
                                this.addRenderTemplate(result.renderAs as T, parentY, result.outputAs);
                            }
                            if (result.parent) {
                                parentY = result.parent as T;
                            }
                            next = result.next === true;
                            if (result.complete || result.next) {
                                break;
                            }
                        }
                        if (next) {
                            continue;
                        }
                        if (nodeY.styleElement) {
                            const processed: Extension<T>[] = [];
                            prioritizeExtensions(<HTMLElement> documentRoot.element, <HTMLElement> nodeY.element, extensions).some(item => {
                                if (item.is(nodeY) && item.condition(nodeY, parentY)) {
                                    const result =  item.processNode(nodeY, parentY, mapX, mapY);
                                    if (result.output !== '') {
                                        this.addRenderTemplate(nodeY, parentY, result.output);
                                    }
                                    if (result.renderAs && result.outputAs) {
                                        this.addRenderTemplate(result.renderAs as T, parentY, result.outputAs);
                                    }
                                    if (result.parent) {
                                        parentY = result.parent as T;
                                    }
                                    if (isString(result.output) || result.include === true) {
                                        processed.push(item);
                                    }
                                    next = result.next === true;
                                    if (result.complete || result.next) {
                                        return true;
                                    }
                                }
                                return false;
                            });
                            processed.forEach(item => item.subscribers.add(nodeY) && nodeY.renderExtension.add(item));
                            if (next) {
                                continue;
                            }
                        }
                    }
                    if (!nodeY.hasBit('excludeSection', APP_SECTION.RENDER) && !nodeY.rendered) {
                        const layout = new Layout(parentY, nodeY);
                        let containerType = nodeY.containerType || Controller.getContainerType(nodeY.tagName);
                        let output = '';
                        if (containerType === 0) {
                            if (nodeY.length > 0) {
                                layout.retain(nodeY.children as T[]);
                                if (nodeY.has('columnCount')) {
                                    layout.columnCount = nodeY.toInt('columnCount');
                                    containerType = NODE_CONTAINER.CONSTRAINT;
                                    layout.add(NODE_ALIGNMENT.COLUMN | NODE_ALIGNMENT.AUTO_LAYOUT);
                                }
                                else if (nodeY.some(node => !node.pageFlow)) {
                                    containerType = NODE_CONTAINER.CONSTRAINT;
                                    layout.add(NODE_ALIGNMENT.ABSOLUTE | NODE_ALIGNMENT.UNKNOWN);
                                }
                                else {
                                    if (nodeY.length === 1) {
                                        const targeted = nodeY.filter(node => {
                                            if (node.dataset.target) {
                                                const element = document.getElementById(node.dataset.target);
                                                return !!element && hasValue(element.dataset.import) && element !== parentY.element;
                                            }
                                            return false;
                                        });
                                        const child = nodeY.item(0) as T;
                                        if (nodeY.documentRoot && targeted.length === 1) {
                                            nodeY.hide();
                                            continue;
                                        }
                                        else if (
                                            settings.collapseUnattributedElements &&
                                            nodeY.positionStatic &&
                                            !hasValue(nodeY.element.id) &&
                                            !hasValue(nodeY.dataset.import) &&
                                            !hasValue(nodeY.dataset.target) &&
                                            nodeY.toInt('width') === 0 &&
                                            nodeY.toInt('height') === 0 &&
                                            nodeY.lineHeight === 0 &&
                                            !child.hasWidth && !child.visibleStyle.border &&
                                            !nodeY.visibleStyle.background &&
                                            !nodeY.has('textAlign') && !nodeY.has('verticalAlign') &&
                                            nodeY.float !== 'right' && !nodeY.autoMargin.horizontal &&
                                            !this.viewController.hasAppendProcessing(nodeY.id))
                                        {
                                            child.documentRoot = nodeY.documentRoot;
                                            child.siblingIndex = nodeY.siblingIndex;
                                            child.parent = parentY;
                                            nodeY.resetBox(BOX_STANDARD.MARGIN | BOX_STANDARD.PADDING, child, true);
                                            nodeY.hide();
                                            axisY[k] = child;
                                            k--;
                                            continue;
                                        }
                                        else {
                                            containerType = NODE_CONTAINER.FRAME;
                                            layout.add(NODE_ALIGNMENT.SINGLE);
                                        }
                                    }
                                    else {
                                        layout.init();
                                        if (Array.from(nodeY.element.children).some(item => item.tagName === 'BR')) {
                                            containerType = NODE_CONTAINER.LINEAR;
                                            layout.add(NODE_ALIGNMENT.VERTICAL | NODE_ALIGNMENT.UNKNOWN);
                                        }
                                        else if (this.viewController.checkConstraintFloat(layout)) {
                                            containerType = NODE_CONTAINER.CONSTRAINT;
                                        }
                                        else if (layout.linearX) {
                                            if (this.viewController.checkFrameHorizontal(layout)) {
                                                output = this.processLayoutHorizontal(layout);
                                            }
                                            else if (this.viewController.checkConstraintHorizontal(layout)) {
                                                containerType = NODE_CONTAINER.CONSTRAINT;
                                            }
                                            else if (this.viewController.checkRelativeHorizontal(layout)) {
                                                containerType = NODE_CONTAINER.RELATIVE;
                                            }
                                            else {
                                                containerType = NODE_CONTAINER.LINEAR;
                                            }
                                            layout.add(NODE_ALIGNMENT.HORIZONTAL);
                                            if (output === '' && layout.floated.size > 0) {
                                                NodeList.sortByAlignment(layout.children, NODE_ALIGNMENT.FLOAT);
                                            }
                                        }
                                        else if (NodeList.linearY(layout.children)) {
                                            containerType = NODE_CONTAINER.LINEAR;
                                            layout.add(NODE_ALIGNMENT.VERTICAL | (nodeY.documentRoot ? NODE_ALIGNMENT.UNKNOWN : 0));
                                        }
                                        else if (layout.every(node => node.inlineFlow)) {
                                            if (this.viewController.checkFrameHorizontal(layout)) {
                                                output = this.processLayoutHorizontal(layout);
                                            }
                                            else {
                                                containerType = NODE_CONTAINER.RELATIVE;
                                                layout.add(NODE_ALIGNMENT.HORIZONTAL | NODE_ALIGNMENT.UNKNOWN);
                                            }
                                        }
                                        else if (layout.some(node => node.alignedVertically(node.previousSiblings(), layout.children, layout.cleared))) {
                                            containerType = NODE_CONTAINER.LINEAR;
                                            layout.add(NODE_ALIGNMENT.VERTICAL | NODE_ALIGNMENT.UNKNOWN);
                                        }
                                        else {
                                            containerType = NODE_CONTAINER.CONSTRAINT;
                                            layout.add(NODE_ALIGNMENT.UNKNOWN);
                                        }
                                    }
                                }
                            }
                            else {
                                const visibleStyle = nodeY.visibleStyle;
                                if (hasFreeFormText(nodeY.element, settings.renderInlineText ? 0 : 1) ||
                                    visibleStyle.border && nodeY.textContent.length)
                                {
                                    containerType = NODE_CONTAINER.TEXT;
                                }
                                else if (visibleStyle.backgroundImage && !visibleStyle.backgroundRepeat && (!nodeY.inlineText || nodeY.toInt('textIndent') + nodeY.bounds.width < 0)) {
                                    containerType = NODE_CONTAINER.IMAGE;
                                    layout.add(NODE_ALIGNMENT.SINGLE);
                                    nodeY.exclude({ resource: NODE_RESOURCE.FONT_STYLE | NODE_RESOURCE.VALUE_STRING });
                                }
                                else if (nodeY.block && (visibleStyle.border || visibleStyle.backgroundImage) && (visibleStyle.border || nodeY.paddingTop + nodeY.paddingRight + nodeY.paddingBottom + nodeY.paddingLeft > 0)) {
                                    containerType = NODE_CONTAINER.LINE;
                                }
                                else if (!nodeY.documentRoot) {
                                    if (settings.collapseUnattributedElements && nodeY.bounds.height === 0 && !hasValue(nodeY.element.id) && !hasValue(nodeY.dataset.import) && !visibleStyle.background) {
                                        parentY.remove(nodeY);
                                        nodeY.hide();
                                    }
                                    else if (visibleStyle.background) {
                                        containerType = NODE_CONTAINER.TEXT;
                                    }
                                    else {
                                        containerType = NODE_CONTAINER.FRAME;
                                    }
                                }
                            }
                        }
                        else {
                            layout.retain(nodeY.children as T[]);
                            layout.setType(containerType, nodeY.alignmentType);
                        }
                        if (output === '' && containerType !== 0) {
                            layout.setType(containerType);
                            output = this.renderNode(layout);
                        }
                        this.addRenderTemplate(nodeY, parentY, output);
                    }
                }
            }
            for (const [key, templates] of this.processing.depthMap.entries()) {
                const parentId = parseInt(key.split(':')[0]);
                const renderPosition = this._renderPosition.get(parentId);
                if (renderPosition) {
                    const sorted = new Map<number, string>();
                    let i = 0;
                    renderPosition.forEach(node => {
                        const result = templates.get(node.id);
                        if (result) {
                            node.renderIndex = i++;
                            sorted.set(node.id, result);
                        }
                    });
                    if (sorted.size === templates.size) {
                        this.processing.depthMap.set(key, sorted);
                    }
                }
            }
            for (const ext of this.extensions) {
                ext.afterDepthLevel();
            }
            for (const [key, templates] of this.processing.depthMap.entries()) {
                if (templates.size > 0) {
                    const [parentId, position] = key.split(':');
                    const views = Array.from(templates.values());
                    const id = parentId + (position ? `:${position}` : '');
                    const placeholder = formatPlaceholder(id);
                    if (baseTemplate.indexOf(placeholder) !== -1) {
                        baseTemplate = replacePlaceholder(baseTemplate, placeholder, views.join(''));
                        empty = false;
                    }
                    else {
                        this.addRenderQueue(id, views);
                    }
                }
            }
        }
        if (documentRoot.dataset.layoutName && (!hasValue(documentRoot.dataset.target) || documentRoot.renderExtension.size === 0)) {
            this.addLayoutFile(
                documentRoot.dataset.layoutName,
                !empty ? baseTemplate : '',
                trimString(trimNull(documentRoot.dataset.pathname), '/'),
                documentRoot.renderExtension.size > 0 && Array.from(documentRoot.renderExtension).some(item => item.documentRoot)
            );
        }
        if (empty && documentRoot.renderExtension.size === 0) {
            documentRoot.hide();
        }
        this.processing.cache.sort((a, b) => {
            if (!a.visible) {
                return 1;
            }
            else if (a.renderDepth !== b.renderDepth) {
                return a.renderDepth < b.renderDepth ? -1 : 1;
            }
            else if (a.documentParent !== b.documentParent) {
                return a.documentParent.id >= b.documentParent.id ? 1 : -1;
            }
            else {
                return a.renderIndex >= b.renderIndex ? 1 : -1;
            }
        });
        this.session.cache.children.push(...this.processing.cache.duplicate());
        this.session.excluded.push(...this.processing.excluded);
        for (const ext of this.extensions) {
            for (const node of ext.subscribers) {
                ext.postBaseLayout(node);
            }
        }
        for (const ext of this.extensions) {
            ext.afterBaseLayout();
        }
    }

    protected setConstraints() {
        this.viewController.setConstraints();
        for (const ext of this.extensions) {
            ext.afterConstraints();
        }
    }

    protected setResources() {
        this.resourceHandler.setBoxStyle();
        this.resourceHandler.setFontStyle();
        this.resourceHandler.setBoxSpacing();
        this.resourceHandler.setValueString();
        this.resourceHandler.setOptionArray();
        this.resourceHandler.setImageSource();
        for (const ext of this.extensions) {
            ext.afterResources();
        }
    }

    protected insertNode(element: Element, parent?: T) {
        let node: T | null = null;
        if (element.nodeName.charAt(0) === '#') {
            if (element.nodeName === '#text') {
                if (isPlainText(element, true) || cssParent(element, 'whiteSpace', 'pre', 'pre-wrap')) {
                    node = new this.nodeObject(this.processing.cache.nextId, element, this.viewController.delegateNodeInit);
                    if (parent) {
                        node.parent = parent;
                        node.inherit(parent, 'style');
                    }
                    else {
                        node.css('whiteSpace', getStyle(element.parentElement).whiteSpace || 'normal');
                    }
                    node.css({
                        position: 'static',
                        display: 'inline',
                        clear: 'none',
                        cssFloat: 'none',
                        verticalAlign: 'baseline'
                    });
                }
            }
        }
        else if (isStyleElement(element)) {
            const nodeObject = new this.nodeObject(this.processing.cache.nextId, element, this.viewController.delegateNodeInit);
            if (isElementVisible(element, this.userSettings.hideOffScreenElements)) {
                node = nodeObject;
                node.setExclusions();
            }
            else {
                nodeObject.visible = false;
                nodeObject.excluded = true;
                this.processing.excluded.push(nodeObject);
            }
        }
        if (node) {
            this.processing.cache.append(node);
        }
        return node;
    }

    protected processLayoutHorizontal(data: Layout<T>) {
        const settings = this.userSettings;
        let layerIndex: Array<T[] | T[][]> = [];
        let output = '';
        if (data.cleared.size === 0 && data.every(node => !node.autoMargin.horizontal)) {
            const inline: T[] = [];
            const left: T[] = [];
            const right: T[] = [];
            for (const node of data) {
                if (node.float === 'right') {
                    right.push(node);
                }
                else if (node.float === 'left') {
                    left.push(node);
                }
                else {
                    inline.push(node);
                }
            }
            const layout = new Layout(data.parent, data.node, 0, 0, data.itemCount, data.children);
            layout.floated = data.floated;
            layout.cleared = data.cleared;
            layout.linearX = data.linearX;
            if (inline.length === layout.itemCount || left.length === layout.itemCount || right.length === layout.itemCount) {
                layout.add(NODE_ALIGNMENT.HORIZONTAL);
                if (this.viewController.checkConstraintFloat(layout)) {
                    layout.setType(NODE_CONTAINER.CONSTRAINT);
                    return this.renderNode(layout);
                }
                else if (this.viewController.checkRelativeHorizontal(layout)) {
                    layout.setType(NODE_CONTAINER.RELATIVE);
                    return this.renderNode(layout);
                }
                else {
                    layout.setType(NODE_CONTAINER.LINEAR);
                    return this.renderNode(layout);
                }
            }
            else if (left.length === 0 || right.length === 0) {
                if (NodeList.linearY(data.children)) {
                    layout.setType(NODE_CONTAINER.LINEAR, NODE_ALIGNMENT.VERTICAL);
                    return this.renderNode(layout);
                }
                else {
                    layout.add(NODE_ALIGNMENT.FLOAT);
                    if (this.viewController.checkRelativeHorizontal(layout)) {
                        const subgroup: T[] = [];
                        if (right.length === 0) {
                            subgroup.push(...left, ...inline);
                        }
                        else {
                            layout.add(NODE_ALIGNMENT.RIGHT);
                            subgroup.push(...inline, ...right.reverse());
                        }
                        layout.retain(subgroup);
                        layout.setType(NODE_CONTAINER.RELATIVE, NODE_ALIGNMENT.HORIZONTAL);
                        return this.renderNode(layout);
                    }
                    else if (!settings.floatOverlapDisabled && right.length === 0) {
                        layout.setType(NODE_CONTAINER.LINEAR, NODE_ALIGNMENT.HORIZONTAL);
                        output = this.renderNode(layout);
                        layerIndex.push(left, inline);
                    }
                }
            }
        }
        const inlineAbove: T[] = [];
        const inlineBelow: T[] = [];
        const leftAbove: T[] = [];
        const rightAbove: T[] = [];
        const leftBelow: T[] = [];
        const rightBelow: T[] = [];
        let leftSub: T[] | T[][] = [];
        let rightSub: T[] | T[][] = [];
        if (layerIndex.length === 0) {
            let current = '';
            let pendingFloat = 0;
            for (let i = 0; i < data.length; i++) {
                const node = data.item(i) as T;
                if (data.cleared.has(node)) {
                    const clear = data.cleared.get(node);
                    if (hasBit(pendingFloat, clear === 'right' ? 4 : 2) ||
                        pendingFloat !== 0 && clear === 'both')
                    {
                        switch (clear) {
                            case 'left':
                                pendingFloat ^= 2;
                                current = 'left';
                                break;
                            case 'right':
                                pendingFloat ^= 4;
                                current = 'right';
                                break;
                            case 'both':
                                switch (pendingFloat) {
                                    case 2:
                                        current = 'left';
                                        break;
                                    case 4:
                                        current = 'right';
                                        break;
                                    default:
                                        current = 'both';
                                        break;
                                }
                                pendingFloat = 0;
                                break;
                        }
                    }
                }
                if (current === '') {
                    if (node.float === 'right') {
                        rightAbove.push(node);
                        if (node.floating) {
                            pendingFloat |= 4;
                        }
                    }
                    else if (node.float === 'left') {
                        leftAbove.push(node);
                        if (node.floating) {
                            pendingFloat |= 2;
                        }
                    }
                    else if (node.autoMargin.horizontal) {
                        if (node.autoMargin.left) {
                            if (rightAbove.length) {
                                rightBelow.push(node);
                            }
                            else {
                                rightAbove.push(node);
                            }
                        }
                        else if (node.autoMargin.right) {
                            if (leftAbove.length) {
                                leftBelow.push(node);
                            }
                            else {
                                leftAbove.push(node);
                            }
                        }
                        else {
                            if (inlineAbove.length) {
                                if (leftAbove.length === 0) {
                                    leftAbove.push(node);
                                }
                                else {
                                    rightAbove.push(node);
                                }
                            }
                            else {
                                inlineAbove.push(node);
                            }
                        }
                    }
                    else {
                        inlineAbove.push(node);
                    }
                }
                else {
                    if (node.float === 'right') {
                        if (rightBelow.length === 0) {
                            pendingFloat |= 4;
                        }
                        if (!settings.floatOverlapDisabled && current !== 'right' && rightAbove.length) {
                            rightAbove.push(node);
                        }
                        else {
                            rightBelow.push(node);
                        }
                    }
                    else if (node.float === 'left') {
                        if (leftBelow.length === 0) {
                            pendingFloat |= 2;
                        }
                        if (!settings.floatOverlapDisabled && current !== 'left' && leftAbove.length) {
                            leftAbove.push(node);
                        }
                        else {
                            leftBelow.push(node);
                        }
                    }
                    else if (node.autoMargin.horizontal) {
                        if (node.autoMargin.left && rightBelow.length) {
                            rightBelow.push(node);
                        }
                        else if (node.autoMargin.right && leftBelow.length) {
                            leftBelow.push(node);
                        }
                        else {
                            inlineBelow.push(node);
                        }
                    }
                    else {
                        switch (current) {
                            case 'left':
                                leftBelow.push(node);
                                break;
                            case 'right':
                                rightBelow.push(node);
                                break;
                            default:
                                inlineBelow.push(node);
                                break;
                        }
                    }
                }
            }
            if (leftAbove.length && leftBelow.length) {
                leftSub = [leftAbove, leftBelow];
            }
            else if (leftAbove.length) {
                leftSub = leftAbove;
            }
            else if (leftBelow.length) {
                leftSub = leftBelow;
            }
            if (rightAbove.length && rightBelow.length) {
                rightSub = [rightAbove, rightBelow];
            }
            else if (rightAbove.length) {
                rightSub = rightAbove;
            }
            else if (rightBelow.length) {
                rightSub = rightBelow;
            }
            const layout = new Layout(data.parent, data.node, 0, (data.floated.size ? NODE_ALIGNMENT.FLOAT : 0) | (data.floated.size === 1 && data.floated.has('right') ? NODE_ALIGNMENT.RIGHT : 0));
            if (settings.floatOverlapDisabled) {
                if (data.parent.linearVertical) {
                    data.node.alignmentType |= layout.alignmentType;
                    output = formatPlaceholder(data.node.id);
                    data.node.render(data.parent);
                    data.node.renderDepth--;
                }
                else {
                    layout.itemCount = (inlineAbove.length ? 1 : 0) + (leftAbove.length + rightAbove.length ? 1 : 0) + (inlineBelow.length ? 1 : 0);
                    layout.setType(NODE_CONTAINER.LINEAR, NODE_ALIGNMENT.VERTICAL);
                    output = this.renderNode(layout);
                }
                layerIndex.push(inlineAbove, [leftAbove, rightAbove], inlineBelow);
            }
            else {
                if (inlineAbove.length) {
                    if (rightBelow.length) {
                        leftSub = [inlineAbove, leftAbove];
                        layerIndex.push(leftSub, rightSub);
                    }
                    else if (leftBelow.length) {
                        rightSub = [inlineAbove, rightAbove];
                        layerIndex.push(rightSub, leftSub);
                    }
                    else {
                        layerIndex.push(inlineAbove, leftSub, rightSub);
                    }
                }
                else {
                    if (leftSub === leftBelow && rightSub === rightAbove ||
                        leftSub === leftAbove && rightSub === rightBelow)
                    {
                        if (leftBelow.length === 0) {
                            layerIndex.push([leftAbove, rightBelow]);
                        }
                        else {
                            layerIndex.push([rightAbove, leftBelow]);
                        }
                    }
                    else {
                        layerIndex.push(leftSub, rightSub);
                    }
                }
                layerIndex = layerIndex.filter(item => item && item.length > 0);
                layout.itemCount = layerIndex.length;
                if (inlineAbove.length === 0 && (leftSub.length === 0 || rightSub.length === 0)) {
                    layout.setType(NODE_CONTAINER.LINEAR, NODE_ALIGNMENT.VERTICAL);
                    output = this.renderNode(layout);
                }
                else {
                    layout.setType(NODE_CONTAINER.FRAME);
                    output = this.renderNode(layout);
                }
            }
        }
        if (layerIndex.length) {
            const floating = [inlineAbove, leftAbove, leftBelow, rightAbove, rightBelow];
            let floatgroup: T | null;
            layerIndex.forEach((item, index) => {
                if (Array.isArray(item[0])) {
                    const grouping: T[] = [];
                    (item as T[][]).forEach(segment => grouping.push(...segment));
                    grouping.sort(NodeList.siblingIndex);
                    floatgroup = this.viewController.createNodeGroup(grouping[0], data.node, grouping);
                    const layout = new Layout(
                        data.node,
                        floatgroup,
                        0,
                        NODE_ALIGNMENT.FLOAT | ((item as T[][]).some(segment => segment === rightSub || segment === rightAbove) ? NODE_ALIGNMENT.RIGHT : 0),
                        item.length
                    );
                    if (settings.floatOverlapDisabled) {
                        layout.setType(NODE_CONTAINER.FRAME);
                    }
                    else {
                        if (data.node.linearVertical) {
                            floatgroup = data.node;
                        }
                        else {
                            layout.setType(NODE_CONTAINER.LINEAR, NODE_ALIGNMENT.VERTICAL);
                        }
                    }
                    if (layout.containerType !== 0) {
                        output = replacePlaceholder(output, data.node.id, this.renderNode(layout));
                    }
                }
                else {
                    floatgroup = null;
                }
                ((Array.isArray(item[0]) ? item : [item]) as T[][]).forEach(segment => {
                    let basegroup = data.node;
                    if (floatgroup && floating.includes(segment)) {
                        basegroup = floatgroup;
                    }
                    if (segment.length > 1) {
                        const subgroup = this.viewController.createNodeGroup(segment[0], basegroup, segment);
                        const layout = new Layout(
                            basegroup,
                            subgroup,
                            0,
                            NODE_ALIGNMENT.SEGMENTED,
                            segment.length,
                            segment
                        );
                        layout.init();
                        let containerType = 0;
                        let alignmentType = 0;
                        if (NodeList.linearY(segment)) {
                            containerType = NODE_CONTAINER.LINEAR;
                            alignmentType |= NODE_ALIGNMENT.VERTICAL;
                        }
                        else if (this.viewController.checkConstraintFloat(layout)) {
                            containerType = NODE_CONTAINER.CONSTRAINT;
                        }
                        else if (this.viewController.checkRelativeHorizontal(layout)) {
                            containerType = NODE_CONTAINER.RELATIVE;
                            alignmentType |= NODE_ALIGNMENT.HORIZONTAL;
                        }
                        else {
                            containerType = NODE_CONTAINER.LINEAR;
                            alignmentType |= NODE_ALIGNMENT.HORIZONTAL;
                        }
                        if (layout.linearX) {
                            alignmentType |= NODE_ALIGNMENT.NOWRAP;
                        }
                        if (layout.floated.size > 0 && hasBit(alignmentType, NODE_ALIGNMENT.HORIZONTAL)) {
                            NodeList.sortByAlignment(segment, NODE_ALIGNMENT.FLOAT);
                        }
                        layout.setType(containerType, alignmentType);
                        output = replacePlaceholder(output, basegroup.id, this.renderNode(layout));
                        basegroup.renderChild(subgroup);
                    }
                    else if (segment.length) {
                        const single = segment[0];
                        single.alignmentType |= NODE_ALIGNMENT.SINGLE;
                        if (single.floating) {
                            single.alignmentType |= NODE_ALIGNMENT.FLOAT | (single.float === 'right' ? NODE_ALIGNMENT.RIGHT : 0);
                        }
                        single.renderPosition = index;
                        output = replacePlaceholder(output, basegroup.id, formatPlaceholder(`${basegroup.id}:${index}`));
                        basegroup.renderChild(single);
                        this.setRenderPosition(basegroup, single);
                    }
                });
            });
        }
        return output;
    }

    protected processLayoutVertical(data: Layout<T>, group?: T) {
        let output = '';
        if (group) {
            const layout = new Layout(
                data.parent,
                group,
                NODE_CONTAINER.LINEAR,
                NODE_ALIGNMENT.VERTICAL,
                data.length
            );
            output = this.renderNode(layout);
        }
        else {
            group = data.parent;
            output = formatPlaceholder(group.id);
        }
        const staticRows: T[][] = [];
        const floatedRows: T[][] = [];
        const current: T[] = [];
        const floated: T[] = [];
        let leadingMargin = 0;
        let clearReset = false;
        let linearVertical = true;
        data.some(node => {
            if (!node.floating) {
                leadingMargin += node.linear.height;
                return true;
            }
            return false;
        });
        for (const node of data) {
            if (data.cleared.has(node)) {
                if (!node.floating) {
                    node.modifyBox(BOX_STANDARD.MARGIN_TOP, null);
                    staticRows.push(current.slice());
                    current.length = 0;
                    floatedRows.push(floated.slice());
                    floated.length = 0;
                }
                else {
                    clearReset = true;
                }
            }
            if (node.floating) {
                floated.push(node);
            }
            else {
                if (clearReset && !data.cleared.has(node)) {
                    linearVertical = false;
                }
                current.push(node);
            }
        }
        if (floated.length) {
            floatedRows.push(floated);
        }
        if (current.length) {
            staticRows.push(current);
        }
        if (!linearVertical) {
            let content = '';
            for (let i = 0; i < Math.max(floatedRows.length, staticRows.length); i++) {
                const floating = floatedRows[i] || [];
                const pageFlow = staticRows[i] || [];
                if (pageFlow.length || floating.length) {
                    const basegroup = this.viewController.createNodeGroup(floating[0] || pageFlow[0], group, []);
                    const children: T[] = [];
                    const alignmentType = floating.length ? NODE_ALIGNMENT.FLOAT : 0;
                    let subgroup: T | undefined;
                    if (floating.length > 1) {
                        subgroup = this.viewController.createNodeGroup(floating[0], basegroup, floating);
                    }
                    else if (floating.length) {
                        subgroup = floating[0];
                        subgroup.parent = basegroup;
                    }
                    if (subgroup) {
                        children.push(subgroup);
                        if (i === 0 && leadingMargin > 0) {
                            subgroup.modifyBox(BOX_STANDARD.MARGIN_TOP, leadingMargin);
                        }
                        subgroup = undefined;
                    }
                    if (pageFlow.length > 1) {
                        subgroup = this.viewController.createNodeGroup(pageFlow[0], basegroup, pageFlow);
                    }
                    else if (pageFlow.length) {
                        subgroup = pageFlow[0];
                        subgroup.parent = basegroup;
                    }
                    if (subgroup) {
                        children.push(subgroup);
                    }
                    basegroup.init();
                    const layout = new Layout(
                        group,
                        basegroup,
                        NODE_CONTAINER.FRAME,
                        NODE_ALIGNMENT.VERTICAL | alignmentType,
                        children.length
                    );
                    content += this.renderNode(layout);
                    children.forEach((node, index) => {
                        if (data.contains(node)) {
                            content = replacePlaceholder(content, basegroup.id, `{:${basegroup.id}:${index}}`);
                        }
                        else {
                            const layoutChild = new Layout(
                                basegroup,
                                node,
                                NODE_CONTAINER.LINEAR,
                                NODE_ALIGNMENT.VERTICAL | NODE_ALIGNMENT.SEGMENTED | (node.some(item => item.floating) ? NODE_ALIGNMENT.FLOAT : 0),
                                node.length,
                                node.children as T[]
                            );
                            content = replacePlaceholder(content, basegroup.id, this.renderNode(layoutChild));
                        }
                    });
                }
            }
            output = replacePlaceholder(output, group.id, content);
        }
        return output;
    }

    protected processRenderQueue() {
        const template: StringMap = {};
        for (const [id, templates] of this.session.renderQueue.entries()) {
            const [controlId] = id.split(':');
            let replaceId = controlId;
            if (!isNumber(replaceId)) {
                const target = Node.getElementAsNode(document.getElementById(replaceId));
                if (target) {
                    replaceId = target.id.toString();
                }
            }
            let output = templates.join('\n');
            if (replaceId !== controlId) {
                const target = this.session.cache.find('id', parseInt(replaceId));
                if (target) {
                    const depth = target.renderDepth + 1;
                    output = replaceIndent(output, depth);
                    const pattern = /{@(\d+)}/g;
                    let match: RegExpExecArray | null;
                    let i = 0;
                    while ((match = pattern.exec(output)) !== null) {
                        const node = this.session.cache.find('id', parseInt(match[1]));
                        if (node) {
                            if (i++ === 0) {
                                node.renderDepth = depth;
                            }
                            else {
                                node.renderDepth = node.parent.renderDepth + 1;
                            }
                        }
                    }
                }
            }
            template[replaceId] = output;
        }
        for (const inner in template) {
            for (const outer in template) {
                if (inner !== outer) {
                    template[inner] = template[inner].replace(formatPlaceholder(outer), template[outer]);
                    template[outer] = template[outer].replace(formatPlaceholder(inner), template[inner]);
                }
            }
        }
        for (const view of this.viewData) {
            for (const id in template) {
                view.content = view.content.replace(formatPlaceholder(id), template[id]);
            }
            view.content = this.viewController.replaceRenderQueue(view.content);
        }
    }

    private setStyleMap() {
        const settings = this.userSettings;
        const dpi = settings.resolutionDPI;
        const clientFirefox = isUserAgent(USER_AGENT.FIREFOX);
        let warning = false;
        for (let i = 0; i < document.styleSheets.length; i++) {
            const styleSheet = <CSSStyleSheet> document.styleSheets[i];
            if (styleSheet.cssRules) {
                for (let j = 0; j < styleSheet.cssRules.length; j++) {
                    try {
                        if (styleSheet.cssRules[j] instanceof CSSStyleRule) {
                            const cssRule = <CSSStyleRule> styleSheet.cssRules[j];
                            const attrRule = new Set<string>();
                            Array.from(cssRule.style).forEach(value => attrRule.add(convertCamelCase(value)));
                            Array.from(document.querySelectorAll(cssRule.selectorText)).forEach((element: HTMLElement) => {
                                const attrs = new Set(attrRule);
                                Array.from(element.style).forEach(value => attrs.add(convertCamelCase(value)));
                                const style = getStyle(element);
                                const fontSize = parseInt(convertPX(style.fontSize || '16px', dpi, 0));
                                const styleMap: StringMap = {};
                                for (const attr of attrs) {
                                    if (element.style[attr]) {
                                        styleMap[attr] = element.style[attr];
                                    }
                                    else {
                                        const value: string = cssRule.style[attr];
                                        if (value !== 'initial') {
                                            if (style[attr] === value) {
                                                styleMap[attr] = style[attr];
                                            }
                                            else {
                                                switch (attr) {
                                                    case 'backgroundColor':
                                                    case 'borderTopColor':
                                                    case 'borderRightColor':
                                                    case 'borderBottomColor':
                                                    case 'borderLeftColor':
                                                    case 'color':
                                                    case 'fontSize':
                                                    case 'fontWeight':
                                                        styleMap[attr] = style[attr] || value;
                                                        break;
                                                    case 'width':
                                                    case 'height':
                                                    case 'minWidth':
                                                    case 'maxWidth':
                                                    case 'minHeight':
                                                    case 'maxHeight':
                                                    case 'lineHeight':
                                                    case 'verticalAlign':
                                                    case 'textIndent':
                                                    case 'columnGap':
                                                    case 'top':
                                                    case 'right':
                                                    case 'bottom':
                                                    case 'left':
                                                    case 'marginTop':
                                                    case 'marginRight':
                                                    case 'marginBottom':
                                                    case 'marginLeft':
                                                    case 'paddingTop':
                                                    case 'paddingRight':
                                                    case 'paddingBottom':
                                                    case 'paddingLeft':
                                                        styleMap[attr] = /^[A-Za-z\-]+$/.test(value) || isPercent(value) ? value : convertPX(value, dpi, fontSize);
                                                        break;
                                                    default:
                                                        if (styleMap[attr] === undefined) {
                                                            styleMap[attr] = value;
                                                        }
                                                        break;
                                                }
                                            }
                                        }
                                    }
                                }
                                if (settings.preloadImages && hasValue(styleMap.backgroundImage) && styleMap.backgroundImage !== 'initial') {
                                    styleMap.backgroundImage.split(',').map(value => value.trim()).forEach(value => {
                                        const uri = cssResolveUrl(value);
                                        if (uri !== '' && !this.session.image.has(uri)) {
                                            this.session.image.set(uri, { width: 0, height: 0, uri });
                                        }
                                    });
                                }
                                if (clientFirefox && styleMap.display === undefined) {
                                    switch (element.tagName) {
                                        case 'INPUT':
                                        case 'TEXTAREA':
                                        case 'SELECT':
                                        case 'BUTTON':
                                            styleMap.display = 'inline-block';
                                            break;
                                    }
                                }
                                const data = getElementCache(element, 'styleMap');
                                if (data) {
                                    Object.assign(data, styleMap);
                                }
                                else {
                                    setElementCache(element, 'style', style);
                                    setElementCache(element, 'styleMap', styleMap);
                                }
                            });
                        }
                    }
                    catch (error) {
                        if (!warning) {
                            alert('External CSS files cannot be parsed with Chrome 64+ when loading HTML pages directly from your hard drive [file://]. ' +
                                  'Either use a local web server [http://], embed your CSS into a &lt;style&gt; element, or use a different browser. ' +
                                  'See the README for more detailed instructions.\n\n' +
                                  `${styleSheet.href}\n\n${error}`);
                            warning = true;
                        }
                    }
                }
            }
        }
    }

    set appName(value) {
        if (this.resourceHandler) {
            this.resourceHandler.fileHandler.appName = value;
        }
    }
    get appName() {
        return this.resourceHandler ? this.resourceHandler.fileHandler.appName : '';
    }

    set userSettings(value) {
        if (typeof value !== 'object') {
            value = {} as UserSettings;
        }
        this._userSettings = value;
        if (this.viewController) {
            this.viewController.userSettings = value;
        }
        if (this.resourceHandler) {
            this.resourceHandler.userSettings = value;
        }
    }
    get userSettings() {
        return this._userSettings;
    }

    get viewData() {
        return [...this._views, ...this._includes];
    }

    get sessionData(): SessionData<NodeList<T>> {
        return {
            cache: this.session.cache,
            views: this._views,
            includes: this._includes
        };
    }

    get size() {
        return this._views.length + this._includes.length;
    }
}
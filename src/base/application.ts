import { APP_SECTION, BOX_STANDARD, NODE_ALIGNMENT, NODE_CONTAINER, NODE_PROCEDURE, NODE_RESOURCE, USER_AGENT } from '../lib/enumeration';

import Controller from './controller';
import Extension from './extension';
import Layout from './layout';
import Node from './node';
import NodeList from './nodelist';
import Resource from './resource';

import { cssParent, cssResolveUrl, deleteElementCache, getElementCache, getStyle, hasFreeFormText, isElementVisible, isPlainText, isStyleElement, isUserAgent, setElementCache } from '../lib/dom';
import { convertCamelCase, convertPX, convertWord, hasBit, hasValue, isNumber, isPercent, isString, resolvePath, sortAsc, trimNull, trimString } from '../lib/util';
import { formatPlaceholder, replaceIndent, replacePlaceholder } from '../lib/xml';

function getAlignmentFloat(right: boolean) {
    return NODE_ALIGNMENT.FLOAT | (right ? NODE_ALIGNMENT.RIGHT : 0);
}

function prioritizeExtensions<T extends Node>(documentRoot: HTMLElement, element: HTMLElement, extensions: Extension<T>[]) {
    const tagged: string[] = [];
    let current: HTMLElement | null = element;
    do {
        if (current.dataset.ext) {
            tagged.push(...current.dataset.ext.split(',').map(value => value.trim()));
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

export default class Application<T extends Node> implements androme.lib.base.Application<T> {
    public viewController: Controller<T>;
    public resourceHandler: Resource<T>;
    public nodeObject: Constructor<T>;
    public loading = false;
    public closed = false;
    public readonly builtInExtensions: ObjectMap<Extension<T>> = {};
    public readonly extensions = new Set<Extension<T>>();
    public readonly parseElements = new Set<HTMLElement>();

    public readonly session: AppSession<NodeList<T>> = {
        cache: new NodeList<T>(),
        image: new Map<string, ImageAsset>(),
        renderQueue: new Map<string, string[]>()
    };

    public readonly processing: AppProcessing<T, NodeList<T>> = {
        cache: new NodeList<T>(),
        depthMap: new Map<string, Map<number, string>>(),
        node: null,
        layout: null
    };

    private _settings: Settings;
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
        this.processRenderQueue();
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
        this.resourceHandler.finalize(this.viewData);
        this.viewController.finalize(this.viewData);
        for (const ext of this.extensions) {
            ext.afterFinalize();
        }
        this.closed = true;
    }

    public saveAllToDisk() {
        this.resourceHandler.fileHandler.saveAllToDisk(this.viewData);
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
            if (this.settings.preloadImages) {
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
        if (this.settings.preloadImages) {
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
        this.setRenderPosition(layout.node);
        if (layout.itemCount === 0) {
            return this.viewController.renderNode(layout);
        }
        else {
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
        const renderMap = this._renderPosition.get(parent.id);
        if (renderMap) {
            const filtered = node ? [node] : parent.duplicate() as T[];
            const result = renderMap.filter(item => !filtered.includes(item));
            result.push(...filtered);
            this._renderPosition.set(parent.id, result);
        }
        else {
            if (node) {
                this._renderPosition.set(parent.id, [node]);
            }
            else {
                this._renderPosition.set(parent.id, parent.duplicate() as T[]);
            }
        }
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
        let nodeTotal = 0;
        if (documentRoot === document.body) {
            Array.from(document.body.childNodes).some((item: Element) => isElementVisible(item, this.settings.hideOffScreenElements) && ++nodeTotal > 1);
        }
        const elements = documentRoot !== document.body ? documentRoot.querySelectorAll('*') : document.querySelectorAll(nodeTotal > 1 ? 'body, body *' : 'body *');
        this.processing.node = null;
        this.processing.cache.delegateAppend = undefined;
        this.processing.cache.clear();
        for (const ext of this.extensions) {
            ext.beforeInit(documentRoot);
        }
        const nodeRoot = this.insertNode(documentRoot);
        if (nodeRoot) {
            nodeRoot.parent = new this.nodeObject(0, (documentRoot === document.body ? documentRoot : documentRoot.parentElement) || document.body, this.viewController.delegateNodeInit);
            nodeRoot.documentRoot = true;
            this.processing.node = nodeRoot;
        }
        else {
            return false;
        }
        const localSettings = this.viewController.localSettings;
        const inlineAlways = localSettings.inline.always;
        const inlineSupport = this.settings.renderInlineText ? new Set<string>() : localSettings.inline.tagName;
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
                    if (inlineAlways.includes(element.tagName) || (inlineElement(element) && element.parentElement && Array.from(element.parentElement.children).every(item => inlineElement(item)))) {
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
                        let styleMap = getElementCache(element, 'styleMap');
                        if (styleMap === undefined) {
                            styleMap = {};
                            setElementCache(element, 'styleMap', styleMap);
                        }
                        switch (element.tagName) {
                            case 'SELECT':
                                if (styleMap.verticalAlign === undefined && (<HTMLSelectElement> element).size > 1) {
                                    styleMap.verticalAlign = 'text-bottom';
                                }
                                break;
                        }
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
                    else if (element.tagName !== 'BR') {
                        const elementNode = Node.getElementAsNode(element);
                        if (!inlineSupport.has(element.tagName) || (elementNode && !elementNode.excluded)) {
                            valid = true;
                        }
                    }
                });
                if (valid) {
                    nodes.forEach(element => this.insertNode(element, node));
                }
            }
            const preAlignment: ObjectIndex<StringMap> = {};
            const direction: HTMLElement[] = [];
            for (const node of this.processing.cache) {
                if (node.styleElement) {
                    const element = <HTMLElement> node.element;
                    const textAlign = node.css('textAlign');
                    preAlignment[node.id] = {};
                    const attrs = preAlignment[node.id];
                    ['right', 'end', element.tagName !== 'BUTTON' && (<HTMLInputElement> element).type !== 'button' ? 'center' : ''].some(value => {
                        if (value === textAlign) {
                            attrs.textAlign = value;
                            element.style.textAlign = 'left';
                            return true;
                        }
                        return false;
                    });
                    if (node.marginLeft < 0) {
                        attrs.marginLeft = node.css('marginLeft');
                        element.style.marginLeft = '0px';
                    }
                    if (node.marginTop < 0) {
                        attrs.marginTop = node.css('marginTop');
                        element.style.marginTop = '0px';
                    }
                    if (node.positionRelative) {
                        ['top', 'right', 'bottom', 'left'].forEach(value => {
                            if (node.has(value)) {
                                attrs[value] = node.styleMap[value];
                                element.style[value] = 'auto';
                            }
                        });
                    }
                    if (node.overflowX || node.overflowY) {
                        if (node.has('width')) {
                            attrs.width = node.styleMap.width;
                            element.style.width = 'auto';
                        }
                        if (node.has('height')) {
                            attrs.height = node.styleMap.height;
                            element.style.height = 'auto';
                        }
                        attrs.overflow = node.style.overflow || '';
                        element.style.overflow = 'visible';
                    }
                    if (element.dir === 'rtl') {
                        element.dir = 'ltr';
                        direction.push(element);
                    }
                }
                node.setBounds();
            }
            for (const node of this.processing.cache) {
                if (node.styleElement) {
                    const element = <HTMLElement> node.element;
                    const attrs = preAlignment[node.id];
                    if (attrs) {
                        for (const attr in attrs) {
                            element.style[attr] = attrs[attr];
                        }
                        if (direction.includes(element)) {
                            element.dir = 'rtl';
                        }
                    }
                }
            }
            for (const node of this.processing.cache) {
                if (!node.documentRoot) {
                    let parent = node.getParentElementAsNode(this.settings.supportNegativeLeftTop) as T | null;
                    if (!parent && !node.pageflow) {
                        parent = this.processing.node;
                    }
                    if (!parent || (!this.settings.supportNegativeLeftTop && node.pageflow && node.toInt('verticalAlign') !== 0 && parent && node.outsideX(parent.linear) && node.outsideX(parent.linear))) {
                        node.hide();
                    }
                    else {
                        node.parent = parent;
                        node.documentParent = parent;
                    }
                }
            }
            for (const node of this.processing.cache.elements) {
                if (node.htmlElement) {
                    let i = 0;
                    Array.from(node.element.childNodes).forEach((element: Element) => {
                        const item = Node.getElementAsNode(element);
                        if (item && !item.excluded && (item.pageflow || (item.left && item.left < 0))) {
                            item.siblingIndex = i++;
                        }
                    });
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
                const axisY: T[] = [];
                const below: T[] = [];
                const middle: T[] = [];
                const above: T[] = [];
                parent.each((node: T) => {
                    if (node.pageflow || node.alignOrigin) {
                        middle.push(node);
                    }
                    else {
                        const zIndex = node.toInt('zIndex');
                        if (zIndex > 0 || (!parent.documentBody && parent.element !== node.element.parentElement)) {
                            above.push(node);
                        }
                        else if (zIndex === 0) {
                            middle.push(node);
                        }
                        else {
                            below.push(node);
                        }
                    }
                });
                axisY.push(...sortAsc(below, 'style.zIndex', 'id'));
                axisY.push(...middle);
                axisY.push(...sortAsc(above, 'style.zIndex', 'id'));
                const floatEnabled = axisY.some(node => node.floating);
                const cleared = floatEnabled ? NodeList.clearedAll(parent) : undefined;
                let k = -1;
                while (++k < axisY.length) {
                    let nodeY = axisY[k];
                    if (!nodeY.visible || nodeY.rendered || (!nodeY.documentRoot && this.parseElements.has(<HTMLElement> nodeY.element))) {
                        continue;
                    }
                    let parentY = nodeY.parent as T;
                    if (nodeY.renderAs) {
                        nodeY.hide();
                        nodeY = nodeY.renderAs as T;
                    }
                    if (!nodeY.hasBit('excludeSection', APP_SECTION.DOM_TRAVERSE) && axisY.length > 1 && k < axisY.length - 1) {
                        if (nodeY.pageflow && !parentY.hasAlign(NODE_ALIGNMENT.AUTO_LAYOUT) && (parentY.alignmentType === NODE_ALIGNMENT.NONE || parentY.hasAlign(NODE_ALIGNMENT.UNKNOWN) || nodeY.hasAlign(NODE_ALIGNMENT.EXTENDABLE))) {
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
                            if (nodeY.hasAlign(NODE_ALIGNMENT.EXTENDABLE)) {
                                horizontal.push(nodeY);
                                l++;
                                m++;
                            }
                            domNested: {
                                for ( ; l < axisY.length; l++, m++) {
                                    const adjacent = axisY[l];
                                    if (adjacent.pageflow) {
                                        if (floatEnabled) {
                                            const float = cleared && cleared.get(adjacent);
                                            if (float) {
                                                if (float === 'both') {
                                                    floatAvailable.clear();
                                                }
                                                else {
                                                    floatAvailable.delete(float);
                                                }
                                            }
                                            if (adjacent.floating) {
                                                floatAvailable.add(adjacent.float);
                                            }
                                        }
                                        const previousSibling = adjacent.previousSibling() as T;
                                        const nextSibling = adjacent.nextSibling(true);
                                        if (m === 0 && nextSibling) {
                                            if (adjacent.blockStatic || nextSibling.alignedVertically(adjacent, cleared, 0, true)) {
                                                vertical.push(adjacent);
                                            }
                                            else {
                                                horizontal.push(adjacent);
                                            }
                                        }
                                        else if (previousSibling) {
                                            if (floatEnabled) {
                                                const floated = NodeList.floated([...horizontal, ...vertical]);
                                                const pending = [...horizontal, ...vertical, adjacent];
                                                const clearedPartial = NodeList.cleared(pending);
                                                const clearedPrevious = new Map<T, string>();
                                                if (clearedPartial.has(previousSibling) || (previousSibling.lineBreak && cleared && cleared.has(previousSibling))) {
                                                    clearedPrevious.set(previousSibling, previousSibling.css('clear'));
                                                }
                                                const verticalAlign = adjacent.alignedVertically(previousSibling, clearedPrevious, floated.size);
                                                if (verticalAlign || clearedPartial.has(adjacent) || (this.settings.floatOverlapDisabled && previousSibling.floating && adjacent.blockStatic && floatAvailable.size === 2)) {
                                                    if (horizontal.length) {
                                                        if (!this.settings.floatOverlapDisabled) {
                                                            if (floatAvailable.size > 0 && !pending.map(node => clearedPartial.get(node)).includes('both') && (
                                                                    floated.size === 0 ||
                                                                    adjacent.bounds.top < Math.max.apply(null, horizontal.filter(node => node.floating).map(node => node.bounds.bottom))
                                                               ))
                                                            {
                                                                if (clearedPartial.has(adjacent)) {
                                                                    if (floatAvailable.size < 2 && floated.size === 2 && !adjacent.floating) {
                                                                        adjacent.alignmentType |= NODE_ALIGNMENT.EXTENDABLE;
                                                                        verticalExtended = true;
                                                                        horizontal.push(adjacent);
                                                                        continue;
                                                                    }
                                                                    break domNested;
                                                                }
                                                                else if (!verticalAlign) {
                                                                    horizontal.push(adjacent);
                                                                    continue;
                                                                }
                                                                if (floated.size === 1 && (!adjacent.floating || floatAvailable.has(adjacent.float))) {
                                                                    horizontal.push(adjacent);
                                                                    continue;
                                                                }
                                                            }
                                                        }
                                                        break domNested;
                                                    }
                                                    checkVertical(adjacent);
                                                }
                                                else {
                                                    if (!checkHorizontal(adjacent)) {
                                                        break domNested;
                                                    }
                                                }
                                            }
                                            else {
                                                if (adjacent.alignedVertically(previousSibling)) {
                                                    checkVertical(adjacent);
                                                }
                                                else {
                                                    if (!checkHorizontal(adjacent)) {
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
                            const layout = new Layout(null as any, parentY);
                            let output = '';
                            if (horizontal.length > 1) {
                                layout.items = horizontal;
                                layout.itemCount = horizontal.length;
                                const floated = NodeList.floated(horizontal);
                                const clearedPartial = NodeList.cleared(horizontal);
                                const linearX = NodeList.linearX(horizontal);
                                const segmentEnd = horizontal[horizontal.length - 1];
                                if (this.viewController.checkConstraintFloat(parentY, horizontal, floated, clearedPartial, linearX)) {
                                    layout.node = this.viewController.createNodeGroup(nodeY, parentY, horizontal);
                                    layout.setType(NODE_CONTAINER.CONSTRAINT, getAlignmentFloat(floated.has('right')));
                                }
                                else if (this.viewController.checkFrameHorizontal(parentY, horizontal, floated, clearedPartial, linearX)) {
                                    layout.node = this.viewController.createNodeGroup(nodeY, parentY, horizontal);
                                    output = this.processLayoutHorizontal(layout.node, parentY, horizontal, floated, clearedPartial, linearX);
                                }
                                else if (horizontal.length !== axisY.length) {
                                    let containerType = 0;
                                    layout.node = this.viewController.createNodeGroup(nodeY, parentY, horizontal);
                                    if (this.viewController.checkConstraintHorizontal(nodeY, horizontal, floated, clearedPartial, linearX)) {
                                        containerType = NODE_CONTAINER.CONSTRAINT;
                                    }
                                    else if (this.viewController.checkRelativeHorizontal(parentY, horizontal, floated, clearedPartial, linearX)) {
                                        containerType = NODE_CONTAINER.RELATIVE;
                                    }
                                    else {
                                        containerType = NODE_CONTAINER.LINEAR;
                                    }
                                    layout.setType(containerType, NODE_ALIGNMENT.HORIZONTAL);
                                }
                                else {
                                    parentY.alignmentType |= NODE_ALIGNMENT.HORIZONTAL;
                                }
                                if (floated.size > 0 && output === '') {
                                    layout.or(getAlignmentFloat(floated.has('right')));
                                    NodeList.sortByAlignment(horizontal, NODE_ALIGNMENT.FLOAT);
                                }
                                if (segmentEnd === axisY[axisY.length - 1]) {
                                    parentY.alignmentType ^= NODE_ALIGNMENT.UNKNOWN;
                                }
                            }
                            else if (vertical.length > 1) {
                                layout.items = vertical;
                                layout.itemCount = vertical.length;
                                const floated = NodeList.floated(vertical);
                                const clearedPartial = NodeList.cleared(vertical);
                                const segmentEnd = vertical[vertical.length - 1];
                                if (floated.size > 0 && clearedPartial.size > 0 && !(floated.size === 1 && vertical.slice(1, vertical.length - 1).every(node => clearedPartial.has(node)))) {
                                    if (parentY.linearVertical && !hasValue(nodeY.dataset.ext)) {
                                        layout.node = nodeY;
                                        output = this.processLayoutVertical(undefined, parentY, vertical, clearedPartial);
                                    }
                                    else {
                                        layout.node = this.viewController.createNodeGroup(nodeY, parentY, vertical);
                                        output = this.processLayoutVertical(layout.node, parentY, vertical, clearedPartial);
                                    }
                                }
                                else if (vertical.length !== axisY.length) {
                                    if (!linearVertical) {
                                        layout.node = this.viewController.createNodeGroup(nodeY, parentY, vertical);
                                        layout.setType(NODE_CONTAINER.LINEAR, NODE_ALIGNMENT.VERTICAL);
                                    }
                                    if (!segmentEnd.blockStatic && segmentEnd !== axisY[axisY.length - 1]) {
                                        segmentEnd.alignmentType |= NODE_ALIGNMENT.EXTENDABLE;
                                    }
                                }
                                else {
                                    parentY.alignmentType |= NODE_ALIGNMENT.VERTICAL;
                                }
                                if (segmentEnd === axisY[axisY.length - 1]) {
                                    parentY.alignmentType ^= NODE_ALIGNMENT.UNKNOWN;
                                }
                            }
                            if (layout.node) {
                                if (output === '') {
                                    output = this.renderNode(layout);
                                }
                                this.addRenderTemplate(layout.node, parentY, output, true);
                                parentY = nodeY.parent as T;
                            }
                            nodeY.alignmentType ^= NODE_ALIGNMENT.EXTENDABLE;
                        }
                    }
                    if (!nodeY.hasBit('excludeSection', APP_SECTION.EXTENSION) && !nodeY.rendered) {
                        let next = false;
                        for (const ext of [...parentY.renderExtension, ...extensions.filter(item => item.subscribersChild.has(nodeY))]) {
                            const result = ext.processChild(nodeY, parentY);
                            if (result.output !== '') {
                                this.addRenderTemplate(nodeY, parentY, result.output);
                            }
                            if (result.renderAs && result.renderOutput) {
                                this.addRenderTemplate(result.renderAs as T, parentY, result.renderOutput);
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
                                    if (result.renderAs && result.renderOutput) {
                                        this.addRenderTemplate(result.renderAs as T, parentY, result.renderOutput);
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
                        const layout = new Layout(nodeY, parentY);
                        let containerType = nodeY.containerType || Controller.getContainerType(nodeY.tagName);
                        let output = '';
                        if (containerType === 0) {
                            if (nodeY.length > 0) {
                                layout.items = nodeY.children as T[];
                                layout.itemCount = nodeY.length;
                                if (nodeY.has('columnCount')) {
                                    layout.columnCount = nodeY.toInt('columnCount');
                                    containerType = NODE_CONTAINER.CONSTRAINT;
                                    layout.or(NODE_ALIGNMENT.COLUMN | NODE_ALIGNMENT.AUTO_LAYOUT);
                                }
                                else if (nodeY.some(node => !node.pageflow)) {
                                    containerType = NODE_CONTAINER.CONSTRAINT;
                                    layout.or(NODE_ALIGNMENT.ABSOLUTE | NODE_ALIGNMENT.UNKNOWN);
                                    NodeList.sortByAlignment(layout.items, NODE_ALIGNMENT.ABSOLUTE);
                                }
                                else {
                                    if (nodeY.length === 1) {
                                        const targeted = nodeY.filter(node => {
                                            if (node.dataset.target) {
                                                const element = document.getElementById(node.dataset.target);
                                                return element !== null && hasValue(element.dataset.ext) && element !== parentY.element;
                                            }
                                            return false;
                                        });
                                        const child = nodeY.item(0) as T;
                                        if (nodeY.documentRoot && targeted.length === 1) {
                                            nodeY.hide();
                                            continue;
                                        }
                                        else if (
                                            this.settings.collapseUnattributedElements &&
                                            !hasValue(nodeY.element.id) &&
                                            !hasValue(nodeY.dataset.ext) &&
                                            !hasValue(nodeY.dataset.target) &&
                                            nodeY.toInt('width') === 0 &&
                                            nodeY.toInt('height') === 0 &&
                                            nodeY.lineHeight === 0 &&
                                            !child.hasWidth && !child.boxStyle.hasBorder &&
                                            !nodeY.boxStyle.hasBackground &&
                                            !nodeY.has('textAlign') && !nodeY.has('verticalAlign') &&
                                            nodeY.float !== 'right' && !nodeY.autoMargin && nodeY.alignOrigin &&
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
                                            layout.or(NODE_ALIGNMENT.SINGLE);
                                        }
                                    }
                                    else {
                                        const children = nodeY.children as T[];
                                        const [linearX, linearY] = [NodeList.linearX(children), NodeList.linearY(children)];
                                        const floated = NodeList.floated(children);
                                        const clearedInside = NodeList.clearedAll(nodeY);
                                        if (this.viewController.checkConstraintFloat(nodeY, children, floated, clearedInside, linearX)) {
                                            containerType = NODE_CONTAINER.CONSTRAINT;
                                            layout.or(getAlignmentFloat(floated.has('right')));
                                        }
                                        else if (linearX) {
                                            if (this.viewController.checkFrameHorizontal(nodeY, children, floated, clearedInside, linearX)) {
                                                output = this.processLayoutHorizontal(nodeY, parentY, children, floated, clearedInside, linearX);
                                            }
                                            else if (this.viewController.checkConstraintHorizontal(nodeY, children, floated, clearedInside, linearX)) {
                                                containerType = NODE_CONTAINER.CONSTRAINT;
                                            }
                                            else if (this.viewController.checkRelativeHorizontal(nodeY, children, floated, clearedInside, linearX)) {
                                                containerType = NODE_CONTAINER.RELATIVE;
                                            }
                                            else {
                                                containerType = NODE_CONTAINER.LINEAR;
                                            }
                                            layout.or(NODE_ALIGNMENT.HORIZONTAL);
                                            if (floated.size > 0) {
                                                layout.or(getAlignmentFloat(floated.has('right')));
                                                if (output === '') {
                                                    NodeList.sortByAlignment(children, NODE_ALIGNMENT.HORIZONTAL);
                                                }
                                            }
                                        }
                                        else if (linearY) {
                                            containerType = NODE_CONTAINER.LINEAR;
                                            layout.or(NODE_ALIGNMENT.VERTICAL | (nodeY.documentRoot ? NODE_ALIGNMENT.UNKNOWN : 0));
                                        }
                                        else if (children.every(node => node.inlineflow)) {
                                            if (this.viewController.checkFrameHorizontal(nodeY, children, floated, clearedInside, linearX)) {
                                                output = this.processLayoutHorizontal(nodeY, parentY, children, floated, clearedInside, linearX);
                                            }
                                            else {
                                                containerType = NODE_CONTAINER.RELATIVE;
                                                layout.or(NODE_ALIGNMENT.HORIZONTAL | NODE_ALIGNMENT.UNKNOWN);
                                            }
                                        }
                                        else if (children.some(node => node.alignedVertically(node.previousSibling(), clearedInside, floated.size))) {
                                            containerType = NODE_CONTAINER.LINEAR;
                                            layout.or(NODE_ALIGNMENT.VERTICAL | NODE_ALIGNMENT.UNKNOWN);
                                        }
                                        else {
                                            containerType = NODE_CONTAINER.CONSTRAINT;
                                            layout.or(NODE_ALIGNMENT.UNKNOWN);
                                        }
                                    }
                                }
                            }
                            else {
                                const boxStyle = nodeY.boxStyle;
                                const freeFormText = hasFreeFormText(nodeY.element, this.settings.renderInlineText ? 0 : 1);
                                if (freeFormText || (boxStyle.hasBorder && nodeY.textContent.length)) {
                                    containerType = NODE_CONTAINER.TEXT;
                                }
                                else if (boxStyle.hasBackgroundImage && nodeY.css('backgroundRepeat') === 'no-repeat' && (!nodeY.inlineText || nodeY.toInt('textIndent') + nodeY.bounds.width < 0)) {
                                    containerType = NODE_CONTAINER.IMAGE;
                                    layout.or(NODE_ALIGNMENT.SINGLE);
                                    nodeY.excludeResource |= NODE_RESOURCE.FONT_STYLE | NODE_RESOURCE.VALUE_STRING;
                                }
                                else if (nodeY.block && (boxStyle.hasBorder || boxStyle.hasBackgroundImage) && (boxStyle.hasBorder || nodeY.paddingTop + nodeY.paddingRight + nodeY.paddingRight + nodeY.paddingLeft > 0)) {
                                    containerType = NODE_CONTAINER.LINE;
                                }
                                else if (!nodeY.documentRoot) {
                                    if (this.settings.collapseUnattributedElements && nodeY.bounds.height === 0 && !hasValue(nodeY.element.id) && !hasValue(nodeY.dataset.ext) && !boxStyle.hasBackground) {
                                        parentY.remove(nodeY);
                                        nodeY.hide();
                                    }
                                    else if (boxStyle.hasBackground) {
                                        containerType = NODE_CONTAINER.TEXT;
                                    }
                                    else {
                                        containerType = NODE_CONTAINER.FRAME;
                                    }
                                }
                            }
                        }
                        else {
                            layout.itemCount = nodeY.length;
                            layout.items = nodeY.children as T[];
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
            const elementNode = new this.nodeObject(this.processing.cache.nextId, element, this.viewController.delegateNodeInit);
            if (isElementVisible(element, this.settings.hideOffScreenElements)) {
                node = elementNode;
                node.setExclusions();
            }
            else {
                elementNode.excluded = true;
                elementNode.visible = false;
            }
        }
        if (node) {
            this.processing.cache.append(node);
        }
        return node;
    }

    protected processLayoutHorizontal(group: T, parent: T, nodes: T[], floated: Set<string>, cleared: Map<T, string>, linearX: boolean) {
        let layerIndex: Array<T[] | T[][]> = [];
        let output = '';
        if (cleared.size === 0 && nodes.every(node => !node.autoMargin)) {
            const inline: T[] = [];
            const left: T[] = [];
            const right: T[] = [];
            for (const node of nodes) {
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
            const layout = new Layout(group, parent, 0, 0, nodes.length);
            if (inline.length === nodes.length || left.length === nodes.length || right.length === nodes.length) {
                layout.items = nodes;
                layout.or(NODE_ALIGNMENT.HORIZONTAL);
                if (inline.length === 0) {
                    layout.or(getAlignmentFloat(right.length > 0));
                    NodeList.sortByAlignment(nodes, NODE_ALIGNMENT.HORIZONTAL);
                }
                if (this.viewController.checkConstraintFloat(group, nodes)) {
                    layout.setType(NODE_CONTAINER.CONSTRAINT);
                    return this.renderNode(layout);
                }
                else if (this.viewController.checkRelativeHorizontal(group, nodes, floated, cleared, linearX)) {
                    layout.setType(NODE_CONTAINER.RELATIVE);
                    return this.renderNode(layout);
                }
                else {
                    layout.setType(NODE_CONTAINER.LINEAR);
                    return this.renderNode(layout);
                }
            }
            else if (left.length === 0 || right.length === 0) {
                if (NodeList.linearY(nodes)) {
                    layout.items = nodes;
                    layout.setType(NODE_CONTAINER.LINEAR, NODE_ALIGNMENT.VERTICAL);
                    return this.renderNode(layout);
                }
                else {
                    const subgroup: T[] = [];
                    if (right.length === 0) {
                        subgroup.push(...left, ...inline);
                    }
                    else {
                        layout.or(NODE_ALIGNMENT.RIGHT);
                        subgroup.push(...inline, ...right);
                    }
                    layout.items = subgroup;
                    NodeList.sortByAlignment(subgroup, NODE_ALIGNMENT.FLOAT);
                    if (this.viewController.checkRelativeHorizontal(group, nodes, floated, cleared, linearX)) {
                        layout.setType(NODE_CONTAINER.LINEAR, NODE_CONTAINER.RELATIVE | NODE_ALIGNMENT.FLOAT);
                        return this.renderNode(layout);
                    }
                    else if (!this.settings.floatOverlapDisabled && right.length === 0) {
                        layout.setType(NODE_CONTAINER.LINEAR, NODE_ALIGNMENT.HORIZONTAL | NODE_ALIGNMENT.FLOAT);
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
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                if (cleared.has(node)) {
                    const clear = cleared.get(node);
                    if (hasBit(pendingFloat, clear === 'right' ? 4 : 2) || (pendingFloat !== 0 && clear === 'both')) {
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
                    if (node.floating) {
                        if (node.float === 'right') {
                            rightAbove.push(node);
                            if (node.floating) {
                                pendingFloat |= 4;
                            }
                        }
                        else {
                            leftAbove.push(node);
                            if (node.floating) {
                                pendingFloat |= 2;
                            }
                        }
                    }
                    else if (node.autoMargin) {
                        if (node.autoMarginLeft) {
                            if (rightAbove.length) {
                                rightBelow.push(node);
                            }
                            else {
                                rightAbove.push(node);
                            }
                        }
                        else if (node.autoMarginRight) {
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
                    if (node.floating) {
                        if (node.float === 'right') {
                            if (rightBelow.length === 0) {
                                pendingFloat |= 4;
                            }
                            if (!this.settings.floatOverlapDisabled && current !== 'right' && rightAbove.length) {
                                rightAbove.push(node);
                            }
                            else {
                                rightBelow.push(node);
                            }
                        }
                        else {
                            if (leftBelow.length === 0) {
                                pendingFloat |= 2;
                            }
                            if (!this.settings.floatOverlapDisabled && current !== 'left' && leftAbove.length) {
                                leftAbove.push(node);
                            }
                            else {
                                leftBelow.push(node);
                            }
                        }
                    }
                    else if (node.autoMargin) {
                        if (node.autoMarginLeft && rightBelow.length) {
                            rightBelow.push(node);
                        }
                        else if (node.autoMarginRight && leftBelow.length) {
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
                if (leftBelow.length > 1) {
                    leftBelow[0].alignmentType |= NODE_ALIGNMENT.EXTENDABLE;
                }
            }
            else if (leftAbove.length) {
                leftSub = leftAbove;
            }
            else if (leftBelow.length) {
                leftSub = leftBelow;
            }
            if (rightAbove.length && rightBelow.length) {
                rightSub = [rightAbove, rightBelow];
                if (rightBelow.length > 1) {
                    rightBelow[0].alignmentType |= NODE_ALIGNMENT.EXTENDABLE;
                }
            }
            else if (rightAbove.length) {
                rightSub = rightAbove;
            }
            else if (rightBelow.length) {
                rightSub = rightBelow;
            }
            const alignmentType = getAlignmentFloat(floated.size === 1 && floated.has('right'));
            const layout = new Layout(group, parent, 0, alignmentType);
            if (this.settings.floatOverlapDisabled) {
                layerIndex.push(inlineAbove, [leftAbove, rightAbove], inlineBelow);
                if (parent.linearVertical) {
                    group.alignmentType |= alignmentType;
                    output = formatPlaceholder(group.id);
                    group.render(parent);
                    group.renderDepth--;
                }
                else {
                    layout.itemCount = (inlineAbove.length ? 1 : 0) + (leftAbove.length + rightAbove.length ? 1 : 0) + (inlineBelow.length ? 1 : 0);
                    layout.setType(NODE_CONTAINER.LINEAR, NODE_ALIGNMENT.VERTICAL);
                    output = this.renderNode(layout);
                }
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
                    if (inlineAbove.length > 1) {
                        inlineAbove[0].alignmentType |= NODE_ALIGNMENT.EXTENDABLE;
                    }
                }
                else {
                    if ((leftSub === leftBelow && rightSub === rightAbove) || (leftSub === leftAbove && rightSub === rightBelow)) {
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
                    floatgroup = this.viewController.createNodeGroup(grouping[0], group, grouping);
                    const layout = new Layout(
                        floatgroup,
                        group,
                        0,
                        NODE_ALIGNMENT.FLOAT | ((item as T[][]).some(segment => segment === rightSub || segment === rightAbove) ? NODE_ALIGNMENT.RIGHT : 0),
                        item.length
                    );
                    if (this.settings.floatOverlapDisabled) {
                        layout.setType(NODE_CONTAINER.FRAME);
                    }
                    else {
                        if (group.linearVertical) {
                            floatgroup = group;
                        }
                        else {
                            layout.setType(NODE_CONTAINER.LINEAR, NODE_ALIGNMENT.VERTICAL);
                        }
                    }
                    if (layout.containerType !== 0) {
                        output = replacePlaceholder(output, group.id, this.renderNode(layout));
                    }
                }
                else {
                    floatgroup = null;
                }
                ((Array.isArray(item[0]) ? item : [item]) as T[][]).forEach(segment => {
                    let basegroup = group;
                    if (floatgroup && floating.includes(segment)) {
                        basegroup = floatgroup;
                    }
                    if (segment.length > 1) {
                        const subgroup = this.viewController.createNodeGroup(segment[0], basegroup, segment);
                        const layout = new Layout(
                            subgroup,
                            basegroup,
                            0,
                            NODE_ALIGNMENT.SEGMENTED,
                            segment.length,
                            segment
                        );
                        const floatedSegment = NodeList.floated(segment);
                        const clearedSegment = NodeList.cleared(segment);
                        const linearXSegment = NodeList.linearX(segment);
                        let containerType = 0;
                        let alignmentType = 0;
                        if (this.viewController.checkConstraintFloat(subgroup, segment, floatedSegment, clearedSegment, linearXSegment)) {
                            containerType = NODE_CONTAINER.CONSTRAINT;
                        }
                        else if (this.viewController.checkRelativeHorizontal(subgroup, segment, floatedSegment, clearedSegment, linearXSegment)) {
                            containerType = NODE_CONTAINER.RELATIVE;
                            alignmentType |= NODE_ALIGNMENT.HORIZONTAL;
                        }
                        else {
                            containerType = NODE_CONTAINER.LINEAR;
                            alignmentType |= linearXSegment ? NODE_ALIGNMENT.HORIZONTAL : NODE_ALIGNMENT.VERTICAL;
                        }
                        if (linearXSegment) {
                            alignmentType |= NODE_ALIGNMENT.NOWRAP;
                        }
                        if (floatedSegment.size > 0) {
                            alignmentType |= getAlignmentFloat(floatedSegment.has('right'));
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
                            single.alignmentType |= getAlignmentFloat(single.float === 'right');
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

    protected processLayoutVertical(group: T | undefined, parent: T, nodes: T[], cleared: Map<T, string>) {
        let output = '';
        if (group) {
            const layout = new Layout(
                group,
                parent,
                NODE_CONTAINER.LINEAR,
                NODE_ALIGNMENT.VERTICAL,
                nodes.length
            );
            output = this.renderNode(layout);
        }
        else {
            group = parent;
            output = formatPlaceholder(group.id);
        }
        const staticRows: T[][] = [];
        const floatedRows: T[][] = [];
        const current: T[] = [];
        const floated: T[] = [];
        let leadingMargin = 0;
        let clearReset = false;
        let linearVertical = true;
        nodes.some(node => {
            if (!node.floating) {
                leadingMargin += node.linear.height;
                return true;
            }
            return false;
        });
        for (const node of nodes) {
            if (cleared.has(node)) {
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
                if (clearReset && !cleared.has(node)) {
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
                const pageflow = staticRows[i] || [];
                if (pageflow.length || floating.length) {
                    const basegroup = this.viewController.createNodeGroup(floating[0] || pageflow[0], group, []);
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
                    if (pageflow.length > 1) {
                        subgroup = this.viewController.createNodeGroup(pageflow[0], basegroup, pageflow);
                    }
                    else if (pageflow.length) {
                        subgroup = pageflow[0];
                        subgroup.parent = basegroup;
                    }
                    if (subgroup) {
                        children.push(subgroup);
                    }
                    basegroup.init();
                    const layout = new Layout(
                        basegroup,
                        group,
                        NODE_CONTAINER.FRAME,
                        NODE_ALIGNMENT.VERTICAL | alignmentType,
                        children.length
                    );
                    content += this.renderNode(layout);
                    children.forEach((node, index) => {
                        if (nodes.includes(node)) {
                            content = replacePlaceholder(content, basegroup.id, `{:${basegroup.id}:${index}}`);
                        }
                        else {
                            const childData = new Layout(
                                node,
                                basegroup,
                                NODE_CONTAINER.LINEAR,
                                NODE_ALIGNMENT.VERTICAL | NODE_ALIGNMENT.SEGMENTED | (node.some(item => item.floating) ? NODE_ALIGNMENT.FLOAT : 0),
                                node.length,
                                node.children as T[]
                            );
                            content = replacePlaceholder(content, basegroup.id, this.renderNode(childData));
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
        for (const value of this.layouts) {
            for (const id in template) {
                value.content = value.content.replace(formatPlaceholder(id), template[id]);
            }
            value.content = this.viewController.replaceRenderQueue(value.content);
        }
    }

    private setStyleMap() {
        let warning = false;
        const dpi = this.settings.resolutionDPI;
        const clientFirefox = isUserAgent(USER_AGENT.FIREFOX);
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
                                if (this.settings.preloadImages && hasValue(styleMap.backgroundImage) && styleMap.backgroundImage !== 'initial') {
                                    styleMap.backgroundImage.split(',')
                                        .map((value: string) => value.trim())
                                        .forEach(value => {
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

    set settings(value) {
        if (typeof value !== 'object') {
            value = {} as Settings;
        }
        this._settings = value;
        if (this.viewController) {
            this.viewController.settings = value;
        }
        if (this.resourceHandler) {
            this.resourceHandler.settings = value;
        }
    }
    get settings() {
        return this._settings;
    }

    get layouts() {
        return [...this._views, ...this._includes];
    }

    get viewData(): ViewData<NodeList<T>> {
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
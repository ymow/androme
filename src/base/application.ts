import { APP_SECTION, BOX_STANDARD, NODE_ALIGNMENT, NODE_PROCEDURE, NODE_RESOURCE, USER_AGENT } from '../lib/enumeration';

import Controller from './controller';
import Extension from './extension';
import ExtensionManager from './extensionmanager';
import Layout from './layout';
import Node from './node';
import NodeList from './nodelist';
import Resource from './resource';

import { checkStyleAttribute, cssParent, cssResolveUrl, deleteElementCache, getElementAsNode, getElementCache, getLastChildElement, getStyle, isPlainText, hasComputedStyle, isUserAgent, removeElementsByClassName, setElementCache, withinViewportOrigin } from '../lib/dom';
import { convertCamelCase, convertInt, convertPX, convertWord, hasBit, hasValue, isNumber, maxArray, minArray, resolvePath, sortAsc, trimNull, trimString } from '../lib/util';
import { formatPlaceholder, replacePlaceholder } from '../lib/xml';

function prioritizeExtensions<T extends Node>(documentRoot: HTMLElement, element: HTMLElement, extensions: Extension<T>[]) {
    const tagged: string[] = [];
    let current: HTMLElement | null = element;
    do {
        if (current.dataset.use) {
            for (const value of current.dataset.use.split(',')) {
                tagged.push(value.trim());
            }
        }
        current = current !== documentRoot ? current.parentElement : null;
    }
    while (current);
    if (tagged.length) {
        const result: Extension<T>[] = [];
        const untagged: Extension<T>[] = [];
        for (const ext of extensions) {
            const index = tagged.indexOf(ext.name);
            if (index !== -1) {
                result[index] = ext;
            }
            else {
                untagged.push(ext);
            }
        }
        return [...result.filter(item => item), ...untagged];
    }
    else {
        return extensions;
    }
}

function checkPositionStatic<T extends Node>(node: T, parent: T) {
    const previousSiblings = node.previousSiblings();
    const nextSiblings = node.nextSiblings();
    if (node.positionAuto &&
        (previousSiblings.length === 0 || !previousSiblings.some(item => item.multiLine > 0 || item.excluded && !item.blockStatic)) &&
        (nextSiblings.length === 0 || nextSiblings.every(item => item.blockStatic || item.lineBreak || item.excluded) || node.element === getLastChildElement(parent.element)))
    {
        node.cssApply({
            'position': 'static',
            'display': 'inline-block',
            'verticalAlign': 'top'
        }, true);
        return true;
    }
    return false;
}

function compareRange(operation: string, value: number, range: number) {
    switch (operation) {
        case '<=':
            return value <= range;
        case '<':
            return value < range;
        case '>=':
            return value >= range;
        case '>':
            return value > range;
        default:
            return value === range;
    }
}

export default class Application<T extends Node> implements androme.lib.base.Application<T> {
    public controllerHandler: Controller<T>;
    public resourceHandler: Resource<T>;
    public extensionManager: ExtensionManager<T>;
    public initialized = false;
    public closed = false;

    public readonly builtInExtensions: ObjectMap<Extension<T>> = {};
    public readonly extensions = new Set<Extension<T>>();
    public readonly parseElements = new Set<HTMLElement>();

    public readonly session: AppSession<T, NodeList<T>> = {
        cache: new NodeList<T>(),
        image: new Map<string, ImageAsset>(),
        renderQueue: new Map<string, string[]>(),
        excluded: new NodeList<T>(),
    };

    public readonly processing: AppProcessing<T, NodeList<T>> = {
        cache: new NodeList<T>(),
        depthMap: new Map<number, Map<string, string>>(),
        node: null,
        layout: null,
        excluded: new NodeList<T>()
    };

    private _userSettings: UserSettings | undefined;
    private _renderPosition = new Map<number, { parent: T; children: T[] }>();

    private readonly _views: FileAsset[] = [];
    private readonly _includes: FileAsset[] = [];

    constructor(
        public framework: number,
        controllerConstructor: Constructor<T>,
        resourceConstructor: Constructor<T>,
        extensionManagerHandler: Constructor<T>,
        public nodeConstructor: Constructor<T>)
    {
        this.controllerHandler = (<unknown> new controllerConstructor(this, this.processing.cache)) as Controller<T>;
        this.resourceHandler = (<unknown> new resourceConstructor(this, this.processing.cache)) as Resource<T>;
        this.extensionManager = (<unknown> new extensionManagerHandler(this, this.processing.cache)) as ExtensionManager<T>;
    }

    public registerController(handler: Controller<T>) {
        handler.application = this;
        handler.cache = this.processing.cache;
        this.controllerHandler = handler;
    }

    public registerResource(handler: Resource<T>) {
        handler.application = this;
        handler.cache = this.processing.cache;
        this.resourceHandler = handler;
    }

    public finalize() {
        const rendered = this.rendered;
        for (const node of rendered) {
            if (!node.hasBit('excludeProcedure', NODE_PROCEDURE.LAYOUT)) {
                node.setLayout();
            }
            if (!node.hasBit('excludeProcedure', NODE_PROCEDURE.ALIGNMENT)) {
                node.setAlignment();
            }
        }
        for (const node of rendered) {
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
        for (const node of this.rendered) {
            if (!node.hasBit('excludeResource', NODE_RESOURCE.BOX_SPACING)) {
                node.setBoxSpacing();
            }
        }
        for (const ext of this.extensions) {
            ext.afterProcedure();
        }
        this.processRenderQueue();
        this.resourceHandler.finalize(this.sessionData);
        this.controllerHandler.finalize(this.sessionData);
        for (const ext of this.extensions) {
            ext.afterFinalize();
        }
        removeElementsByClassName('__css.placeholder');
        this.closed = true;
    }

    public saveAllToDisk() {
        if (this.resourceHandler.fileHandler) {
            this.resourceHandler.fileHandler.saveAllToDisk(this.sessionData);
        }
    }

    public reset() {
        this.session.cache.each(node => node.baseElement && deleteElementCache(node.baseElement, 'node', 'style', 'styleMap'));
        for (const element of this.parseElements) {
            delete element.dataset.iteration;
            delete element.dataset.layoutName;
        }
        this.appName = '';
        this.session.renderQueue.clear();
        this.session.image.clear();
        this.session.cache.reset();
        this.session.excluded.reset();
        this.processing.cache.reset();
        this.controllerHandler.reset();
        this.resourceHandler.reset();
        this._views.length = 0;
        this._includes.length = 0;
        this._renderPosition.clear();
        for (const ext of this.extensions) {
            ext.subscribers.clear();
            ext.subscribersChild.clear();
        }
        this.closed = false;
    }

    public parseDocument(...elements: any[]): FunctionMap<void> {
        let __THEN: () => void;
        this.parseElements.clear();
        this.initialized = false;
        this.setStyleMap();
        if (this.appName === '' && elements.length === 0) {
            elements.push(document.body);
        }
        for (const value of elements) {
            const element = typeof value === 'string' ? document.getElementById(value) : value;
            if (hasComputedStyle(element)) {
                this.parseElements.add(element);
            }
        }
        const documentRoot = this.parseElements.values().next().value;
        const parseResume = () => {
            this.initialized = false;
            if (this.userSettings.preloadImages) {
                removeElementsByClassName('__css.preload');
            }
            for (const [uri, image] of this.session.image.entries()) {
                Resource.ASSETS.images.set(uri, image);
            }
            for (const ext of this.extensions) {
                ext.beforeParseDocument();
            }
            for (const element of this.parseElements) {
                if (this.appName === '') {
                    this.appName = element.id || 'untitled';
                }
                let filename = trimNull(element.dataset.filename).replace(new RegExp(`\.${this.controllerHandler.localSettings.layout.fileExtension}$`), '');
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
                    const uri = resolvePath(image.href.baseVal);
                    this.session.image.set(uri, {
                        width: image.width.baseVal.value,
                        height: image.height.baseVal.value,
                        uri
                    });
                });
            });
            for (const image of this.session.image.values()) {
                if (image.width === 0 && image.height === 0 && image.uri) {
                    const imageElement = document.createElement('img');
                    imageElement.src = image.uri;
                    if (imageElement.complete && imageElement.naturalWidth > 0 && imageElement.naturalHeight > 0) {
                        image.width = imageElement.naturalWidth;
                        image.height = imageElement.naturalHeight;
                    }
                    else {
                        imageElement.className = '__css.preload';
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
                        this.addImagePreload(image);
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
            this.initialized = true;
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
                            this.addImagePreload(<HTMLImageElement> item.target);
                        }
                        catch {
                        }
                    }
                }
                parseResume();
            })
            .catch((error: Event) => {
                const message = error.target ? (<HTMLImageElement> error.target).src : '';
                if (!hasValue(message) || confirm(`FAIL: ${message}`)) {
                    parseResume();
                }
            });
        }
        return {
            then: (resolve: () => void) => {
                if (this.initialized) {
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
            return this.controllerHandler.renderNode(layout);
        }
        else {
            this.saveRenderPosition(layout.node, layout.renderPosition);
            return this.controllerHandler.renderNodeGroup(layout);
        }
    }

    public renderLayout(layout: Layout<T>) {
        let output = '';
        const floating = hasBit(layout.renderType, NODE_ALIGNMENT.FLOAT);
        if (floating && hasBit(layout.renderType, NODE_ALIGNMENT.HORIZONTAL)) {
            output = this.processFloatHorizontal(layout);
        }
        else if (floating && hasBit(layout.renderType, NODE_ALIGNMENT.VERTICAL)) {
            output = this.processFloatVertical(layout);
        }
        else if (layout.containerType !== 0) {
            output = this.renderNode(layout);
        }
        return output;
    }

    public addLayoutFile(filename: string, content: string, pathname?: string, documentRoot = false) {
        pathname = pathname || this.controllerHandler.localSettings.layout.pathName;
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
            filename,
            content,
            pathname: this.controllerHandler.localSettings.layout.pathName
        });
    }

    public addRenderTemplate(parent: T, node: T, output: string, group = false) {
        if (output !== '') {
            if (group) {
                node.renderChildren.some((item: T) => {
                    for (const templates of this.processing.depthMap.values()) {
                        const key = item.renderPositionId;
                        const view = templates.get(key);
                        if (view) {
                            const indent = node.renderDepth + 1;
                            if (item.renderDepth !== indent) {
                                templates.set(key, this.controllerHandler.replaceIndent(view, indent, this.processing.cache.children));
                            }
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
                        this.addRenderQueue(node.dataset.target, output);
                        node.positioned = true;
                        return;
                    }
                }
                else if (parent.dataset.target) {
                    const target = document.getElementById(parent.dataset.target);
                    if (target) {
                        this.addRenderQueue(parent.controlId, output);
                        node.dataset.target = parent.controlId;
                        return;
                    }
                }
            }
            if (!this.processing.depthMap.has(parent.id)) {
                this.processing.depthMap.set(parent.id, new Map<string, string>());
            }
            const template = this.processing.depthMap.get(parent.id);
            if (template) {
                template.set(node.renderPositionId, output);
            }
        }
    }

    public addRenderQueue(id: string, template: string) {
        const items = this.session.renderQueue.get(id) || [];
        items.push(template);
        this.session.renderQueue.set(id, items);
     }

    public addImagePreload(element: HTMLImageElement) {
        if (element && element.complete && hasValue(element.src)) {
            this.session.image.set(element.src, {
                width: element.naturalWidth,
                height: element.naturalHeight,
                uri: element.src
            });
        }
    }

    public saveRenderPosition(parent: T, required: boolean) {
        let children: T[];
        if (parent.groupParent) {
            const baseParent = parent.parent as T;
            if (baseParent) {
                const id = baseParent.id;
                const mapParent = this._renderPosition.get(id);
                let revised: T[] | undefined;
                if (mapParent) {
                    const previous = mapParent.children.filter(item => !parent.contains(item)) as T[];
                    if (parent.siblingIndex < previous.length) {
                        previous.splice(parent.siblingIndex, 0, parent);
                        for (let i = parent.siblingIndex + 1; i < previous.length; i++) {
                            previous[i].siblingIndex = i;
                        }
                        revised = previous;
                    }
                    else {
                        parent.siblingIndex = previous.length;
                        previous.push(parent);
                    }
                    this._renderPosition.set(id, { parent: baseParent, children: previous });
                }
                else {
                    revised = baseParent.children as T[];
                }
                if (revised) {
                    for (let i = parent.siblingIndex + 1; i < revised.length; i++) {
                        if (revised[i]) {
                            revised[i].siblingIndex = i;
                        }
                    }
                }
            }
        }
        if (required) {
            const renderMap = this._renderPosition.get(parent.id);
            if (renderMap) {
                children = renderMap.children.filter(item => !parent.contains(item));
                children.push(...parent.children as T[]);
            }
            else {
                children = parent.duplicate() as T[];
            }
            this._renderPosition.set(parent.id, { parent, children });
        }
    }

    public createNode(element: Element) {
        return new this.nodeConstructor(this.nextId, element, this.controllerHandler.afterInsertNode);
    }

    public toString() {
        return this._views.length ? this._views[0].content : '';
    }

    protected createCache(documentRoot: HTMLElement) {
        const elements = (() => {
            if (documentRoot === document.body) {
                let i = 0;
                return document.querySelectorAll(Array.from(document.body.childNodes).some((item: Element) => this.conditionElement(item) && ++i > 1) ? 'body, body *' : 'body *');
            }
            else {
                return documentRoot.querySelectorAll('*');
            }
        })();
        this.processing.cache.afterAppend = undefined;
        this.processing.cache.clear();
        this.processing.excluded.clear();
        this.processing.node = null;
        for (const ext of this.extensions) {
            ext.beforeInit(documentRoot);
        }
        const rootNode = this.insertNode(documentRoot);
        if (rootNode) {
            rootNode.parent = new this.nodeConstructor(0, documentRoot.parentElement || document.body, this.controllerHandler.afterInsertNode);
            rootNode.documentRoot = true;
            rootNode.documentParent = rootNode.parent;
            this.processing.node = rootNode;
        }
        else {
            return false;
        }
        const localSettings = this.controllerHandler.localSettings;
        for (const element of Array.from(elements) as HTMLElement[]) {
            if (!this.parseElements.has(element)) {
                prioritizeExtensions(documentRoot, element, Array.from(this.extensions)).some(item => item.init(element));
                if (!this.parseElements.has(element) && !(
                        localSettings.unsupported.tagName.has(element.tagName) ||
                        element instanceof HTMLInputElement && localSettings.unsupported.tagName.has(`${element.tagName}:${element.type}`)
                   ))
                {
                    let valid = true;
                    let current = element.parentElement;
                    while (current && current !== documentRoot) {
                        if (this.parseElements.has(current)) {
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
                if (node.element.tagName !== 'SELECT') {
                    const plainText: Element[] = [];
                    let valid = false;
                    Array.from(node.element.childNodes).forEach((element: Element) => {
                        if (element.nodeName === '#text') {
                            plainText.push(element);
                        }
                        else if (element.tagName !== 'BR') {
                            const item = getElementAsNode<T>(element);
                            if (item && !item.excluded) {
                                valid = true;
                            }
                        }
                    });
                    if (valid) {
                        plainText.forEach(element => this.insertNode(element, node));
                    }
                }
            }
            const preAlignment: ObjectIndex<StringMap> = {};
            const direction = new Set<HTMLElement>();
            for (const node of this.processing.cache) {
                if (node.styleElement) {
                    const element = <HTMLElement> node.element;
                    const reset: StringMap = {};
                    if (element.tagName !== 'BUTTON' && (<HTMLInputElement> element).type !== 'button') {
                        const value = node.css('textAlign');
                        switch (value) {
                            case 'center':
                            case 'right':
                            case 'end':
                                reset.textAlign = value;
                                element.style.textAlign = 'left';
                                break;
                        }
                    }
                    if (node.positionRelative && !node.positionStatic) {
                        ['top', 'right', 'bottom', 'left'].forEach(attr => {
                            if (node.has(attr)) {
                                reset[attr] = node.css(attr);
                                element.style[attr] = 'auto';
                            }
                        });
                    }
                    if (element.dir === 'rtl') {
                        element.dir = 'ltr';
                        direction.add(element);
                    }
                    preAlignment[node.id] = reset;
                }
            }
            rootNode.parent.setBounds();
            for (const node of this.processing.cache) {
                node.setBounds();
            }
            for (const node of this.processing.excluded) {
                if (!node.lineBreak) {
                    node.setBounds();
                }
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
                                parent = rootNode;
                                break;
                            }
                        }
                        case 'absolute': {
                            if (parent && checkPositionStatic(node, parent)) {
                                break;
                            }
                            else if (this.userSettings.supportNegativeLeftTop) {
                                const absoluteParent = node.absoluteParent;
                                let documentParent: T | undefined;
                                let outside = false;
                                while (parent && (parent !== rootNode || parent.id !== 0)) {
                                    if (documentParent === undefined) {
                                        if (absoluteParent === parent) {
                                            documentParent = parent as T;
                                            if (parent.css('overflow') === 'hidden') {
                                                break;
                                            }
                                            else {
                                                if ((!node.has('right') || node.right < 0) && (!node.has('bottom') || node.bottom < 0) && (
                                                        node.left < 0 && node.outsideX(parent.box) ||
                                                        !node.has('left') && node.right < 0 && node.outsideX(parent.box) ||
                                                        node.top < 0 && node.outsideY(parent.box) ||
                                                        !node.has('top') && node.bottom < 0 && node.outsideX(parent.box)
                                                   ))
                                                {
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
                                            documentParent = parent as T;
                                            break;
                                        }
                                    }
                                    parent = parent.actualParent as T;
                                }
                                if (documentParent) {
                                    parent = documentParent;
                                }
                                break;
                            }
                            else {
                                parent = node.absoluteParent;
                            }
                        }
                    }
                    if (!node.pageFlow && (parent === undefined || parent.id === 0)) {
                        parent = rootNode;
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
            for (const node of this.processing.cache) {
                if (node.htmlElement && node.length) {
                    let i = 0;
                    Array.from(node.element.childNodes).forEach((element: Element) => {
                        const item = getElementAsNode<T>(element);
                        if (item && !item.excluded && (item.pageFlow || item.documentParent === node)) {
                            item.siblingIndex = i++;
                        }
                    });
                    const layers: Array<T[]> = [];
                    node.each((item: T) => {
                        if (item.siblingIndex === Number.MAX_VALUE) {
                            for (const adjacent of node.children) {
                                if (adjacent.actualChildren.includes(item) || item.ascend().some(child => adjacent.cascade().includes(child))) {
                                    let index = -1;
                                    if (item.zIndex >= 0 || adjacent !== item.actualParent) {
                                        index = adjacent.siblingIndex + 1;
                                    }
                                    else {
                                        index = adjacent.siblingIndex - 1;
                                    }
                                    if (layers[index] === undefined) {
                                        layers[index] = [];
                                    }
                                    layers[index].push(item);
                                    break;
                                }
                            }
                        }
                    });
                    for (let j = 0; j < layers.length; j++) {
                        const order = layers[j];
                        if (order) {
                            order.sort((a, b) => {
                                if (a.zIndex === b.zIndex) {
                                    return a.id < b.id ? -1 : 1;
                                }
                                return a.zIndex < b.zIndex ? -1 : 1;
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
                    node.sort(NodeList.siblingIndex);
                }
                node.saveAsInitial();
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
        const localSettings = this.controllerHandler.localSettings;
        const documentRoot = this.processing.node as T;
        const extensions = Array.from(this.extensions).filter(item => !item.eventOnly);
        const mapY = new Map<number, Map<number, T>>();
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
            setMapY(node.depth, node.id, node);
            maxDepth = Math.max(node.depth, maxDepth);
        }
        for (let i = 0; i < maxDepth; i++) {
            mapY.set((i * -1) - 2, new Map<number, T>());
        }
        this.processing.cache.afterAppend = (node: T) => {
            deleteMapY(node.id);
            setMapY((node.depth * -1) - 2, node.id, node);
            node.cascade().forEach((item: T) => {
                deleteMapY(item.id);
                setMapY((item.depth * -1) - 2, item.id, item);
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
                const extensionsParent = parent.renderExtension.size ? Array.from(parent.renderExtension) : [];
                const extensionsChild = extensions.filter(item => item.subscribersChild.size);
                let k = -1;
                while (++k < axisY.length) {
                    let nodeY = axisY[k];
                    if (nodeY.rendered || !nodeY.visible) {
                        continue;
                    }
                    else if (nodeY.htmlElement) {
                        const element = <HTMLElement> nodeY.element;
                        if (this.parseElements.has(element) && !nodeY.documentRoot && !nodeY.documentBody) {
                            continue;
                        }
                        else if (nodeY.length === 0 && element.children.length && Array.from(element.children).every(item => this.parseElements.has(<HTMLElement> item))) {
                            nodeY.inlineText = false;
                        }
                    }
                    let parentY = nodeY.parent as T;
                    let unknownParent = parentY.hasAlign(NODE_ALIGNMENT.UNKNOWN);
                    const extendable = nodeY.hasAlign(NODE_ALIGNMENT.EXTENDABLE);
                    if (nodeY.pageFlow &&
                        axisY.length > 1 &&
                        k < axisY.length - 1 &&
                        !parentY.hasAlign(NODE_ALIGNMENT.AUTO_LAYOUT) &&
                        (parentY.alignmentType === 0 || unknownParent || extendable) &&
                        !nodeY.hasBit('excludeSection', APP_SECTION.DOM_TRAVERSE))
                    {
                        const horizontal: T[] = [];
                        const vertical: T[] = [];
                        const floatSegment = new Set();
                        let verticalExtended = false;
                        function checkHorizontal(node: T) {
                            if (vertical.length || verticalExtended) {
                                return false;
                            }
                            horizontal.push(node);
                            return true;
                        }
                        function checkVertical(node: T) {
                            if (parentY.layoutVertical && vertical.length) {
                                const previousAbove = vertical[vertical.length - 1];
                                if (previousAbove.layoutVertical) {
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
                                        const float = cleared.get(item);
                                        if (float) {
                                            if (float === 'both') {
                                                floatSegment.clear();
                                            }
                                            else {
                                                floatSegment.delete(float);
                                            }
                                        }
                                        if (item.floating) {
                                            floatSegment.add(item.float);
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
                                            const startNewRow = item.alignedVertically(previousSiblings, [...horizontal, ...vertical, item], cleared, false);
                                            if (startNewRow || settings.floatOverlapDisabled && previous.floating && item.blockStatic && floatSegment.size === 2) {
                                                if (horizontal.length) {
                                                    if (!settings.floatOverlapDisabled &&
                                                        floatSegment.size &&
                                                        !previous.autoMargin.horizontal &&
                                                        !previousSiblings.some(node => node.lineBreak && !cleared.has(node)) &&
                                                        cleared.get(item) !== 'both')
                                                    {
                                                        const floatBottom = maxArray(horizontal.filter(node => node.floating).map(node => node.linear.bottom));
                                                        if (!item.floating || item.linear.top < floatBottom) {
                                                            const floated = NodeList.floated(horizontal);
                                                            if (cleared.has(item)) {
                                                                if (!item.floating && floatSegment.size < 2 && floated.size === 2) {
                                                                    item.alignmentType |= NODE_ALIGNMENT.EXTENDABLE;
                                                                    verticalExtended = true;
                                                                    horizontal.push(item);
                                                                    continue;
                                                                }
                                                                break domNested;
                                                            }
                                                            else if (!startNewRow || floated.size === 1 && (!item.floating || floatSegment.has(item.float))) {
                                                                horizontal.push(item);
                                                                if (item.linear.bottom > floatBottom) {
                                                                    break domNested;
                                                                }
                                                                else {
                                                                    continue;
                                                                }
                                                            }
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
                        let result: LayoutResult<T> | undefined;
                        let segmentEnd: T | undefined;
                        if (horizontal.length > 1) {
                            const layout = new Layout(parentY, nodeY, 0, 0, horizontal.length, horizontal);
                            layout.init();
                            result = this.controllerHandler.processTraverseHorizontal(layout, axisY);
                            segmentEnd = horizontal[horizontal.length - 1];
                        }
                        else if (vertical.length > 1) {
                            const layout = new Layout(parentY, nodeY, 0, 0, vertical.length, vertical);
                            layout.init();
                            result = this.controllerHandler.processTraverseVertical(layout, axisY);
                            segmentEnd = vertical[vertical.length - 1];
                            if (!segmentEnd.blockStatic && segmentEnd !== axisY[axisY.length - 1]) {
                                segmentEnd.alignmentType |= NODE_ALIGNMENT.EXTENDABLE;
                            }
                        }
                        if (unknownParent && segmentEnd === axisY[axisY.length - 1]) {
                            parentY.alignmentType ^= NODE_ALIGNMENT.UNKNOWN;
                            unknownParent = false;
                        }
                        if (result) {
                            const layout = result.layout as Layout<T>;
                            const output = this.renderLayout(layout);
                            if (output !== '') {
                                this.addRenderTemplate(parentY, layout.node, output, true);
                                parentY = nodeY.parent as T;
                            }
                        }
                    }
                    if (unknownParent && k === axisY.length - 1) {
                        parentY.alignmentType ^= NODE_ALIGNMENT.UNKNOWN;
                    }
                    if (extendable) {
                        nodeY.alignmentType ^= NODE_ALIGNMENT.EXTENDABLE;
                    }
                    if (nodeY.renderAs && parentY.appendTry(nodeY, nodeY.renderAs, false)) {
                        nodeY.hide();
                        nodeY = nodeY.renderAs as T;
                        if (nodeY.positioned) {
                            parentY = nodeY.parent as T;
                        }
                    }
                    if (!nodeY.rendered && !nodeY.hasBit('excludeSection', APP_SECTION.EXTENSION)) {
                        let next = false;
                        if (extensionsParent.length || extensionsChild.length) {
                            const combined = extensionsParent.slice(0);
                            if (extensionsChild.length) {
                                combined.push(...extensionsChild.filter(item => item.subscribersChild.has(nodeY)));
                            }
                            for (const ext of combined) {
                                const result = ext.processChild(nodeY, parentY);
                                if (result.output) {
                                    this.addRenderTemplate(parentY, nodeY, result.output);
                                }
                                if (result.renderAs && result.outputAs) {
                                    this.addRenderTemplate(parentY, result.renderAs as T, result.outputAs);
                                }
                                if (result.parent) {
                                    parentY = result.parent as T;
                                }
                                next = result.next === true;
                                if (result.complete || result.next) {
                                    break;
                                }
                            }
                        }
                        if (next) {
                            continue;
                        }
                        if (nodeY.styleElement) {
                            prioritizeExtensions(<HTMLElement> documentRoot.element, <HTMLElement> nodeY.element, extensions).some(item => {
                                if (item.is(nodeY) && item.condition(nodeY, parentY)) {
                                    const result = item.processNode(nodeY, parentY);
                                    if (result.output) {
                                        this.addRenderTemplate(parentY, nodeY, result.output);
                                    }
                                    if (result.renderAs && result.outputAs) {
                                        this.addRenderTemplate(parentY, result.renderAs as T, result.outputAs);
                                    }
                                    if (result.parent) {
                                        parentY = result.parent as T;
                                    }
                                    if (result.output || result.include === true) {
                                        item.subscribers.add(nodeY);
                                        nodeY.renderExtension.add(item);
                                    }
                                    next = result.next === true;
                                    if (result.complete || result.next) {
                                        return true;
                                    }
                                }
                                return false;
                            });
                            if (next) {
                                continue;
                            }
                        }
                    }
                    if (!nodeY.rendered && !nodeY.hasBit('excludeSection', APP_SECTION.RENDER)) {
                        let layout = new Layout(
                            parentY,
                            nodeY,
                            nodeY.containerType,
                            nodeY.alignmentType, nodeY.length, nodeY.children as T[]
                        );
                        if (layout.containerType === 0) {
                            let result: LayoutResult<T>;
                            if (nodeY.length) {
                                result = this.controllerHandler.processUnknownParent(layout);
                            }
                            else {
                                result = this.controllerHandler.processUnknownChild(layout);
                            }
                            if (result.next === true) {
                                continue;
                            }
                            else if (result.renderAs) {
                                axisY[k] = result.renderAs as T;
                                k--;
                                continue;
                            }
                            else {
                                layout = result.layout as Layout<T>;
                            }
                        }
                        const output = this.renderLayout(layout);
                        if (output !== '') {
                            this.addRenderTemplate(parentY, nodeY, output);
                        }
                    }
                }
            }
            for (const [id, templates] of this.processing.depthMap.entries()) {
                const renderPosition = this._renderPosition.get(id);
                let children: T[] | undefined;
                if (renderPosition) {
                    children = this.controllerHandler.sortRenderPosition(renderPosition.parent, renderPosition.children);
                }
                else if (id !== 0) {
                    const parent = this.processing.cache.find('id', id);
                    children = parent ? this.controllerHandler.sortRenderPosition(parent, parent.children as T[]) : [];
                }
                if (children && children.length) {
                    const sorted = new Map<string, string>();
                    children.forEach(node => {
                        const key = node.renderPositionId;
                        const result = templates.get(key) || (node.companion ? templates.get(node.companion.renderPositionId) : null);
                        if (result) {
                            sorted.set(key, result);
                        }
                    });
                    if (sorted.size === templates.size) {
                        this.processing.depthMap.set(id, sorted);
                    }
                }
            }
            for (const ext of this.extensions) {
                ext.afterDepthLevel();
            }
            for (const [id, templates] of this.processing.depthMap.entries()) {
                for (const [key, view] of templates.entries()) {
                    const placeholder = formatPlaceholder(key.indexOf('^') !== -1 ? key : id);
                    if (baseTemplate.indexOf(placeholder) !== -1) {
                        baseTemplate = replacePlaceholder(baseTemplate, placeholder, view);
                        empty = false;
                    }
                    else {
                        this.addRenderQueue(key.indexOf('^') !== -1 ? `${id}|${key}` : id.toString(), view);
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
            if (!a.visible || !a.rendered) {
                return 1;
            }
            else if (a.renderDepth !== b.renderDepth) {
                return a.renderDepth < b.renderDepth ? -1 : 1;
            }
            else if (a.renderParent !== b.renderParent) {
                return a.documentParent.id < b.documentParent.id ? -1 : 1;
            }
            else {
                return a.siblingIndex < b.siblingIndex ? -1 : 1;
            }
        });
        this.session.cache.children.push(...this.processing.cache);
        this.session.excluded.children.push(...this.processing.excluded);
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
        this.controllerHandler.setConstraints();
        for (const ext of this.extensions) {
            for (const node of ext.subscribers) {
                ext.postConstraints(node);
            }
        }
        for (const ext of this.extensions) {
            ext.afterConstraints();
        }
    }

    protected setResources() {
        this.resourceHandler.setBoxStyle();
        this.resourceHandler.setFontStyle();
        this.resourceHandler.setValueString();
        for (const ext of this.extensions) {
            ext.afterResources();
        }
    }

    protected processRenderQueue() {
        const template: StringMap = {};
        for (const [id, templates] of this.session.renderQueue.entries()) {
            const [parentId, positionId] = id.split('|');
            let replaceId = parentId;
            if (!isNumber(replaceId)) {
                const element = document.getElementById(replaceId);
                if (element) {
                    const target = getElementAsNode<T>(element);
                    if (target) {
                        replaceId = target.id.toString();
                    }
                }
            }
            let output = templates.join('\n');
            if (replaceId !== parentId) {
                const target = this.session.cache.find('id', parseInt(replaceId));
                if (target) {
                    output = this.controllerHandler.replaceIndent(output, target.renderDepth + 1, this.session.cache.children);
                }
            }
            template[positionId || replaceId] = output;
        }
        for (const view of this.viewData) {
            for (const id in template) {
                view.content = view.content.replace(formatPlaceholder(id), template[id]);
            }
            view.content = this.controllerHandler.replaceRenderQueue(view.content);
        }
    }

    protected processFloatHorizontal(data: Layout<T>) {
        const settings = this.userSettings;
        let layerIndex: Array<T[] | T[][]> = [];
        let output = '';
        if (data.cleared.size === 0 && !data.some(node => node.autoMargin.horizontal)) {
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
            const layout = new Layout(
                data.parent,
                data.node,
                0,
                0,
                data.itemCount,
                data.children
            );
            layout.init();
            if (inline.length === layout.itemCount || left.length === layout.itemCount || right.length === layout.itemCount) {
                this.controllerHandler.processLayoutHorizontal(layout);
                return this.renderNode(layout);
            }
            else if ((left.length === 0 || right.length === 0) && (this.userSettings.floatOverlapDisabled || !inline.some(item => item.blockStatic))) {
                const subgroup: T[] = [];
                if (right.length === 0) {
                    subgroup.push(...left, ...inline);
                    const horizontal = this.controllerHandler.containerTypeHorizontal;
                    layout.setType(horizontal.containerType, horizontal.alignmentType);
                    layerIndex = [left, inline];
                }
                else {
                    subgroup.push(...inline, ...right);
                    const vertical = this.controllerHandler.containerTypeVerticalMargin;
                    layout.setType(vertical.containerType, vertical.alignmentType);
                    layerIndex = [inline, right];
                }
                layout.retain(subgroup);
                output = this.renderNode(layout);
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
                    if (hasBit(pendingFloat, clear === 'right' ? 4 : 2) || pendingFloat !== 0 && clear === 'both') {
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
            const layout = new Layout(
                data.parent,
                data.node,
                0,
                rightAbove.length + rightBelow.length === data.length ? NODE_ALIGNMENT.RIGHT : 0
            );
            if (settings.floatOverlapDisabled) {
                if (data.node.groupParent && data.parent.layoutVertical) {
                    data.node.alignmentType |= layout.alignmentType;
                    output = formatPlaceholder(data.node.id);
                    data.node.render(data.parent);
                    data.node.renderDepth--;
                }
                else {
                    const vertical = this.controllerHandler.containerTypeVertical;
                    layout.setType(vertical.containerType, vertical.alignmentType);
                    output = this.renderNode(layout);
                }
                if (inlineAbove.length) {
                    layerIndex.push(inlineAbove);
                }
                if (leftAbove.length || rightAbove.length) {
                    layerIndex.push([leftAbove, rightAbove]);
                }
                if (leftBelow.length || rightBelow.length) {
                    layerIndex.push([leftBelow, rightBelow]);
                }
                if (inlineBelow.length) {
                    layerIndex.push(inlineBelow);
                }
                layout.itemCount = layerIndex.length;
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
                    if (leftSub === leftBelow && rightSub === rightAbove || leftSub === leftAbove && rightSub === rightBelow) {
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
                layerIndex = layerIndex.filter(item => item.length > 0);
                layout.itemCount = layerIndex.length;
                const vertical = inlineAbove.length === 0 && (leftSub.length === 0 || rightSub.length === 0) ? this.controllerHandler.containerTypeVertical : this.controllerHandler.containerTypeVerticalMargin;
                layout.setType(vertical.containerType, vertical.alignmentType);
                output = this.renderNode(layout);
            }
        }
        if (layerIndex.length) {
            const floating = [inlineAbove, leftAbove, leftBelow, rightAbove, rightBelow];
            let floatgroup: T | undefined;
            layerIndex.forEach((item, index) => {
                if (Array.isArray(item[0])) {
                    const grouping: T[] = [];
                    (item as T[][]).forEach(segment => grouping.push(...segment));
                    grouping.sort(NodeList.siblingIndex);
                    floatgroup = this.controllerHandler.createNodeGroup(grouping[0], grouping, data.node);
                    const layout = new Layout(
                        data.node,
                        floatgroup,
                        0,
                        ((item as T[][]).some(segment => segment === rightSub || segment === rightAbove) ? NODE_ALIGNMENT.RIGHT : 0),
                        item.length
                    );
                    let vertical: LayoutType | undefined;
                    if (settings.floatOverlapDisabled) {
                        vertical = this.controllerHandler.containerTypeVerticalMargin;
                    }
                    else {
                        if (data.node.layoutVertical) {
                            floatgroup = data.node;
                        }
                        else {
                            vertical = this.controllerHandler.containerTypeVertical;
                        }
                    }
                    if (vertical) {
                        layout.setType(vertical.containerType, vertical.alignmentType);
                        output = replacePlaceholder(output, data.node.id, this.renderNode(layout));
                    }
                }
                else {
                    floatgroup = undefined;
                }
                ((Array.isArray(item[0]) ? item : [item]) as T[][]).forEach(segment => {
                    let basegroup = data.node;
                    if (floatgroup && floating.includes(segment)) {
                        basegroup = floatgroup;
                    }
                    let target: T | undefined;
                    if (segment.length > 1) {
                        target = this.controllerHandler.createNodeGroup(segment[0], segment, basegroup);
                        const layout = new Layout(
                            basegroup,
                            target,
                            0,
                            NODE_ALIGNMENT.SEGMENTED,
                            segment.length,
                            segment
                        );
                        if (layout.linearY) {
                            const vertical = this.controllerHandler.containerTypeVertical;
                            layout.setType(vertical.containerType, vertical.alignmentType);
                        }
                        else {
                            layout.init();
                            this.controllerHandler.processLayoutHorizontal(layout);
                        }
                        output = replacePlaceholder(output, basegroup.id, this.renderNode(layout));
                    }
                    else if (segment.length) {
                        target = segment[0];
                        target.alignmentType |= NODE_ALIGNMENT.SINGLE;
                        target.renderPosition = index;
                        output = replacePlaceholder(output, basegroup.id, formatPlaceholder(target.renderPositionId));
                    }
                    if (!settings.floatOverlapDisabled && target && segment === inlineAbove && segment.some(subitem => subitem.blockStatic && !subitem.hasWidth)) {
                        const vertical = this.controllerHandler.containerTypeVertical;
                        const targeted = target.of(vertical.containerType, vertical.alignmentType) ? target.children : [target];
                        if (leftAbove.length) {
                            const marginRight = maxArray(leftAbove.map(subitem => subitem.linear.right));
                            const boundsLeft = minArray(segment.map(subitem => subitem.bounds.left));
                            targeted.forEach(subitem => subitem.modifyBox(BOX_STANDARD.PADDING_LEFT, marginRight - boundsLeft));
                        }
                        if (rightAbove.length) {
                            const marginLeft = minArray(rightAbove.map(subitem => subitem.linear.left));
                            const boundsRight = maxArray(segment.map(subitem => subitem.bounds.right));
                            targeted.forEach(subitem => subitem.modifyBox(BOX_STANDARD.PADDING_RIGHT, boundsRight - marginLeft));
                        }
                    }
                });
            });
        }
        return output;
    }

    protected processFloatVertical(data: Layout<T>) {
        const controller = this.controllerHandler;
        const vertical = controller.containerTypeVertical;
        const group = data.node;
        const layoutGroup = new Layout(
            data.parent,
            group,
            vertical.containerType,
            vertical.alignmentType,
            data.length
        );
        let output = this.renderNode(layoutGroup);
        const staticRows: T[][] = [];
        const floatedRows: Null<T[]>[] = [];
        const current: T[] = [];
        const floated: T[] = [];
        let clearReset = false;
        let blockArea = false;
        let layoutVertical = true;
        for (const node of data) {
            if (node.blockStatic && floated.length === 0) {
                current.push(node);
                blockArea = true;
            }
            else {
                if (data.cleared.has(node)) {
                    if (!node.floating) {
                        node.modifyBox(BOX_STANDARD.MARGIN_TOP, null);
                        staticRows.push(current.slice(0));
                        current.length = 0;
                        floatedRows.push(floated.slice(0));
                        floated.length = 0;
                    }
                    else {
                        clearReset = true;
                    }
                }
                if (node.floating) {
                    if (blockArea) {
                        staticRows.push(current.slice(0));
                        floatedRows.push(null);
                        current.length = 0;
                        floated.length = 0;
                        blockArea = false;
                    }
                    floated.push(node);
                }
                else {
                    if (clearReset && !data.cleared.has(node)) {
                        layoutVertical = false;
                    }
                    current.push(node);
                }
            }
        }
        if (floated.length) {
            floatedRows.push(floated);
        }
        if (current.length) {
            staticRows.push(current);
        }
        if (!layoutVertical) {
            let xml = '';
            for (let i = 0; i < Math.max(floatedRows.length, staticRows.length); i++) {
                const pageFlow = staticRows[i] || [];
                if (floatedRows[i] === null && pageFlow.length) {
                    if (pageFlow.length > 1) {
                        const layoutType = controller.containerTypeVertical;
                        layoutType.alignmentType |= NODE_ALIGNMENT.SEGMENTED;
                        const layout = new Layout(
                            group,
                            controller.createNodeGroup(pageFlow[0], pageFlow, group),
                            layoutType.containerType,
                            layoutType.alignmentType,
                            pageFlow.length,
                            pageFlow
                        );
                        xml += this.renderNode(layout);
                    }
                    else {
                        const single = pageFlow[0];
                        single.alignmentType |= NODE_ALIGNMENT.SINGLE;
                        single.renderPosition = i;
                        output = replacePlaceholder(output, group.id, formatPlaceholder(single.renderPositionId));
                    }
                }
                else {
                    const floating = floatedRows[i] || [];
                    if (pageFlow.length || floating.length) {
                        const basegroup = controller.createNodeGroup(floating[0] || pageFlow[0], [], group);
                        const verticalMargin = controller.containerTypeVerticalMargin;
                        const layout = new Layout(
                            group,
                            basegroup,
                            verticalMargin.containerType,
                            verticalMargin.alignmentType
                        );
                        const children: T[] = [];
                        let subgroup: T | undefined;
                        if (floating.length) {
                            if (floating.length > 1) {
                                subgroup = controller.createNodeGroup(floating[0], floating, basegroup);
                                layout.add(NODE_ALIGNMENT.FLOAT);
                                if (pageFlow.length === 0 && floating.every(item => item.float === 'right')) {
                                    layout.add(NODE_ALIGNMENT.RIGHT);
                                }
                            }
                            else {
                                subgroup = floating[0];
                                subgroup.parent = basegroup;
                            }
                        }
                        if (subgroup) {
                            children.push(subgroup);
                            subgroup = undefined;
                        }
                        if (pageFlow.length) {
                            if (pageFlow.length > 1) {
                                subgroup = controller.createNodeGroup(pageFlow[0], pageFlow, basegroup);
                            }
                            else {
                                subgroup = pageFlow[0];
                                subgroup.parent = basegroup;
                            }
                        }
                        if (subgroup) {
                            children.push(subgroup);
                        }
                        basegroup.init();
                        layout.itemCount = children.length;
                        xml += this.renderNode(layout);
                        children.forEach(node => {
                            if (data.contains(node) || node.length === 0) {
                                xml = replacePlaceholder(xml, basegroup.id, formatPlaceholder(node.id));
                            }
                            else {
                                const layoutSegment = new Layout(
                                    basegroup,
                                    node,
                                    vertical.containerType,
                                    vertical.alignmentType | NODE_ALIGNMENT.SEGMENTED,
                                    node.length,
                                    node.children as T[]
                                );
                                xml = replacePlaceholder(xml, basegroup.id, this.renderNode(layoutSegment));
                            }
                        });
                    }
                }
            }
            output = replacePlaceholder(output, group.id, xml);
        }
        return output;
    }

    protected insertNode(element: Element, parent?: T) {
        let node: T | null = null;
        if (hasComputedStyle(element)) {
            const nodeConstructor = this.createNode(element);
            if (!this.controllerHandler.localSettings.unsupported.excluded.has(element.tagName) && this.conditionElement(element)) {
                node = nodeConstructor;
                node.setExclusions();
            }
            else {
                nodeConstructor.visible = false;
                nodeConstructor.excluded = true;
                this.processing.excluded.append(nodeConstructor);
            }
        }
        else if (element.nodeName.charAt(0) === '#' && element.nodeName === '#text') {
            if (isPlainText(element, true) || cssParent(element, 'whiteSpace', 'pre', 'pre-wrap')) {
                node = this.createNode(element);
                if (parent) {
                    node.inherit(parent, 'textStyle');
                }
                else {
                    node.css('whiteSpace', getStyle(element.parentElement).whiteSpace || 'normal');
                }
                node.cssApply({
                    position: 'static',
                    display: 'inline',
                    verticalAlign: 'baseline',
                    cssFloat: 'none',
                    clear: 'none',
                });
            }
        }
        if (node) {
            this.processing.cache.append(node);
        }
        return node;
    }

    protected conditionElement(element: Element) {
        if (element.parentElement instanceof SVGSVGElement) {
            return false;
        }
        else if (hasComputedStyle(element)) {
            if (hasValue(element.dataset.use)) {
                return true;
            }
            else if (withinViewportOrigin(element)) {
                return true;
            }
            else {
                let current = element.parentElement;
                let valid = true;
                while (current) {
                    if (getStyle(current).display === 'none') {
                        valid = false;
                        break;
                    }
                    current = current.parentElement;
                }
                if (valid && element.children.length) {
                    return Array.from(element.children).some((item: Element) => {
                        const style = getStyle(item);
                        const float = style.cssFloat;
                        const position = style.position;
                        return position === 'absolute' || position === 'fixed' || float === 'left' || float === 'right';
                    });
                }
            }
            return false;
        }
        else {
            return isPlainText(element);
        }
    }

    private setStyleMap() {
        violation: {
            for (let i = 0; i < document.styleSheets.length; i++) {
                const item = <CSSStyleSheet> document.styleSheets[i];
                if (item.cssRules) {
                    for (let j = 0; j < item.cssRules.length; j++) {
                        const rule = item.cssRules[j];
                        try {
                            switch (rule.type) {
                                case CSSRule.STYLE_RULE:
                                    this.applyStyleRule(<CSSStyleRule> rule);
                                    break;
                                case CSSRule.MEDIA_RULE:
                                    const patternA = /(?:(not|only)?\s*(?:all|screen) and )?((?:\([^)]+\)(?: and )?)+),?\s*/g;
                                    let matchA: RegExpExecArray | null;
                                    let statement = false;
                                    while (!statement && ((matchA = patternA.exec((<CSSConditionRule> rule).conditionText)) !== null)) {
                                        const negate = matchA[1] === 'not';
                                        const patternB = /\(([a-z\-]+)\s*(:|<?=?|=?>?)?\s*([\w.%]+)?\)(?: and )?/g;
                                        let matchB: RegExpExecArray | null;
                                        let valid = false;
                                        while (!statement && (matchB = patternB.exec(matchA[2])) !== null) {
                                            const attr = matchB[1];
                                            let operation: string;
                                            if (matchB[1].startsWith('min')) {
                                                operation = '>=';
                                            }
                                            else if (matchB[1].startsWith('max')) {
                                                operation = '<=';
                                            }
                                            else {
                                                operation = matchA[2];
                                            }
                                            const value = matchB[3];
                                            switch (attr) {
                                                case 'aspect-ratio':
                                                case 'min-aspect-ratio':
                                                case 'max-aspect-ratio':
                                                    const [width, height] = value.split('/').map(ratio => parseInt(ratio));
                                                    valid = compareRange(operation, window.innerWidth / window.innerHeight, width / height);
                                                    break;
                                                case 'width':
                                                case 'min-width':
                                                case 'max-width':
                                                case 'height':
                                                case 'min-height':
                                                case 'max-height':
                                                    valid = compareRange(operation, attr.indexOf('width') !== -1 ? window.innerWidth : window.innerHeight, parseFloat(convertPX(value, convertInt(getStyle(document.body).fontSize || '16'))));
                                                    break;
                                                case 'orientation':
                                                    valid = value === 'portrait' && window.innerWidth <= window.innerHeight || value === 'landscape' && window.innerWidth > window.innerHeight;
                                                    break;
                                                case 'resolution':
                                                case 'min-resolution':
                                                case 'max-resolution':
                                                    let resolution = parseFloat(value);
                                                    if (value.endsWith('dpcm')) {
                                                        resolution *= 2.54;
                                                    }
                                                    else if (value.endsWith('dppx') || value.endsWith('x')) {
                                                        resolution *= 96;
                                                    }
                                                    valid = compareRange(operation, window.devicePixelRatio * 96, resolution);
                                                    break;
                                                case 'grid':
                                                    valid = value === '0';
                                                    break;
                                                case 'color':
                                                    valid = value === undefined || convertInt(value) > 0;
                                                    break;
                                                case 'min-color':
                                                    valid = convertInt(value) <= screen.colorDepth / 3;
                                                    break;
                                                case 'max-color':
                                                    valid = convertInt(value) >= screen.colorDepth / 3;
                                                    break;
                                                case 'color-index':
                                                case 'min-color-index':
                                                case 'monochrome':
                                                case 'min-monochrome':
                                                    valid = value === '0';
                                                    break;
                                                case 'max-color-index':
                                                case 'max-monochrome':
                                                    valid = convertInt(value) >= 0;
                                                    break;
                                                default:
                                                    valid = false;
                                                    break;
                                            }
                                            if (!valid) {
                                                break;
                                            }
                                        }
                                        if (!negate && valid || negate && !valid) {
                                            statement = true;
                                        }
                                    }
                                    if (statement) {
                                        const items = (<CSSMediaRule> rule).cssRules;
                                        for (let k = 0; k < items.length; k++) {
                                            this.applyStyleRule(<CSSStyleRule> items[k]);
                                        }
                                    }
                                    break;
                            }
                        }
                        catch (error) {
                            alert('External CSS files cannot be parsed with some browsers when loading HTML pages directly from your hard drive. ' +
                                  'Either use a local web server, embed your CSS into a <style> element, or you can also try a different browser. ' +
                                  'See the README for more detailed instructions.\n\n' +
                                  `${item.href}\n\n${error}`);
                            break violation;
                        }
                    }
                }
            }
        }
    }

    private applyStyleRule(item: CSSStyleRule) {
        const clientFirefox = isUserAgent(USER_AGENT.FIREFOX);
        const fromRule: string[] = [];
        for (const attr of Array.from(item.style)) {
            fromRule.push(convertCamelCase(attr));
        }
        document.querySelectorAll(item.selectorText).forEach((element: HTMLElement) => {
            const style = getStyle(element);
            const fontSize = parseInt(convertPX(style.fontSize || '16px', 0));
            const styleMap: StringMap = {};
            for (const attr of fromRule) {
                const value = checkStyleAttribute(element, attr, item.style[attr], style, fontSize);
                if (value !== '') {
                    styleMap[attr] = value;
                }
            }
            for (let attr of Array.from(element.style)) {
                attr = convertCamelCase(attr);
                const value = checkStyleAttribute(element, attr, element.style[attr], style, fontSize);
                if (value !== '') {
                    styleMap[attr] = value;
                }
            }
            if (this.userSettings.preloadImages && hasValue(styleMap.backgroundImage) && styleMap.backgroundImage !== 'initial') {
                for (const value of styleMap.backgroundImage.split(',')) {
                    const uri = cssResolveUrl(value.trim());
                    if (uri !== '' && !this.session.image.has(uri)) {
                        this.session.image.set(uri, { width: 0, height: 0, uri });
                    }
                }
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

    set appName(value) {
        if (this.resourceHandler.fileHandler) {
            this.resourceHandler.fileHandler.appName = value;
        }
    }
    get appName() {
        return this.resourceHandler.fileHandler ? this.resourceHandler.fileHandler.appName : '';
    }

    set userSettings(value) {
        this._userSettings = value;
    }
    get userSettings() {
        return this._userSettings || {} as UserSettings;
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

    get rendered() {
        return this.session.cache.filter(node => node.visible && node.rendered);
    }

    get nextId() {
        return this.processing.cache.nextId;
    }

    get size() {
        return this._views.length + this._includes.length;
    }
}
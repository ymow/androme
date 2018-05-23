class Node {
    constructor(id, element, options = {}) {
        let style = {};
        let styleMap = {};
        let bounds = null;
        if (element != null) {
            style = window.getComputedStyle(element);
            styleMap = element.styleMap || {};
            bounds = element.getBoundingClientRect();
            for (const inline of element.style) {
                styleMap[Utils.hyphenToCamelCase(inline)] = element.style[inline];
            }
            this.tagName = element.tagName;
        }
        else {
            element = {};
        }
        this.id = id;
        this.element = element;
        this.children = [];
        this.style = style;
        this.styleMap = styleMap;
        this.depthIndent = 0;
        this.visible = true;
        this.linearRows = [];
        this.renderId = null;
        this.renderChildren = [];
        this.androidAttributes = [];
        this.styleAttributes = [];
        this.constraint = {};
        this.original = {};
        this.boxRefit = {};
        this.preAlignment = {};
        this.nestedScroll = false;
        this.wrapNode = null;
        this.parentIndex = Number.MAX_VALUE;

        this._parent = null;
        this._depth = null;
        this._android = {};
        this._app = {};

        Object.assign(this, options);
        if (options.element != null || arguments[1] != null) {
            this.element.androidNode = this;
        }
    }

    setAndroidId(widgetName) {
        const element = this.element;
        if (widgetName == null) {
            widgetName = this.widgetName;
        }
        this.androidWidgetName = widgetName;
        if (this.androidId == null) {
            let androidName = element.id || element.name || widgetName.toLowerCase();
            if (GENERATE_ID[androidName] == null) {
                GENERATE_ID[androidName] = 1;
            }
            this.androidId = androidName;
            do {
                if (!GENERATE_ID['__id'].includes(this.androidId) && this.androidId != widgetName.toLowerCase()) {
                    GENERATE_ID['__id'].push(this.androidId);
                    break;
                }
                else {
                    this.androidId = `${androidName}_${GENERATE_ID[androidName]++}`;
                }
            }
            while (true)
        }
    }
    setAndroidDimensions() {
        let parent = null;
        let styleMap = this.styleMap;
        let width = 0;
        let height = 0;
        let gridLayout = false;
        if (this.wrapNode != null) {
            parent = this.wrapNode.original.parent || this.parent;
            [width, height] = this.getChildDimensions();
            gridLayout = this.parent.isView(WIDGET_ANDROID.GRID);
        }
        else {
            parent = this.parent;
            width = this.element.offsetWidth + this.marginLeft + this.marginRight;
            height = this.element.offsetHeight + this.marginTop + this.marginBottom;
            gridLayout = parent.isView(WIDGET_ANDROID.GRID);
        }
        const parentWidth = (parent.id != 0 ? parent.element.offsetWidth - (parent.paddingLeft + parent.paddingRight + Utils.parseInt(parent.style.borderLeftWidth) + Utils.parseInt(parent.style.borderRightWidth)) : Number.MAX_VALUE);
        const parentHeight = (parent.id != 0 ? parent.element.offsetHeight - (parent.paddingTop + parent.paddingBottom + Utils.parseInt(parent.style.borderTopWidth) + Utils.parseInt(parent.style.borderBottomWidth)) : Number.MAX_VALUE);
        if (this.overflow != 0 && !this.isView(WIDGET_ANDROID.TEXT)) {
            this.android('layout_width', 'match_parent', false);
            this.android('layout_height', 'match_parent', false);
        }
        else {
            const layoutWeight = (this.gridColumnWeight != null || this.layoutWeightWidth != null);
            if (styleMap.width != null) {
                this.android('layout_width', Utils.convertToPX(styleMap.width));
                if (layoutWeight) {
                    this.android((this.gridColumnWeight != null ? 'layout_columnWeight' : 'layout_weight'), '0');
                }
            }
            if (this.android('layout_width') != 'match_constraint') {
                if (styleMap.minWidth != null) {
                    this.android('minWidth', Utils.convertToPX(styleMap.minWidth));
                }
                if (styleMap.maxWidth != null) {
                    this.android('maxWidth', Utils.convertToPX(styleMap.maxWidth));
                }
            }
            if (this.android('layout_width') == null) {
                if (layoutWeight) {
                    if (this.layoutWeightWidth != null) {
                        this.android('layout_weight', this.layoutWeightWidth);
                    }
                    else if (this.gridColumnWeight != null) {
                        this.android('layout_columnWeight', this.gridColumnWeight);
                    }
                    this.android('layout_width', (this.layoutWeightWidth == 1 || this.gridColumnWeight == 1 ? '0px' : 'wrap_content'));
                }
                else {
                    if (gridLayout) {
                        this.android('layout_width', 'wrap_content', false);
                    }
                    else {
                        if (parent.overflow == 0 && width >= parentWidth) {
                            this.android('layout_width', 'match_parent', false);
                        }
                        else {
                            const display = (this.style != null ? this.style.display : '');
                            switch (display) {
                                case 'line-item':
                                case 'block':
                                case 'inherit':
                                    this.android('layout_width', 'match_parent', false);
                                    break;
                                default:
                                    this.android('layout_width', 'wrap_content', false);
                            }
                        }
                    }
                }
            }
            if (styleMap.height != null) {
                this.android('layout_height', Utils.convertToPX(styleMap.height));
                if (this.layoutWeightHeight != null) {
                    this.android('layout_weight', '0');
                }
            }
            if (this.android('layout_height') != 'match_constraint') {
                if (styleMap.minHeight != null) {
                    this.android('minHeight', Utils.convertToPX(styleMap.minHeight));
                }
                if (styleMap.maxHeight != null) {
                    this.android('maxHeight', Utils.convertToPX(styleMap.maxHeight));
                }
            }
            if (this.android('layout_height') == null) {
                if (this.layoutWeightHeight != null) {
                    this.android('layout_weight', this.layoutWeightHeight);
                    this.android('layout_height', (this.layoutWeightHeight == 1 ? '0px' : 'wrap_content'));
                }
                else {
                    if (parent.overflow == 0 && !gridLayout && height >= parentHeight) {
                        this.android('layout_height', 'match_parent', false);
                    }
                    else {
                        this.android('layout_height', 'wrap_content', false);
                    }
                }
            }
            if (gridLayout) {
                const styleMap = this.original.parent.styleMap;
                if (styleMap.textAlign || styleMap.verticalAlign) {
                    this.android('layout_gravity', Node.getAndroidGravity(styleMap.textAlign, styleMap.verticalAlign));
                }
            }
        }
    }
    setBounds(element) {
        if (this.wrapNode == null) {
            if (element != null) {
                const range = document.createRange();
                range.selectNodeContents(element);
                const domRect = range.getClientRects();
                const domText = domRect[domRect.length - 1];
                const bounds = JSON.parse(JSON.stringify(domText));
                if (domRect.length > 1) {
                    bounds.x = Array.from(domRect).reduce((a, b) => Math.min(a, b.x), Number.MAX_VALUE);
                    bounds.left = bounds.x;
                    bounds.width = Array.from(domRect).reduce((a, b) => a + b.width, 0);
                }
                this.bounds = Node.getRangeBounds(element);
            }
            else {
                this.bounds = this.element.getBoundingClientRect();
            }
        }
        else {
            const nodes = Node.getNodesOuter(this.children);
            this.bounds = {
                top: nodes.top[0].bounds.top,
                right: nodes.right[0].bounds.right,
                bottom: nodes.bottom[0].bounds.bottom,
                left: nodes.left[0].bounds.left,
                x: nodes.left[0].bounds.x,
                y: nodes.top[0].bounds.y
            };
        }
    }
    setLinearBoxRect() {
        if (this.wrapNode == null) {
            const bounds = this.bounds;
            this.linear = {
                top: Math.floor(bounds.top - this.marginTop),
                right: Math.ceil(bounds.right + this.marginRight),
                bottom: Math.ceil(bounds.bottom + this.marginBottom),
                left: Math.floor(bounds.left - this.marginLeft)
            };
            this.box = {
                top: Math.ceil(bounds.top + (this.paddingTop + Utils.parseInt(this.css('borderTopWidth')))),
                right: Math.floor(bounds.right - (this.paddingRight + Utils.parseInt(this.css('borderRightWidth')))),
                left: Math.ceil(bounds.left + (this.paddingLeft + Utils.parseInt(this.css('borderLeftWidth')))),
                bottom: Math.floor(bounds.bottom - (this.paddingBottom + Utils.parseInt(this.css('borderBottomWidth'))))
            };
        }
        else {
            const nodes = Node.getNodesOuter(this.children);
            this.linear = {
                top: nodes.top[0].linear.top,
                right: nodes.right[0].linear.right,
                bottom: nodes.bottom[0].linear.bottom,
                left: nodes.left[0].linear.left
            };
            this.box = {
                top: nodes.top[0].box.top,
                right: nodes.right[0].box.right,
                bottom: nodes.bottom[0].box.bottom,
                left: nodes.left[0].box.left
            };
        }
    }
    getChildDimensions() {
        let minLeft = Number.MAX_VALUE;
        let maxRight = Number.MIN_VALUE;
        let minTop = Number.MAX_VALUE;
        let maxBottom = Number.MIN_VALUE;
        this.children.forEach(node => {
            minLeft = Math.min(node.bounds.left, minLeft);
            maxRight = Math.max(node.bounds.right, maxRight);
            minTop = Math.min(node.bounds.top, minTop);
            maxBottom = Math.max(node.bounds.bottom, maxBottom);
        });
        return [maxRight - minLeft, maxBottom - minTop];
    }
    setAttributes(actions = []) {
        const widget = ACTION_ANDROID[this.androidWidgetName];
        const element = this.element;
        const result = {};
        if (widget != null) {
            if (this.actions != null) {
                actions = this.actions;
            }
            let i = -1;
            for (const action in widget) {
                i++;
                if (result[action] != null || (actions != null && actions.length > 0 && !actions.includes(i))) {
                    continue;
                }
                if (Utils.hasValue(this[action])) {
                    result[action] = Utils.formatString(widget[action], this[action]);
                }
                else if (action.indexOf('.') != -1) {
                    let method = window;
                    let methodName = '';
                    action.split('.').forEach(value => {
                        if (value == 'window') {
                            return true;
                        }
                        else if (method[value] != null) {
                            method = method[value];
                            methodName = value;
                        }
                    });
                    if (typeof method == 'function') {
                        const data = method(this);
                        if (data != null) {
                            const output = [];
                            for (const j in widget[action]) {
                                if (result[j] != null) {
                                    continue;
                                }
                                let value = data[j];
                                if (Utils.hasValue(value)) {
                                    value = Node.parseStyle(element, j, value);
                                    if (value != null) {
                                        output.push(Utils.formatString(widget[action][j], value));
                                    }
                                }
                            }
                            if (output.length > 0) {
                                if (methodName == 'setComputedStyle') {
                                    this.styleAttributes = output;
                                }
                                else {
                                    result[i] = output;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (element.tagName == 'INPUT' && element.id != '') {
            const nextElement = element.nextElementSibling;
            if (nextElement && nextElement.htmlFor == element.id) {
                const nextNode = nextElement.androidNode;
                nextNode.setAndroidId(WIDGET_ANDROID.TEXT);
                nextNode.setAttributes([5]);
                const attributes = nextNode.androidAttributes;
                for (const name in attributes) {
                    const value = attributes[name];
                    if (result[name] == null && Utils.hasValue(value)) {
                        result[name] = value;
                    }
                }
                this.label = nextNode;
                nextNode.hide();
            }
        }
        for (const i in result) {
            let value = result[i];
            if (Utils.hasValue(value)) {
                if (!Array.isArray(value)) {
                    value = [value];
                }
                value.forEach(attr => {
                    var match = attr.match(/^android:([a-zA-Z_]+)="([a-zA-Z0-9]+)"$/);
                    if (match != null) {
                        this.android(match[1], match[2]);
                    }
                    else {
                        this.addAttribute(attr);
                    }
                });
            }
        }
    }
    addAttribute(value) {
        if (Utils.hasValue(value)) {
            this.androidAttributes.push(value);
        }
    }
    inheritGrid(node) {
        for (const prop in node) {
            if (prop.startsWith('grid')) {
                if (node[prop] !== false) {
                    this[prop] = node[prop];
                }
                delete node[prop];
            }
        }
    }
    inheritStyleMap(node) {
        for (const prop in node.styleMap) {
            if (this.styleMap[prop] == null) {
                this.styleMap[prop] = node.styleMap[prop];
            }
        }
    }
    android(name, value, overwrite = true) {
        if (arguments.length == 0) {
            return this._android;
        }
        else {
            if (Utils.hasValue(value)) {
                if (!overwrite && this._android[name] != null) {
                    return null;
                }
                this._android[name] = value;
            }
            return this._android[name];
        }
    }
    app(name, value, overwrite = true) {
        if (arguments.length == 0) {
            return this._app;
        }
        else {
            if (Utils.hasValue(value)) {
                if (!overwrite && this._app[name] != null) {
                    return null;
                }
                this._app[name] = value;
            }
            return this._app[name];
        }
    }
    delete(obj, name) {
        delete this[`_${obj}`][name];
    }
    css(name) {
        if (this.styleMap[name] != null) {
            return this.styleMap[name];
        }
        return (this.style[name] || ''); 
    }
    hide(parent = true) {
        this.visible = false;
        this.renderParent = parent;
    }
    withinX(rect, dimension = 'linear') {
        return ((rect.top >= this[dimension].top && rect.top < this[dimension].bottom) || (rect.bottom > this[dimension].top && rect.bottom <= this[dimension].bottom) || (this[dimension].top >= rect.top && this[dimension].bottom <= rect.bottom) || (rect.top >= this[dimension].top && rect.bottom <= this[dimension].bottom));
    }
    withinY(rect, dimension = 'linear') {
        return ((rect.left >= this[dimension].left && rect.left < this[dimension].right) || (rect.right > this[dimension].left && rect.right <= this[dimension].right) || (this[dimension].left >= rect.left && this[dimension].right <= rect.right) || (rect.left >= this[dimension].left && rect.right <= this[dimension].right));
    }
    isLinearHorizontal() {
        return (this._android.orientation == 'horizontal');
    }
    isView(viewName) {
        return (this.androidWidgetName == viewName);
    }

    get overflow() {
        let value = 0;
        if (this.style.overflow == 'scroll' || (this.style.overflowX == 'auto' && this.element.clientWidth != this.element.scrollWidth)) {
            value |= 2;
        }
        if (this.style.overflow == 'scroll' || (this.style.overflowY == 'auto' && this.element.clientHeight != this.element.scrollHeight)) {
            value |= 4;
        }
        return value;
    }
    get horizontalBias() {
        const parent = this.renderParent;
        if (parent != null && parent.visible) {
            const left = this.linear.left - parent.box.left;
            const right = parent.box.right - this.linear.right;
            return (left == 0 || right == 0 ? 0 : (left / (left + right)).toFixed(2));
        }
        return 0;
    }
    get verticalBias() {
        const parent = this.renderParent;
        if (parent != null && parent.visible) {
            const top = this.linear.top - parent.box.top;
            const bottom = parent.box.bottom - this.linear.bottom;
            return (top == 0 || bottom == 0 ? 0 : (top / (top + bottom)).toFixed(2));
        }
        return 0;
    }
    get widgetName() {
        if (this.androidWidgetName != null) {
            return this.androidWidgetName;
        }
        else {
            let widgetName = MAPPING_ANDROID[this.tagName];
            if (typeof widgetName == 'object') {
                widgetName = widgetName[this.element.type];
            }
            return widgetName;
        }
    }
    set parent(value) {
        if (this._parent != null && this.original.parent == null) {
            this.original.parent = this._parent;
            this.original.parentId = this._parent.id;
        }
        if (value == null) {
            value = new Node(0);
            value.depth = -1;
        }
        if (this._depth == null) {
            this._depth = value.depth + 1;
        }
        this._parent = value;
    }
    get parent() {
        return (this._parent != null ? this._parent : new Node(0));
    }
    set renderParent(value) {
        if (typeof value == 'object') {
            if (value.visible) {
                value.renderChildren.push(this);
            }
        }
        this._renderParent = value;
    }
    get renderParent() {
        return this._renderParent;
    }
    set depth(value) {
        if (this._depth != null && this.original.depth == null) {
            this.original.depth = this._depth;
        }
        this._depth = value;
    }
    get depth() {
        return (this._depth != null ? this._depth : 0);
    }
    get firstChild() {
        const nodes = this.children.slice();
        nodes.sort((a, b) => {
            let [c, d] = [a.depth, b.depth];
            if (c == d) {
                [c, d] = [a.bounds.top, b.bounds.top];
            }
            if (c == d) {
                [c, d] = [a.bounds.left, b.bounds.left];
            }
            return (c > d ? 1 : -1);
        });
        return (nodes.length > 0 ? nodes[0] : null);
    }
    get marginTop() {
        return Utils.parseInt(this.css('marginTop'));
    }
    get marginBottom() {
        return Utils.parseInt(this.css('marginBottom'));
    }
    get marginLeft() {
        return Utils.parseInt(this.css('marginLeft'));
    }
    get marginRight() {
        return Utils.parseInt(this.css('marginRight'));
    }
    get paddingTop() {
        return Utils.parseInt(this.css('paddingTop'));
    }
    get paddingBottom() {
        return Utils.parseInt(this.css('paddingBottom'));
    }
    get paddingLeft() {
        return Utils.parseInt(this.css('paddingLeft'));
    }
    get paddingRight() {
        return Utils.parseInt(this.css('paddingRight'));
    }
    get center() {
        return { x: this.bounds.left + Math.floor(this.bounds.width / 2), y: this.bounds.top + Math.floor(this.bounds.height / 2)};
    }

    static createWrapNode(id, node, parent, children, actions = null) {
        const options = {
            wrapNode: node,
            parent,
            children,
            original: node.original,
            depth: parent.depth,
            depthIndent: parent.depthIndent,
            bounds: node.bounds,
            linear: node.linear,
            box: node.box,
            original: node.original,
            actions
        };
        return new Node(id, null, options);
    }
    static createTextNode(id, element, parent, actions = null) {
        const node = new Node(id, null, { element, parent, actions, tagName: 'TEXT' });
        node.setAndroidId(WIDGET_ANDROID.TEXT);
        node.setBounds(element);
        node.setLinearBoxRect();
        if (parent != null) {
            const inherit = INHERIT_ANDROID[WIDGET_ANDROID.TEXT];
            const style = [];
            for (const prop in inherit) {
                let value = parent.style[prop]; 
                node.style[prop] = value;
                value = Node.parseStyle(null, prop, value);
                if (value != null) {
                    style.push(Utils.formatString(inherit[prop], value));
                }
            }
            node.styleAttributes = style;
        }
        element.children = [];
        return node;
    }
    static parseStyle(element, name, value) {
        if (name == 'backgroundColor') {
            if (element != null && element.parentNode != null && value == Node.getElementStyle(element.parentNode).backgroundColor) {
                return null;
            }
        }
        else if (/(pt|em)$/.test(value)) {
            value = Utils.convertToPX(value);
        }
        return value;
    }
    static isLinearXY(nodes) {
        let linearX = true;
        let linearY = true;
        if (nodes.length > 1) {
            const minBottom = nodes.reduce((a, b) => Math.min(a, b.linear.bottom), Number.MAX_VALUE);
            const minRight = nodes.reduce((a, b) => Math.min(a, b.linear.right), Number.MAX_VALUE);
            linearX = !nodes.some(item => (item.linear.top >= minBottom));
            linearY = !nodes.some(item => (item.linear.left >= minRight));
        }
        return [linearX, linearY];
    }
    static getNodesOuter(nodes) {
        let top = [nodes[0]];
        let right = [nodes[0]];
        let bottom = [nodes[0]];
        let left = [nodes[0]];
        for (let i = 1; i < nodes.length; i++) {
            let node = nodes[i];
            let nodeRight = node.label || node;
            if (top[0].bounds.top == node.bounds.top) {
                top.push(node);
            }
            else if (node.bounds.top < top[0].bounds.top) {
                top = [node];
            }
            if (right[0].bounds.right == nodeRight.bounds.right) {
                right.push(nodeRight);
            }
            else if (nodeRight.bounds.right > right[0].bounds.right) {
                right = [nodeRight];
            }
            if (bottom[0].bounds.bottom == node.bounds.bottom) {
                bottom.push(node);
            }
            else if (node.bounds.bottom > bottom[0].bounds.bottom) {
                bottom = [node];
            }
            if (left[0].bounds.left == node.bounds.left) {
                left.push(node);
            }
            else if (node.bounds.left < left[0].bounds.left) {
                left = [node];
            }
        }
        return { top, right, bottom, left };
    }
    static getHorizontalBias(parent, firstNode, lastNode) {
        const left = firstNode.linear.left - parent.box.left;
        const right = parent.box.right - lastNode.right;
        return (left == 0 || right == 0 ? 0 : (left / (left + right)).toFixed(2));
    }
    static getVerticalBias(parent, firstNode, lastNode) {
        const top = firstNode.top - parent.box.top;
        const bottom = parent.box.bottom - lastNode.bottom;
        return (top == 0 || bottom == 0 ? 0 : (top / (top + bottom)).toFixed(2));
    }
    static getRangeBounds(element) {
        const range = document.createRange();
        range.selectNodeContents(element);
        const domRect = range.getClientRects();
        const bounds = JSON.parse(JSON.stringify(domRect[domRect.length - 1]));
        if (domRect.length > 1) {
            bounds.x = Array.from(domRect).reduce((a, b) => Math.min(a, b.x), Number.MAX_VALUE);
            bounds.left = bounds.x;
            bounds.width = Array.from(domRect).reduce((a, b) => a + b.width, 0);
        }
        return bounds;
    }
    static getAndroidGravity(textAlign, verticalAlign) {
        let gravity = [];
        switch (verticalAlign) {
            case 'middle':
                gravity.push('center_vertical');
                break;
            case 'bottom':
            case 'text-bottom':
                gravity.push('bottom');
                break;
            default:
                gravity.push('top');
        }
        switch (textAlign) {
            case 'start':
                gravity.push('start');
                break;
            case 'right':
                gravity.push(getLTR('right', 'end'));
                break;
            case 'end':
                gravity.push('end');
                break;
            case 'center':
                gravity.push('center_horizontal');
                break;
            default:
                gravity.push(getLTR('left', 'start'));
        }
        if (gravity.includes('center_vertical') && gravity.includes('center_horizontal')) {
            gravity = ['center'];
        }
        return gravity.join('|');
    }
    static getElementStyle(element) {
        return (element.androidNode != null ? element.androidNode.style : getComputedStyle(element));
    }
    static orderDefault(a, b) {
        let [c, d] = [a.depth, b.depth];
        if (c == d) {
            [c, d] = [a.parent.id, b.parent.id];
            if (c == d) {
                [c, d] = [a.bounds.x, b.bounds.x];
                if (c == d) {
                    [c, d] = [a.id, b.id];
                }
            }
        }
        return (c > d ? 1 : -1);
    }
}
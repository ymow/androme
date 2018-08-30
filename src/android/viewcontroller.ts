import { Null, ObjectIndex, ObjectMap, PlainFile, StringMap, ViewData } from '../lib/types';
import Controller from '../base/controller';
import NodeList from '../base/nodelist';
import Resource from '../base/resource';
import View from './view';
import ViewGroup from './viewgroup';
import { capitalize, convertInt, convertPX, formatPX, hasValue, includesEnum, indexOf, isPercent, optional, repeat, same, search, sortAsc, withinFraction, withinRange } from '../lib/util';
import { delimitDimens, generateId, replaceUnit, resetId, stripId } from './lib/util';
import { formatResource } from './extension/lib/util';
import { hasLineBreak, isLineBreak } from '../lib/dom';
import { removePlaceholders, replaceTab } from '../lib/xml';
import { BOX_STANDARD, NODE_ALIGNMENT, NODE_PROCEDURE, NODE_STANDARD, NODE_RESOURCE, OVERFLOW_ELEMENT } from '../lib/constants';
import { AXIS_ANDROID, NODE_ANDROID, WEBVIEW_ANDROID, XMLNS_ANDROID } from './constants';
import parseRTL from './localization';
import SETTINGS from '../settings';

const MAP_LAYOUT = {
    relativeParent: {
        top: 'layout_alignParentTop',
        bottom: 'layout_alignParentBottom'
    },
    relative: {
        top: 'layout_alignTop',
        bottom: 'layout_alignBottom',
        baseline: 'layout_alignBaseline',
        bottomTop: 'layout_above',
        topBottom: 'layout_below'
    },
    constraint: {
        top: 'layout_constraintTop_toTopOf',
        bottom: 'layout_constraintBottom_toBottomOf',
        baseline: 'layout_constraintBaseline_toBaselineOf',
        bottomTop: 'layout_constraintBottom_toTopOf',
        topBottom: 'layout_constraintTop_toBottomOf'
    }
};

const MAP_CHAIN = {
    direction: ['horizontalChain', 'verticalChain'],
    leftTop: ['left', 'top'],
    rightBottom: ['right', 'bottom'],
    rightLeftBottomTop: ['rightLeft', 'bottomTop'],
    leftRightTopBottom: ['leftRight', 'topBottom'],
    widthHeight: ['Width', 'Height'],
    horizontalVertical: ['Horizontal', 'Vertical']
};

export default class ViewController<T extends View> extends Controller<T> {
    private _merge = {};

    constructor() {
        super();
        resetId();
    }

    public finalize(layouts: PlainFile[]) {
        for (const value of layouts) {
            value.content = removePlaceholders(value.content).replace(/\n\n/g, '\n');
            if (SETTINGS.dimensResourceValue) {
                value.content = this.parseDimensions(value.content);
            }
            value.content = replaceUnit(value.content);
            value.content = replaceTab(value.content, SETTINGS.insertSpaces);
        }
    }

    public reset() {
        super.reset();
        resetId();
        this._merge = {};
    }

    public setConstraints() {
        Object.assign(MAP_LAYOUT.relativeParent, {
            left: parseRTL('layout_alignParentLeft'),
            right: parseRTL('layout_alignParentRight')
        });
        Object.assign(MAP_LAYOUT.relative, {
            left: parseRTL('layout_alignLeft'),
            right: parseRTL('layout_alignRight'),
            leftRight: parseRTL('layout_toRightOf'),
            rightLeft: parseRTL('layout_toLeftOf')
        });
        Object.assign(MAP_LAYOUT.constraint, {
            left: parseRTL('layout_constraintLeft_toLeftOf'),
            right: parseRTL('layout_constraintRight_toRightOf'),
            leftRight: parseRTL('layout_constraintLeft_toRightOf'),
            rightLeft: parseRTL('layout_constraintRight_toLeftOf')
        });
        const relativeParent = MAP_LAYOUT.relativeParent;
        let constraint = false;
        let relative = false;
        let mapLayout;
        function mapParent(node: T, direction: string) {
            if (constraint) {
                return (node.app(mapLayout[direction]) === 'parent');
            }
            else {
                return (node.android(relativeParent[direction]) === 'true');
            }
        }
        function mapView(node: T, direction: string) {
            return node[(constraint ? 'app' : 'android')](mapLayout[direction]);
        }
        function mapDelete(node: T, ...direction: string[]) {
            node.delete((constraint ? 'app' : 'android'), ...direction.map(value => mapLayout[value]));
        }
        function anchored(list: NodeList<T>) {
            return list.filter(node => node.anchored);
        }
        function resolveAnchor(node: T, nodes: NodeList<T>, orientation: string) {
            if (!node.constraint[orientation]) {
                let parent: Null<T> = node;
                while (parent != null) {
                    const stringId = mapView(parent, (orientation === AXIS_ANDROID.HORIZONTAL ? 'leftRight' : 'topBottom'));
                    if (stringId) {
                        parent = nodes.locate('nodeId', stripId(stringId));
                        if (parent && parent.constraint[orientation]) {
                            return true;
                        }
                    }
                    else {
                        parent = null;
                    }
                }
                return false;
            }
            return true;
        }
        function deleteConstraints(node: T, stringId = '', parent = false) {
            for (const attr in mapLayout) {
                const value = node.app(mapLayout[attr]);
                if ((value !== 'parent' || parent) && (stringId === '' || value === stringId)) {
                    node.delete('app', mapLayout[attr]);
                }
            }
            node.constraint.horizontal = (mapParent(node, 'left') || mapParent(node, 'right'));
            node.constraint.vertical = (mapParent(node, 'top') || mapParent(node, 'bottom'));
        }
        function adjustBaseline(nodes: T[]) {
            if (nodes.length > 1) {
                const baseline = NodeList.baselineText(nodes);
                if (baseline) {
                    for (const node of nodes) {
                        if (node !== baseline && (node.nodeType < NODE_STANDARD.IMAGE || node.linearHorizontal)) {
                            node.android(mapLayout['baseline'], baseline.stringId);
                        }
                    }
                }
            }
        }
        for (const node of this.cache.visible) {
            constraint = node.is(NODE_STANDARD.CONSTRAINT);
            relative = node.is(NODE_STANDARD.RELATIVE);
            const flex = node.flex;
            if (constraint || relative || flex.enabled) {
                mapLayout = MAP_LAYOUT[(relative ? 'relative' : 'constraint')];
                const nodes = new NodeList<T>(<T[]> node.renderChildren.filter(item => !item.isolated && !item.relocated), node);
                if (relative) {
                    const rows: T[][] = [];
                    const baseline: T[] = [];
                    const multiLine = nodes.list.some(item => item.multiLine);
                    const floatParent = includesEnum(node.alignmentType, NODE_ALIGNMENT.FLOAT);
                    const textIndent = node.toInt('textIndent');
                    let rowPaddingLeft = 0;
                    if (textIndent < 0 && Math.abs(textIndent) <= node.paddingLeft) {
                        rowPaddingLeft = node.paddingLeft;
                        node.modifyBox(BOX_STANDARD.PADDING_LEFT, node.paddingLeft + textIndent);
                    }
                    let previousRowBottom: Null<T> = null;
                    let rowWidth = 0;
                    for (let i = 0; i < nodes.length; i++) {
                        const current = nodes.get(i);
                        const dimension = current[(current.multiLine ? 'bounds' : 'linear')];
                        if (i === 0) {
                            current.android(relativeParent['top'], 'true');
                            current.android(relativeParent['left'], 'true');
                            rowWidth += dimension.width;
                            if (!node.inline && textIndent > 0) {
                                current.modifyBox(BOX_STANDARD.MARGIN_LEFT, current.marginLeft + textIndent);
                            }
                            if (rowPaddingLeft > 0) {
                                current.android('singleLine', 'true');
                            }
                            rows[rows.length] = [current];
                        }
                        else {
                            const previous = nodes.get(i - 1);
                            if (current instanceof ViewGroup ||
                                (multiLine && (Math.floor(rowWidth - current.marginLeft) + dimension.width > node.box.width)) ||
                                (!multiLine && (current.linear.top >= previous.linear.bottom || withinFraction(current.linear.left, node.box.left))) ||
                                (current.multiLine && (hasLineBreak(current.element) || node.renderParent.linearHorizontal)) ||
                                isLineBreak(<Element> current.element.previousSibling) ||
                                isLineBreak(<Element> previous.element.nextSibling, 'next'))
                            {
                                const items = rows[rows.length - 1];
                                previousRowBottom = items[0];
                                for (let j = 1; j < items.length; j++) {
                                    if (items[j].linear.bottom > previousRowBottom.linear.bottom) {
                                        previousRowBottom = items[j];
                                    }
                                }
                                if (current instanceof ViewGroup) {
                                    current.constraint.marginVertical = previousRowBottom.stringId;
                                }
                                current.android(mapLayout['topBottom'], previousRowBottom.stringId);
                                current.android(relativeParent['left'], 'true');
                                rowWidth = dimension.width;
                                if (rowPaddingLeft > 0) {
                                    current.modifyBox(BOX_STANDARD.PADDING_LEFT, current.paddingLeft + rowPaddingLeft);
                                }
                                if (!floatParent) {
                                    adjustBaseline(baseline);
                                    baseline.length = 0;
                                }
                                rows.push([current]);
                            }
                            else {
                                current.android(mapLayout['leftRight'], previous.stringId);
                                if (previousRowBottom != null) {
                                    current.android(mapLayout['topBottom'], previousRowBottom.stringId);
                                }
                                rowWidth += dimension.width;
                                rows[rows.length - 1].push(current);
                            }
                        }
                        if (!floatParent && current.alignMargin) {
                            baseline.push(current);
                        }
                    }
                    if (!floatParent) {
                        adjustBaseline(baseline);
                    }
                }
                else {
                    if (node.of(NODE_STANDARD.CONSTRAINT, NODE_ALIGNMENT.HORIZONTAL)) {
                        const baseline =  NodeList.baselineText(nodes.list);
                        const text =  NodeList.baselineText(nodes.list, true);
                        const highest = nodes.sort((a, b) => a.linear.top <= b.linear.top ? -1 : 1).get(0);
                        const lowest = nodes.sort((a, b) => a.linear.bottom >= b.linear.bottom ? -1 : 1).get(0);
                        for (let i = 0; i < nodes.length; i++) {
                            const current = nodes.get(i);
                            const previous = nodes.get(i - 1);
                            if (i === 0) {
                                current.app(mapLayout['left'], 'parent');
                                current.app(mapLayout['bottom'], 'parent');
                            }
                            else {
                                current.app(mapLayout['leftRight'], previous.stringId);
                                current.constraint.marginHorizontal = previous.stringId;
                            }
                            switch (current.css('verticalAlign')) {
                                case 'text-top':
                                    if (text && current !== text) {
                                        current.app(mapLayout['top'], text.stringId);
                                        break;
                                    }
                                case 'top':
                                    if (highest !== current) {
                                        current.app(mapLayout['top'], highest.stringId);
                                    }
                                    break;
                                case 'middle':
                                    this.setAlignParent(current, AXIS_ANDROID.VERTICAL);
                                    break;
                                case 'baseline':
                                    if (baseline && current !== baseline) {
                                        current.app(mapLayout['baseline'], baseline.stringId);
                                    }
                                    break;
                                case 'text-bottom':
                                    if (text && current !== text) {
                                        current.app(mapLayout['bottom'], text.stringId);
                                        break;
                                    }
                                case 'bottom':
                                    if (lowest !== current) {
                                        current.app(mapLayout['bottom'], lowest.stringId);
                                    }
                                    break;
                            }
                        }
                    }
                    else {
                        const [pageflow, absolute] = nodes.partition(item => item.pageflow);
                        if (pageflow.length > 0) {
                            for (const current of pageflow) {
                                const parent = current.documentParent;
                                if (current.centerHorizontal) {
                                    this.setAlignParent(current, AXIS_ANDROID.HORIZONTAL);
                                }
                                else {
                                    if (current.linear.left <= parent.box.left || withinFraction(current.linear.left, parent.box.left)) {
                                        current.anchor(mapLayout['left'], 'parent', AXIS_ANDROID.HORIZONTAL);
                                    }
                                    if (current.linear.right >= parent.box.right || withinFraction(current.linear.right, parent.box.right)) {
                                        current.anchor(mapLayout['right'], 'parent', (parent.viewWidth > 0 || current.float === 'right' || current.inlineWrap || current.cssOriginal('marginLeft') === 'auto' ? AXIS_ANDROID.HORIZONTAL : ''));
                                    }
                                }
                                let alignTop = false;
                                if (current.linear.top <= parent.box.top || withinFraction(current.linear.top, parent.box.top)) {
                                    current.anchor(mapLayout['top'], 'parent', AXIS_ANDROID.VERTICAL);
                                    alignTop = true;
                                }
                                if (current.linear.bottom >= parent.box.bottom || withinFraction(current.linear.bottom, parent.box.bottom)) {
                                    if (!(alignTop && current.inlineWrap)) {
                                        current.anchor(mapLayout['bottom'], 'parent', (parent.viewHeight > 0 ? AXIS_ANDROID.VERTICAL : ''));
                                    }
                                }
                                for (const adjacent of pageflow) {
                                    if (current !== adjacent) {
                                        const stringId = adjacent.stringId;
                                        const horizontal = (resolveAnchor(adjacent, nodes, AXIS_ANDROID.HORIZONTAL) ? AXIS_ANDROID.HORIZONTAL : '');
                                        const vertical = (resolveAnchor(adjacent, nodes, AXIS_ANDROID.VERTICAL) ? AXIS_ANDROID.VERTICAL : '');
                                        const intersectY = current.intersectY(adjacent.linear);
                                        const alignMargin = (current.alignMargin && adjacent.alignMargin);
                                        if (current.viewWidth === 0 && current.linear.left === adjacent.linear.left && current.linear.right === adjacent.linear.right) {
                                            if (!mapParent(current, 'right')) {
                                                current.anchor(mapLayout['left'], stringId);
                                            }
                                            if (!mapParent(current, 'left')) {
                                                current.anchor(mapLayout['right'], stringId);
                                            }
                                        }
                                        if (!current.centerHorizontal) {
                                            if ((!current.constraint.horizontal && alignMargin && withinRange(current.linear.left, adjacent.linear.right, SETTINGS.constraintWhitespaceHorizontalOffset)) || withinFraction(current.linear.left, adjacent.linear.right)) {
                                                if (current.float !== 'right' || current.float === adjacent.float) {
                                                    current.anchor(mapLayout['leftRight'], stringId, horizontal, current.withinX(adjacent.linear));
                                                }
                                            }
                                            if ((!current.constraint.horizontal && alignMargin && withinRange(current.linear.right, adjacent.linear.left, SETTINGS.constraintWhitespaceHorizontalOffset)) || withinFraction(current.linear.right, adjacent.linear.left)) {
                                                current.anchor(mapLayout['rightLeft'], stringId, horizontal, current.withinX(adjacent.linear));
                                            }
                                        }
                                        const topParent = mapParent(current, 'top');
                                        const bottomParent = mapParent(current, 'bottom');
                                        const blockElement = (!flex.enabled && !current.inlineElement);
                                        if ((!current.constraint.vertical && alignMargin && withinRange(current.linear.top, adjacent.linear.bottom, SETTINGS.constraintWhitespaceVerticalOffset)) || withinFraction(current.linear.top, adjacent.linear.bottom)) {
                                            if (intersectY || !bottomParent || blockElement) {
                                                current.anchor(mapLayout['topBottom'], stringId, vertical, intersectY);
                                            }
                                        }
                                        if ((!current.constraint.vertical && alignMargin && withinRange(current.linear.bottom, adjacent.linear.top, SETTINGS.constraintWhitespaceVerticalOffset)) || withinFraction(current.linear.bottom, adjacent.linear.top)) {
                                            if (intersectY || !topParent || blockElement) {
                                                current.anchor(mapLayout['bottomTop'], stringId, vertical, intersectY);
                                            }
                                        }
                                        if (!topParent && !bottomParent) {
                                            if (current.linear.top === adjacent.linear.top) {
                                                current.anchor(mapLayout['top'], stringId, vertical);
                                            }
                                            if (current.linear.bottom === adjacent.linear.bottom) {
                                                current.anchor(mapLayout['bottom'], stringId, vertical);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (absolute.length > 0) {
                            node.setBoundsMin();
                            for (const current of absolute) {
                                if (current.top != null && current.toInt('top') === 0) {
                                    current.anchor(mapLayout['top'], 'parent', AXIS_ANDROID.VERTICAL);
                                }
                                if (current.right != null && current.toInt('right') >= 0) {
                                    current.anchor(mapLayout['right'], 'parent', AXIS_ANDROID.HORIZONTAL);
                                    if (current.centerHorizontal && current.toInt('left') > 0) {
                                        current.anchor(mapLayout['left'], 'parent');
                                        current.modifyBox(BOX_STANDARD.MARGIN_LEFT, current.toInt('left'));
                                    }
                                }
                                if (current.bottom != null && current.toInt('bottom') >= 0) {
                                    current.anchor(mapLayout['bottom'], 'parent', AXIS_ANDROID.VERTICAL);
                                }
                                if (current.left != null && current.toInt('left') === 0) {
                                    current.anchor(mapLayout['left'], 'parent', AXIS_ANDROID.HORIZONTAL);
                                    if (current.centerHorizontal && current.toInt('right') > 0) {
                                        current.anchor(mapLayout['right'], 'parent');
                                        current.modifyBox(BOX_STANDARD.MARGIN_RIGHT, current.toInt('right'));
                                    }
                                }
                                if (current.left === 0 && current.right === 0 && !current.floating) {
                                    current.android('layout_width', 'match_parent');
                                }
                                if (current.top === 0 && current.bottom === 0) {
                                    current.android('layout_height', 'match_parent');
                                }
                            }
                        }
                        for (const current of nodes) {
                            const leftRight = mapView(current, 'leftRight');
                            if (leftRight) {
                                if (!current.constraint.horizontal) {
                                    current.constraint.horizontal = flex.enabled || resolveAnchor(current, nodes, AXIS_ANDROID.HORIZONTAL);
                                }
                                current.constraint.marginHorizontal = leftRight;
                            }
                            const topBottom = mapView(current, 'topBottom');
                            if (topBottom) {
                                if (!current.constraint.vertical) {
                                    current.constraint.vertical = flex.enabled || resolveAnchor(current, nodes, AXIS_ANDROID.VERTICAL);
                                }
                                current.constraint.marginVertical = topBottom;
                                mapDelete(current, 'top');
                            }
                            if (mapParent(current, 'left') && mapParent(current, 'right')) {
                                if (current.autoMargin) {
                                    if (current.cssOriginal('marginLeft') === 'auto' && current.cssOriginal('marginRight') !== 'auto') {
                                        mapDelete(current, 'left');
                                    }
                                    if (current.cssOriginal('marginLeft') !== 'auto' && current.cssOriginal('marginRight') === 'auto') {
                                        mapDelete(current, 'right');
                                    }
                                    if (current.centerHorizontal) {
                                        if (node.viewWidth > 0) {
                                            current.android('layout_width', 'match_parent');
                                        }
                                        else if (current.inlineElement && current.viewWidth === 0) {
                                            current.android('layout_width', 'wrap_content');
                                        }
                                    }
                                }
                                else if (current.floating) {
                                    mapDelete(current, (current.float === 'right' ? 'left' : 'right'));
                                }
                                else if (current.inlineElement) {
                                    if (current.nodeType <= NODE_STANDARD.IMAGE) {
                                        switch (current.css('textAlign')) {
                                            case 'center':
                                                break;
                                            case 'right':
                                            case 'end' :
                                                mapDelete(current, 'left');
                                                break;
                                            default:
                                                mapDelete(current, 'right');
                                                break;
                                        }
                                    }
                                    else {
                                        mapDelete(current, 'right');
                                    }
                                }
                                else {
                                    mapDelete(current, 'right');
                                    current.android('layout_width', 'match_parent');
                                }
                            }
                            if (mapView(current, 'bottomTop')) {
                                mapDelete(current, 'bottom');
                            }
                        }
                        for (let i = 0; i < pageflow.length; i++) {
                            const current = pageflow.get(i);
                            if (!current.anchored) {
                                const result = search(current.get('app'), '*constraint*');
                                for (const [key, value] of result) {
                                    if (value !== 'parent' && anchored(pageflow).locate('stringId', value)) {
                                        if (indexOf(key, parseRTL('Left'), parseRTL('Right')) !== -1) {
                                            current.constraint.horizontal = true;
                                        }
                                        if (indexOf(key, 'Top', 'Bottom', 'Baseline', 'above', 'below') !== -1) {
                                            current.constraint.vertical = true;
                                        }
                                    }
                                }
                                if (current.anchored) {
                                    i = -1;
                                }
                            }
                        }
                        if (flex.enabled || (!SETTINGS.constraintChainDisabled && pageflow.length > 1)) {
                            let flexbox: Null<any[]> = null;
                            if (flex.enabled) {
                                if (flex.wrap === 'nowrap') {
                                    const horizontalChain = pageflow.clone();
                                    const verticalChain = pageflow.clone();
                                    switch (flex.direction) {
                                        case 'row-reverse':
                                            horizontalChain.list.reverse();
                                        case 'row':
                                            verticalChain.clear();
                                            break;
                                        case 'column-reverse':
                                            verticalChain.list.reverse();
                                        case 'column':
                                            horizontalChain.clear();
                                            break;
                                    }
                                    flexbox = [{ constraint: { horizontalChain, verticalChain } }];
                                }
                                else {
                                    const sorted = pageflow.clone();
                                    switch (flex.direction) {
                                        case 'row-reverse':
                                        case 'column-reverse':
                                            sorted.list.reverse();
                                            break;
                                    }
                                    const map: ObjectIndex<T[]> = {};
                                    const levels: number[] = [];
                                    for (const item of sorted) {
                                        const y = item.linear.top;
                                        if (map[y] == null) {
                                            map[y] = [];
                                            levels.push(y);
                                        }
                                        map[y].push(item);
                                    }
                                    function reverseMap() {
                                        for (const y in map) {
                                            map[y].reverse();
                                        }
                                    }
                                    switch (flex.wrap) {
                                        case 'wrap':
                                            if (flex.direction === 'column-reverse') {
                                                reverseMap();
                                            }
                                            break;
                                        case 'wrap-reverse':
                                            if (flex.direction.indexOf('row') !== -1) {
                                                levels.reverse();
                                            }
                                            else if (flex.direction === 'column') {
                                                reverseMap();
                                            }
                                            break;
                                    }
                                    flexbox = [];
                                    for (const n of levels) {
                                        flexbox.push({ constraint: { horizontalChain: new NodeList<T>(map[n]), verticalChain: new NodeList<T>() } });
                                    }
                                }
                            }
                            else {
                                const horizontal = pageflow.list.filter(current => !current.constraint.horizontal);
                                const vertical = pageflow.list.filter(current => !current.constraint.vertical);
                                pageflow.list.some((current: T) => {
                                    let horizontalChain: T[] = [];
                                    let verticalChain: T[] = [];
                                    if (horizontal.length > 0) {
                                        horizontalChain = this.partitionChain(current, pageflow, AXIS_ANDROID.HORIZONTAL);
                                        current.constraint.horizontalChain = new NodeList<T>(sortAsc(horizontalChain, 'linear.left'));
                                    }
                                    if (vertical.length > 0) {
                                        verticalChain = this.partitionChain(current, pageflow, AXIS_ANDROID.VERTICAL);
                                        current.constraint.verticalChain = new NodeList<T>(sortAsc(verticalChain, 'linear.top'));
                                    }
                                    return (horizontalChain.length === pageflow.length || verticalChain.length === pageflow.length);
                                });
                            }
                            MAP_CHAIN.direction.forEach((value, index) => {
                                const connected = (flex.enabled ? flexbox : pageflow.clone().list.sort((a, b) => (a.constraint[value] != null ? a.constraint[value].length : 0) >= (b.constraint[value] != null ? b.constraint[value].length : 0) ? -1 : 1));
                                if (connected != null) {
                                    connected.filter(current => current.constraint[value]).forEach((current, level) => {
                                        const chainable: NodeList<T> = current.constraint[value];
                                        if (chainable.length > (flex.enabled ? 0 : 1)) {
                                            const inverse = (index === 0 ? 1 : 0);
                                            const [HV, VH] = [MAP_CHAIN['horizontalVertical'][index], MAP_CHAIN['horizontalVertical'][inverse]];
                                            const [LT, TL] = [MAP_CHAIN['leftTop'][index], MAP_CHAIN['leftTop'][inverse]];
                                            const [RB, BR] = [MAP_CHAIN['rightBottom'][index], MAP_CHAIN['rightBottom'][inverse]];
                                            const [WH, HW] = [MAP_CHAIN['widthHeight'][index], MAP_CHAIN['widthHeight'][inverse]];
                                            const orientation = HV.toLowerCase();
                                            const orientationInverse = VH.toLowerCase();
                                            const dimension = WH.toLowerCase();
                                            if (flex.enabled) {
                                                if (chainable.list.some(item => item.flex.order > 0)) {
                                                    chainable[(flex.direction.indexOf('reverse') !== -1 ? 'sortDesc' : 'sortAsc')]('flex.order');
                                                }
                                            }
                                            else {
                                                if (chainable.list.every(item => resolveAnchor(item, nodes, orientation))) {
                                                    return;
                                                }
                                            }
                                            chainable.parent = node;
                                            const first = chainable.get(0);
                                            const last = chainable.get();
                                            let maxOffset = -1;
                                            let disconnected = false;
                                            let marginDelete = false;
                                            const attrs = (index === 0 ? [AXIS_ANDROID.HORIZONTAL, 'left', 'leftRight', 'top', AXIS_ANDROID.VERTICAL, 'viewWidth', 'right', 'marginHorizontal'] : [AXIS_ANDROID.VERTICAL, 'top', 'topBottom', 'left', AXIS_ANDROID.HORIZONTAL, 'viewHeight', 'bottom', 'marginVertical']);
                                            for (let i = 0; i < chainable.length; i++) {
                                                const item = chainable.get(i);
                                                if (i === 0) {
                                                    if (!mapParent(item, attrs[1])) {
                                                        disconnected = true;
                                                        break;
                                                    }
                                                }
                                                else {
                                                    if (mapView(item, attrs[2]) == null) {
                                                        disconnected = true;
                                                        break;
                                                    }
                                                }
                                            }
                                            if (!disconnected) {
                                                if (chainable.list.every(item => same(first, item, `linear.${attrs[3]}`))) {
                                                    for (let j = 1; j < chainable.length; j++) {
                                                        const item = chainable.get(j);
                                                        if (!item.constraint[attrs[4]]) {
                                                            item.anchor(mapLayout[attrs[3]], first.stringId, attrs[4]);
                                                        }
                                                    }
                                                }
                                                if (!flex.enabled && node[attrs[5]] === 0) {
                                                    mapDelete(last, attrs[6]);
                                                    last.constraint[attrs[7]] = mapView(last, attrs[2]);
                                                }
                                            }
                                            first.anchor(mapLayout[LT], 'parent', orientation);
                                            last.anchor(mapLayout[RB], 'parent', orientation);
                                            for (let i = 0; i < chainable.length; i++) {
                                                const chain = chainable.get(i);
                                                const next = chainable.get(i + 1);
                                                const previous = chainable.get(i - 1);
                                                if (flex.enabled) {
                                                    if (chain.linear[TL] === node.box[TL] && chain.linear[BR] === node.box[BR]) {
                                                        this.setAlignParent(chain, orientationInverse);
                                                    }
                                                    const rowNext = connected[level + 1];
                                                    if (rowNext && rowNext.constraint[value] != null) {
                                                        const chainNext = (<NodeList<T>> rowNext.constraint[value]).get(i);
                                                        if (chainNext && chain.withinY(chainNext.linear)) {
                                                            chain.anchor(mapLayout['bottomTop'], chainNext.stringId);
                                                            if (!mapParent(chain, 'bottom')) {
                                                                mapDelete(chain, 'bottom');
                                                            }
                                                        }
                                                    }
                                                }
                                                if (next) {
                                                    chain.anchor(mapLayout[MAP_CHAIN['rightLeftBottomTop'][index]], next.stringId);
                                                    maxOffset = Math.max(next.linear[LT] - chain.linear[RB], maxOffset);
                                                }
                                                if (previous) {
                                                    chain.anchor(mapLayout[MAP_CHAIN['leftRightTopBottom'][index]], previous.stringId);
                                                    chain.constraint[`margin${HV}`] = previous.stringId;
                                                }
                                                chain.constraint[`chain${HV}`] = true;
                                                if (!chain.has(dimension)) {
                                                    const minWH = chain.styleMap[`min${WH}`];
                                                    const maxWH = chain.styleMap[`max${WH}`];
                                                    if (minWH) {
                                                        chain.app(`layout_constraint${WH}_min`, minWH);
                                                    }
                                                    if (maxWH) {
                                                        chain.app(`layout_constraint${WH}_max`, maxWH);
                                                    }
                                                    if (minWH || maxWH) {
                                                        chain.android(`layout_${dimension}`, '0px');
                                                    }
                                                }
                                                if (flex.enabled) {
                                                    chain.app(`layout_constraint${HV}_weight`, chain.flex.grow.toString());
                                                    if (chain[`view${WH}`] == null && chain.flex.grow === 0 && chain.flex.shrink <= 1) {
                                                        chain.android(`layout_${dimension}`, 'wrap_content');
                                                    }
                                                    else if (chain.flex.grow > 0) {
                                                        chain.android(`layout_${dimension}`, '0px');
                                                    }
                                                    if (chain.flex.shrink === 0) {
                                                        chain.app(`layout_constrained${WH}`, 'true');
                                                    }
                                                    switch (chain.flex.alignSelf) {
                                                        case 'flex-start':
                                                            chain.anchor(mapLayout[TL], 'parent', orientationInverse);
                                                            break;
                                                        case 'flex-end':
                                                            chain.anchor(mapLayout[BR], 'parent', orientationInverse);
                                                            break;
                                                        case 'baseline':
                                                            const valid = chainable.list.some(adjacent => {
                                                                if (adjacent !== chain && adjacent.nodeType <= NODE_STANDARD.TEXT) {
                                                                    chain.anchor(mapLayout['baseline'], adjacent.stringId);
                                                                    return true;
                                                                }
                                                                return false;
                                                            });
                                                            if (valid) {
                                                                mapDelete(chain, 'top', 'bottom');
                                                                for (const item of chainable) {
                                                                    if (mapView(item, 'top') === chain.stringId) {
                                                                        mapDelete(item, 'top');
                                                                    }
                                                                    if (mapView(item, 'bottom') === chain.stringId) {
                                                                        mapDelete(item, 'bottom');
                                                                    }
                                                                }
                                                                chain.constraint.vertical = true;
                                                            }
                                                            break;
                                                        case 'center':
                                                        case 'stretch':
                                                            if (chain.flex.alignSelf !== 'center') {
                                                                chain.android(`layout_${HW.toLowerCase()}`, '0px');
                                                            }
                                                            this.setAlignParent(chain, orientationInverse);
                                                            break;
                                                    }
                                                    if (chain.flex.basis !== 'auto') {
                                                        const basis = convertInt(chain.flex.basis);
                                                        if (basis > 0) {
                                                            if (isPercent(chain.flex.basis)) {
                                                                chain.app(`layout_constraint${WH}_percent`, (basis / 100).toString());
                                                            }
                                                            else {
                                                                chain.app(`layout_constraint${WH}_min`, formatPX(basis));
                                                                chain.constraint[`min${WH}`] = true;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            const chainStyle = `layout_constraint${HV}_chainStyle`;
                                            if (flex.enabled && flex.justifyContent !== 'normal' && Math.max.apply(null, chainable.list.map(item => item.flex.grow)) === 0) {
                                                switch (flex.justifyContent) {
                                                    case 'space-between':
                                                        first.app(chainStyle, 'spread_inside');
                                                        break;
                                                    case 'space-evenly':
                                                        first.app(chainStyle, 'spread');
                                                        for (const item of chainable) {
                                                            item.app(`layout_constraint${HV}_weight`, (item.flex.grow || 1).toString());
                                                        }
                                                        break;
                                                    case 'space-around':
                                                        first.app(`layout_constraint${HV}_chainStyle`, 'spread_inside');
                                                        first.constraint[orientation] = false;
                                                        last.constraint[orientation] = false;
                                                        this.addGuideline(first, orientation, true, false);
                                                        this.addGuideline(last, orientation, true, true);
                                                        break;
                                                    default:
                                                        let justifyContent = flex.justifyContent;
                                                        if (flex.direction.indexOf('reverse') !== -1) {
                                                            switch (flex.justifyContent) {
                                                                case 'flex-start':
                                                                    justifyContent = 'flex-end';
                                                                    break;
                                                                case 'flex-end':
                                                                    justifyContent = 'flex-start';
                                                                    break;
                                                            }
                                                        }
                                                        let bias = '0.5';
                                                        switch (justifyContent) {
                                                            case 'flex-start':
                                                                bias = '0';
                                                                break;
                                                            case 'flex-end':
                                                                bias = '1';
                                                                break;
                                                        }
                                                        first.app(chainStyle, 'packed');
                                                        first.app(`layout_constraint${HV}_bias`, bias);
                                                        break;
                                                }
                                                marginDelete = true;
                                            }
                                            else {
                                                const alignLeft = withinFraction(node.box.left, first.linear.left);
                                                const alignRight = withinFraction(last.linear.right, node.box.right);
                                                const alignTop = withinFraction(node.box.top, first.linear.top);
                                                const alignBottom = withinFraction(last.linear.bottom, node.box.bottom);
                                                if ((orientation === AXIS_ANDROID.HORIZONTAL && alignLeft && alignRight) || (orientation === AXIS_ANDROID.VERTICAL && alignTop && alignBottom)) {
                                                    if (chainable.length > 2 || flex.enabled) {
                                                        if (!flex.enabled && node.inlineElement) {
                                                            first.app(chainStyle, 'packed');
                                                            first.app(`layout_constraint${HV}_bias`, (index === 0 && node.float === 'right' ? '1' : '0'));
                                                        }
                                                        else {
                                                            first.app(chainStyle, 'spread_inside');
                                                            marginDelete = true;
                                                        }
                                                    }
                                                    else if (maxOffset > SETTINGS[`constraintChainPacked${HV}Offset`]) {
                                                        if (mapParent(first, LT)) {
                                                            mapDelete(first, MAP_CHAIN['rightLeftBottomTop'][index]);
                                                        }
                                                        if (mapParent(last, RB)) {
                                                            mapDelete(last, MAP_CHAIN['leftRightTopBottom'][index]);
                                                        }
                                                    }
                                                }
                                                else if ((maxOffset <= SETTINGS[`chainPacked${HV}Offset`] || node.flex.wrap !== 'nowrap') || (orientation === AXIS_ANDROID.HORIZONTAL && (alignLeft || alignRight))) {
                                                    first.app(chainStyle, 'packed');
                                                    let bias = '';
                                                    if (orientation === AXIS_ANDROID.HORIZONTAL) {
                                                        if (alignLeft) {
                                                            bias = '0';
                                                        }
                                                        else if (alignRight) {
                                                            bias = '1';
                                                        }
                                                    }
                                                    if (bias === '') {
                                                        bias = chainable[`${orientation}Bias`];
                                                    }
                                                    first.app(`layout_constraint${HV}_bias`, bias);
                                                }
                                                else {
                                                    first.app(chainStyle, 'spread');
                                                    marginDelete = true;
                                                }
                                                if (!flex.enabled) {
                                                    (index === 0 ? [[TL, BR], [BR, TL]] : [[LT, RB], [RB, LT]]).forEach(opposing => {
                                                        if (chainable.list.every(upper => same(first, upper, `linear.${opposing[0]}`) && chainable.list.some(lower => !same(first, lower, `linear.${opposing[1]}`)))) {
                                                            for (const chain of chainable) {
                                                                mapDelete(chain, opposing[1]);
                                                            }
                                                        }
                                                    });
                                                    for (const inner of chainable) {
                                                        for (const outer of pageflow) {
                                                            const horizontal: NodeList<T> = outer.constraint.horizontalChain;
                                                            const vertical: NodeList<T> = outer.constraint.verticalChain;
                                                            if (horizontal && horizontal.length > 0 && horizontal.locate('id', inner.id)) {
                                                                horizontal.clear();
                                                            }
                                                            if (vertical && vertical.length > 0 && vertical.locate('id', inner.id)) {
                                                                vertical.clear();
                                                            }
                                                        }
                                                    }
                                                }
                                                else {
                                                    marginDelete = true;
                                                }
                                            }
                                            if (marginDelete) {
                                                for (const item of chainable) {
                                                    delete item.constraint.marginHorizontal;
                                                    delete item.constraint.marginVertical;
                                                }
                                            }
                                        }
                                    });
                                }
                            });
                        }
                        for (const current of pageflow) {
                            current.constraint.horizontal = resolveAnchor(current, nodes, AXIS_ANDROID.HORIZONTAL);
                            current.constraint.vertical = resolveAnchor(current, nodes, AXIS_ANDROID.VERTICAL);
                        }
                        if (flex.enabled) {
                            if (flex.wrap !== 'nowrap') {
                                ['topBottom', 'bottomTop'].forEach((value, index) => {
                                    for (const current of pageflow) {
                                        if (mapParent(current, (index === 0 ? 'bottom' : 'top'))) {
                                            const chain: T[] = [current];
                                            let valid = false;
                                            let adjacent: Null<T> = current;
                                            while (adjacent != null) {
                                                const topBottom = mapView(adjacent, value);
                                                if (topBottom) {
                                                    adjacent = nodes.locate('nodeId', stripId(topBottom));
                                                    if (adjacent && current.withinY(adjacent.linear)) {
                                                        chain.push(adjacent);
                                                        valid = mapParent(adjacent, (index === 0 ? 'top' : 'bottom'));
                                                        if (valid) {
                                                            break;
                                                        }
                                                    }
                                                }
                                                else {
                                                    adjacent = null;
                                                }
                                            }
                                            if (!valid) {
                                                for (const item of chain) {
                                                    pageflow.list.some(next => {
                                                        if (item !== next && next.linear.top === item.linear.top && next.linear.bottom === item.linear.bottom) {
                                                            mapDelete(item, 'topBottom', 'bottomTop');
                                                            item.app(mapLayout['top'], next.stringId);
                                                            item.app(mapLayout['bottom'], next.stringId);
                                                            return true;
                                                        }
                                                        return false;
                                                    });
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                        else {
                            for (const current of pageflow) {
                                [['top', 'bottom', 'topBottom'], ['bottom', 'top', 'bottomTop']].forEach(direction => {
                                    if (mapParent(current, direction[1]) && mapView(current, direction[2]) == null) {
                                        ['leftRight', 'rightLeft'].forEach(value => {
                                            const stringId = mapView(current, value);
                                            if (stringId) {
                                                const aligned = pageflow.locate('stringId', stringId);
                                                if (aligned && mapView(aligned, direction[2])) {
                                                    if (withinFraction(current.linear[direction[0]], aligned.linear[direction[0]])) {
                                                        current.anchor(mapLayout[direction[0]], aligned.stringId);
                                                    }
                                                    if (withinFraction(current.linear[direction[1]], aligned.linear[direction[1]])) {
                                                        current.anchor(mapLayout[direction[1]], aligned.stringId);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                            const unbound = pageflow.filter(current => !current.anchored && (mapParent(current, 'top') || mapParent(current, 'right') || mapParent(current, 'bottom') || mapParent(current, 'left')));
                            if (anchored(nodes).length === 0 && unbound.length === 0) {
                                unbound.append(nodes.get(0));
                            }
                            for (const current of unbound) {
                                this.addGuideline(current, '', false, false);
                            }
                            const [adjacent, unanchored] = nodes.partition(item => item.anchored);
                            for (const current of unanchored) {
                                if (withinRange(current.horizontalBias, 0.5, 0.01) && withinRange(current.verticalBias, 0.5, 0.01)) {
                                    this.setAlignParent(current);
                                }
                                else if (SETTINGS.constraintCirclePositionAbsolute && adjacent.length > 0 && !current.constraint.horizontal && !current.constraint.vertical) {
                                    deleteConstraints(current, '', true);
                                    const opposite = adjacent.get(0);
                                    const center1 = current.center;
                                    const center2 = opposite.center;
                                    const x = Math.abs(center1.x - center2.x);
                                    const y = Math.abs(center1.y - center2.y);
                                    let degrees = Math.round(Math.atan(Math.min(x, y) / Math.max(x, y)) * (180 / Math.PI));
                                    const radius = Math.round(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
                                    if (center1.y > center2.y) {
                                        if (center1.x > center2.x) {
                                            if (x > y) {
                                                degrees += 90;
                                            }
                                            else {
                                                degrees = 180 - degrees;
                                            }
                                        }
                                        else {
                                            if (x > y) {
                                                degrees = 270 - degrees;
                                            }
                                            else {
                                                degrees += 180;
                                            }
                                        }
                                    }
                                    else if (center1.y < center2.y) {
                                        if (center2.x > center1.x) {
                                            if (x > y) {
                                                degrees += 270;
                                            }
                                            else {
                                                degrees = 360 - degrees;
                                            }
                                        }
                                        else {
                                            if (x > y) {
                                                degrees = 90 - degrees;
                                            }
                                        }
                                    }
                                    else {
                                        degrees = (center1.x > center2.x ? 90 : 270);
                                    }
                                    current.app('layout_constraintCircle', opposite.stringId);
                                    current.app('layout_constraintCircleRadius', delimitDimens(`${current.tagName}`, 'constraintcircleradius', formatPX(radius)));
                                    current.app('layout_constraintCircleAngle', degrees.toString());
                                    current.constraint.horizontal = true;
                                    current.constraint.vertical = true;
                                }
                                else {
                                    this.addGuideline(current);
                                }
                            }
                            let bottomParent: Null<boolean> = null;
                            let rightParent: Null<boolean> = null;
                            const bottomMax = nodes.bottom;
                            const connected = {};
                            function deleteChain(item: T, value: string) {
                                mapDelete(item, value);
                                connected[item.stringId][value] = null;
                            }
                            for (const current of nodes) {
                                const top = mapParent(current, 'top');
                                const right = mapParent(current, 'right');
                                let bottom = mapParent(current, 'bottom');
                                const left = mapParent(current, 'left');
                                connected[current.stringId] = {
                                    leftRight: mapView(current, 'leftRight'),
                                    rightLeft: mapView(current, 'rightLeft'),
                                    topBottom: mapView(current, 'topBottom'),
                                    bottomTop: mapView(current, 'bottomTop'),
                                };
                                if ((top && bottom && (current.cssOriginal('marginTop') !== 'auto' && current.linear.bottom < bottomMax)) || (bottom && mapView(current, 'topBottom') && current.viewHeight > 0)) {
                                    mapDelete(current, 'bottom');
                                    bottom = false;
                                }
                                if (current.pageflow) {
                                    [[left, right, 'rightLeft', 'leftRight', 'right', 'left', 'Horizontal'], [top, bottom, 'bottomTop', 'topBottom', 'bottom', 'top', 'Vertical']].forEach((value: [boolean, boolean, string, string, string, string, string], index) => {
                                        if (value[0] || value[1]) {
                                            let valid = (value[0] && value[1]);
                                            let next: Null<T> = current;
                                            if (!valid) {
                                                do {
                                                    const stringId = mapView(next, (value[0] ? value[2] : value[3]));
                                                    if (stringId) {
                                                        next = this.findByStringId(stringId);
                                                        if (next && ((value[0] && mapParent(next, value[4])) || (value[1] && mapParent(next, value[5])))) {
                                                            valid = true;
                                                            break;
                                                        }
                                                    }
                                                    else {
                                                        next = null;
                                                    }
                                                }
                                                while (next != null);
                                            }
                                            if (valid) {
                                                node.constraint[`layout${value[6]}`] = true;
                                            }
                                            if (!current.constraint[`chain${value[6]}`]) {
                                                if (value[0] && value[1]) {
                                                    if (!current.autoMargin && !current.linearVertical) {
                                                        current.android(`layout_${(index === 0 ? 'width' : 'height')}`, 'match_parent', false);
                                                    }
                                                }
                                                else if (value[1]) {
                                                    if (valid) {
                                                        const below = this.findByStringId(<string> mapView(current, value[3]));
                                                        if (below && below.marginBottom === 0) {
                                                            mapDelete(current, value[4]);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    });
                                    if (right) {
                                        if (!rightParent) {
                                            rightParent = false;
                                            rightParent = resolveAnchor(current, nodes, AXIS_ANDROID.HORIZONTAL);
                                        }
                                    }
                                    else if (left) {
                                        if (current.is(NODE_STANDARD.TEXT) && current.inheritCss('textAlign') === 'center') {
                                            current.anchor(mapLayout['right'], 'parent');
                                        }
                                        if ((current.inlineText || current.plainText) && current.viewWidth === 0 && current.toInt('maxWidth') === 0 && current.multiLine && !hasLineBreak(current.element) && !nodes.list.some(item => mapView(item, 'rightLeft') === current.stringId)) {
                                            current.android('layout_width', 'match_parent');
                                        }
                                    }
                                    if (bottom) {
                                        if (!bottomParent) {
                                            bottomParent = false;
                                            bottomParent = resolveAnchor(current, nodes, AXIS_ANDROID.VERTICAL);
                                        }
                                    }
                                }
                                else {
                                    if (left && right && current.right == null && current.viewWidth > 0) {
                                        mapDelete(current, 'right');
                                    }
                                    if (top && bottom && current.bottom == null && current.viewHeight > 0) {
                                        mapDelete(current, 'bottom');
                                    }
                                    if (left && right && node.viewWidth === 0) {
                                        node.constraint.layoutWidth = true;
                                    }
                                    if (top && bottom && node.viewHeight === 0) {
                                        node.constraint.layoutHeight = true;
                                    }
                                    if (right && current.toInt('right') > 0) {
                                        current.modifyBox(BOX_STANDARD.MARGIN_RIGHT, current.marginRight + current.toInt('right'));
                                    }
                                    if (bottom && current.toInt('bottom') > 0) {
                                        current.modifyBox(BOX_STANDARD.MARGIN_BOTTOM, current.marginBottom + current.toInt('bottom'));
                                    }
                                    if (right && bottom) {
                                        if (node.documentRoot) {
                                            if (node.viewWidth === 0) {
                                                node.constraint.layoutWidth = false;
                                                node.constraint.layoutHorizontal = false;
                                            }
                                            if (node.viewHeight === 0) {
                                                node.constraint.layoutHeight = false;
                                                node.constraint.layoutVertical = false;
                                            }
                                        }
                                    }
                                }
                            }
                            for (const left in connected) {
                                for (const right in connected) {
                                    if (left !== right) {
                                        ['leftRight', 'rightLeft', 'bottomTop', 'topBottom'].forEach(value => {
                                            if (connected[left][value] && connected[left][value] === connected[right][value]) {
                                                const conflict = nodes.locate('stringId', connected[left][value]);
                                                if (conflict) {
                                                    [nodes.locate('stringId', left), nodes.locate('stringId', right)].some((item, index) => {
                                                        if (item) {
                                                            const stringId = (index === 0 ? left : right);
                                                            switch (value) {
                                                                case 'leftRight':
                                                                case 'rightLeft':
                                                                    if ((mapView(item, 'left') || mapView(item, 'right')) && mapView(conflict, (value === 'rightLeft' ? 'leftRight' : 'rightLeft')) !== stringId) {
                                                                        deleteChain(item, value);
                                                                        return true;
                                                                    }
                                                                    break;
                                                                case 'bottomTop':
                                                                case 'topBottom':
                                                                    if ((mapView(item, 'top') || mapView(item, 'bottom')) && mapView(conflict, (value === 'topBottom' ? 'bottomTop' : 'topBottom')) !== stringId) {
                                                                        deleteChain(item, value);
                                                                        return true;
                                                                    }
                                                                    break;
                                                            }
                                                        }
                                                        return false;
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                            if (rightParent === false) {
                                node.constraint.layoutWidth = true;
                            }
                            if (bottomParent === false) {
                                node.constraint.layoutHeight = true;
                            }
                        }
                    }
                }
                for (const current of nodes) {
                    if (current.constraint.marginHorizontal != null) {
                        const item = this.findByStringId(current.constraint.marginHorizontal);
                        if (item) {
                            const offset = current.linear.left - item.linear.right;
                            if (offset >= 1) {
                                current.modifyBox(BOX_STANDARD.MARGIN_LEFT, current.marginLeft + offset);
                            }
                        }
                    }
                    if (current.constraint.marginVertical != null) {
                        const item = this.findByStringId(current.constraint.marginVertical);
                        if (item) {
                            const offset = current.linear.top - item.linear.bottom;
                            if (offset >= 1) {
                                current.modifyBox(BOX_STANDARD.MARGIN_TOP, current.marginTop + offset);
                            }
                        }
                    }
                }
            }
            else {
                if (node.linearHorizontal) {
                    this.adjustLineHeight(<T[]> node.renderChildren, node);
                }
            }
        }
    }

    public renderGroup(node: T, parent: T, viewName: number | string, options?: ObjectMap<any>) {
        const target = (node.isSet('dataset', 'target') && !node.isSet('dataset', 'include'));
        let preXml = '';
        let postXml = '';
        let renderParent = parent;
        if (typeof viewName === 'number') {
            viewName = View.getNodeName(viewName);
        }
        switch (viewName) {
            case NODE_ANDROID.LINEAR:
                options = { android: { orientation: (options && options.horizontal ? AXIS_ANDROID.HORIZONTAL : AXIS_ANDROID.VERTICAL) } };
                break;
            case NODE_ANDROID.GRID:
                options = { app: { columnCount: (options && options.columns ? options.columns.toString() : '2'), rowCount: (options && options.rows > 0 ? options.rows.toString() : '') } };
                break;
            default:
                options = {};
                break;
        }
        node.setNodeId(viewName);
        if (node.overflow !== OVERFLOW_ELEMENT.NONE) {
            const scrollView: string[] = [];
            if (node.overflowX) {
                scrollView.push(NODE_ANDROID.SCROLL_HORIZONTAL);
            }
            if (node.overflowY) {
                scrollView.push((node.ascend().some(item => item.overflow !== OVERFLOW_ELEMENT.NONE) ? NODE_ANDROID.SCROLL_NESTED : NODE_ANDROID.SCROLL_VERTICAL));
            }
            let current = node;
            let scrollDepth = parent.renderDepth + scrollView.length;
            scrollView
                .map(nodeName => {
                    const container = new View(this.cache.nextId, SETTINGS.targetAPI, node.element) as T;
                    container.setBounds();
                    container.setNodeId(nodeName);
                    this.cache.append(container);
                    switch (nodeName) {
                        case NODE_ANDROID.SCROLL_HORIZONTAL:
                            container.css({
                                width: node.styleMap.width,
                                minWidth: node.styleMap.minWidth,
                                maxWidth: node.styleMap.maxWidth,
                                overflowX: node.css('overflowX')
                            });
                            break;
                        default:
                            container.css({
                                height: node.styleMap.height,
                                minHeight: node.styleMap.minHeight,
                                maxHeight: node.styleMap.maxHeight,
                                overflowY: node.css('overflowY')
                            });
                            break;
                    }
                    const indent = repeat(scrollDepth--);
                    preXml = indent + `<${nodeName}{@${container.id}}>\n` + preXml;
                    postXml += indent + `</${nodeName}>\n`;
                    if (current === node) {
                        node.parent = container;
                        renderParent = container;
                    }
                    current = container;
                    return container;
                })
                .reverse()
                .forEach((item, index) => {
                    switch (index) {
                        case 0:
                            item.parent = parent;
                            item.render(parent);
                            break;
                        case 1:
                            item.android('fadeScrollbars', 'false');
                            item.parent = current;
                            item.render(current);
                            item.excludeResource |= NODE_RESOURCE.ALL;
                            node.android('layout_width', 'wrap_content');
                            node.android('layout_height', 'wrap_content');
                            break;
                    }
                    current = item;
                });
            node.excludeResource |= NODE_RESOURCE.BOX_STYLE | NODE_RESOURCE.BOX_SPACING;
        }
        node.apply(options);
        node.render((target ? node : renderParent));
        return this.getEnclosingTag((target || parent.isSet('dataset', 'target') || (node.renderDepth === 0 && !node.documentRoot) ? -1 : node.renderDepth), viewName, node.id, `{:${node.id}}`, preXml, postXml);
    }

    public renderNode(node: T, parent: T, tagName: number | string, recursive = false) {
        const target = (node.isSet('dataset', 'target') && !node.isSet('dataset', 'include'));
        if (typeof tagName === 'number') {
            tagName = View.getNodeName(tagName);
        }
        node.setNodeId(tagName);
        switch (node.element.tagName) {
            case 'IMG': {
                if (!recursive) {
                    const element = <HTMLImageElement> node.element;
                    let width = node.toInt('width');
                    let height = node.toInt('height');
                    const top = node.toInt('top');
                    const left = node.toInt('left');
                    let scaleType = '';
                    if (isPercent(node.css('width')) || isPercent(node.css('height'))) {
                        scaleType = 'fitXY';
                    }
                    else {
                        if (width === 0) {
                            const match = /width="([0-9]+)"/.exec(element.outerHTML);
                            if (match) {
                                width = parseInt(match[1]);
                                node.css('width', formatPX(match[1]));
                            }
                        }
                        if (height === 0) {
                            const match = /height="([0-9]+)"/.exec(element.outerHTML);
                            if (match) {
                                height = parseInt(match[1]);
                                node.css('height', formatPX(match[1]));
                            }
                        }
                        switch (node.css('objectFit')) {
                            case 'contain':
                                scaleType = 'centerInside';
                                break;
                            case 'cover':
                                scaleType = 'centerCrop';
                                break;
                            case 'scale-down':
                                scaleType = 'fitCenter';
                                break;
                            case 'none':
                                scaleType = 'matrix';
                                break;
                            default:
                                scaleType = 'fitXY';
                                break;
                        }
                    }
                    if (scaleType !== '') {
                        node.android('scaleType', scaleType);
                    }
                    if ((width > 0 && height === 0) || (width === 0 && height > 0)) {
                        node.android('adjustViewBounds', 'true');
                    }
                    if (top < 0 || left < 0) {
                        const container = new View(this.cache.nextId, SETTINGS.targetAPI, node.element) as T;
                        container.excludeProcedure |= NODE_PROCEDURE.ALL;
                        container.excludeResource |= NODE_RESOURCE.ALL;
                        container.android('layout_width', (width > 0 ? formatPX(width) : 'wrap_content'));
                        container.android('layout_height', (height > 0 ? formatPX(height) : 'wrap_content'));
                        container.setBounds();
                        container.setNodeId(NODE_ANDROID.FRAME);
                        container.render(parent);
                        if (left < 0) {
                            node.modifyBox(BOX_STANDARD.MARGIN_LEFT, node.marginLeft + left);
                        }
                        if (top < 0) {
                            node.modifyBox(BOX_STANDARD.MARGIN_TOP, node.marginTop + top);
                        }
                        node.parent = container;
                        this.cache.append(container);
                        return this.getEnclosingTag(container.renderDepth, NODE_ANDROID.FRAME, container.id, this.renderNode(node, container, tagName, true));
                    }
                }
                break;
            }
            case 'TEXTAREA': {
                const element = <HTMLTextAreaElement> node.element;
                node.android('minLines', '2');
                if (element.rows > 2) {
                    node.android('maxLines', element.rows.toString());
                }
                if (element.maxLength > 0) {
                    node.android('maxLength', element.maxLength.toString());
                }
                if (node.viewWidth === 0) {
                    const cols = convertInt(element.cols);
                    if (cols > 0) {
                        node.css('width', formatPX(cols * 10));
                    }
                }
                node.android('hint', element.placeholder);
                node.android('scrollbars', AXIS_ANDROID.VERTICAL);
                node.android('inputType', 'textMultiLine');
                if (node.overflowX) {
                    node.android('scrollHorizontally', 'true');
                }
                break;
            }
            case 'INPUT': {
                const element = <HTMLInputElement> node.element;
                switch (element.type) {
                    case 'radio':
                        if (!recursive) {
                            const result = parent.children.filter(item => (<HTMLInputElement> item.element).type === 'radio' && (<HTMLInputElement> item.element).name === element.name) as T[];
                            let xml = '';
                            if (result.length > 1) {
                                const linearX = NodeList.linearX(result);
                                const group = this.createGroup(node, (linearX ? sortAsc(result, 'linear.left') : result), parent);
                                group.setNodeId(NODE_ANDROID.RADIO_GROUP);
                                group.render(parent);
                                let checked: string = '';
                                for (const item of group.children) {
                                    if ((<HTMLInputElement> item.element).checked) {
                                        checked = item.stringId;
                                    }
                                    xml += this.renderNode(<T> item, group, NODE_STANDARD.RADIO, true);
                                }
                                group.android('orientation', linearX ? AXIS_ANDROID.HORIZONTAL : AXIS_ANDROID.VERTICAL);
                                group.alignmentType |= (linearX ? NODE_ALIGNMENT.HORIZONTAL : NODE_ALIGNMENT.VERTICAL) | NODE_ALIGNMENT.SEGMENTED;
                                if (checked !== '') {
                                    group.android('checkedButton', checked);
                                }
                                return this.getEnclosingTag(group.renderDepth, NODE_ANDROID.RADIO_GROUP, group.id, xml);
                            }
                        }
                        break;
                    case 'password':
                        node.android('inputType', 'textPassword');
                        break;
                    case 'text':
                        node.android('inputType', 'text');
                        break;
                    case 'range':
                        if (hasValue(element.min)) {
                            node.android('min', element.min);
                        }
                        if (hasValue(element.max)) {
                            node.android('max', element.max);
                        }
                        if (hasValue(element.value)) {
                            node.android('progess', element.value);
                        }
                        break;
                }
                switch (element.type) {
                    case 'text':
                    case 'search':
                    case 'tel':
                    case 'url':
                    case 'email':
                    case 'password':
                        if (node.viewWidth === 0) {
                            const size = convertInt(element.size);
                            if (size > 0) {
                                node.css('width', formatPX(size * 10));
                            }
                        }
                        break;
                }
                break;
            }
        }
        switch (node.nodeName) {
            case NODE_ANDROID.TEXT:
                if (node.overflow !== OVERFLOW_ELEMENT.NONE) {
                    const scrollbars: string[] = [];
                    if (node.overflowX) {
                        scrollbars.push(AXIS_ANDROID.HORIZONTAL);
                    }
                    if (node.overflowY) {
                        scrollbars.push(AXIS_ANDROID.VERTICAL);
                    }
                    node.android('scrollbars', scrollbars.join('|'));
                }
                break;
            case NODE_ANDROID.LINE:
                if (node.viewHeight === 0) {
                    node.android('layout_height', formatPX((node.borderTopWidth + node.borderBottomWidth + node.paddingTop + node.paddingBottom) || 1));
                }
                break;
        }
        node.cascade().forEach(item => item.hide());
        node.render((target ? node : parent));
        if (!includesEnum(node.excludeProcedure, NODE_PROCEDURE.ACCESSIBILITY)) {
            node.setAccessibility();
        }
        return this.getEnclosingTag((target || parent.isSet('dataset', 'target') || (node.renderDepth === 0 && !node.documentRoot) ? -1 : node.renderDepth), node.nodeName, node.id);
    }

    public renderNodeStatic(tagName: number | string, depth: number, options: ObjectMap<any> = {}, width = '', height = '', node?: T, children?: boolean) {
        if (node == null) {
            node = new View(0, SETTINGS.targetAPI) as T;
        }
        const renderDepth = Math.max(0, depth);
        const viewName = (typeof tagName === 'number' ? View.getNodeName(tagName) : tagName);
        tagName = (node.hasElement ? node.tagName : viewName);
        switch (viewName) {
            case 'include':
            case 'merge':
            case 'menu':
                break;
            default:
                node.setNodeId(viewName);
                break;
        }
        if (hasValue(width)) {
            if (!isNaN(parseInt(width))) {
                width = delimitDimens(tagName, 'width', width);
            }
            node.android('layout_width', width);
        }
        if (hasValue(height)) {
            if (!isNaN(parseInt(height))) {
                height = delimitDimens(tagName, 'height', height);
            }
            node.android('layout_height', height);
        }
        node.renderDepth = renderDepth;
        if (options != null) {
            node.apply(formatResource(options));
        }
        let output = this.getEnclosingTag((depth === 0 && !node.documentRoot ? -1 : depth), viewName, node.id, (children ? `{:${node.id}}` : ''));
        if (SETTINGS.showAttributes && node.id === 0) {
            const indent = repeat(renderDepth + 1);
            const attrs = node.combine().map(value => `\n${indent + value}`).join('');
            output = output.replace(`{@${node.id}}`, attrs);
        }
        options.stringId = node.stringId;
        return output;
    }

    public renderInclude(node: T, parent: T, name: string) {
        this._merge[name] = (node.dataset.includeMerge === 'true');
        node.documentRoot = !this._merge[name];
        return this.renderNodeStatic('include', parent.renderDepth + 1, { layout: `@layout/${name}` });
    }

    public renderMerge(name: string, value: string[]) {
        let xml = value.join('');
        if (this._merge[name]) {
            const node = new View(0, 0);
            node.documentRoot = true;
            xml = this.renderNodeStatic('merge', 0, {}, '', '', <T> node, true).replace('{:0}', xml);
        }
        return xml;
    }

    public baseRenderDepth(name: string) {
        return (this._merge[name] ? 0 : -1);
    }

    public createGroup(node: T, children?: T[], parent?: T, element?: HTMLElement): T {
        const group = <View> new ViewGroup(this.cache.nextId, node, parent, children, element) as T;
        if (children != null) {
            children.forEach(item => item.inherit(group, 'data'));
        }
        this.cache.append(group);
        return group;
    }

    public setAttributes(data: ViewData<NodeList<T>>) {
        const cache: StringMap[] = data.cache.visible.list.map(node => ({ pattern: `{@${node.id}}`, attributes: this.parseAttributes(node) }));
        [...data.views, ...data.includes].forEach(value => {
            cache.forEach(item => value.content = value.content.replace(item.pattern, item.attributes));
            value.content = value.content.replace(`{#0}`, this.getRootNamespace(value.content));
        });
    }

    public insertAttributes(output: string, node: T) {
        return output.replace(`{@${node.id}}`, this.parseAttributes(node));
    }

    public setDimensions(data: ViewData<NodeList<T>>) {
        function addToGroup(tagName: string, node: T, dimen: string, attr?: string, value?: string) {
            const group: ObjectMap<T[]> = groups[tagName];
            let name = dimen;
            if (arguments.length === 5) {
                if (value && /(px|dp|sp)$/.test(value)) {
                    name = `${dimen},${attr},${value}`;
                }
                else {
                    return;
                }
            }
            if (group[name] == null) {
                group[name] = [];
            }
            group[name].push(node);
        }
        const groups = {};
        for (const node of data.cache.visible) {
            node.mergeBoxSpacing();
            if (SETTINGS.dimensResourceValue) {
                const tagName = node.tagName.toLowerCase();
                if (groups[tagName] == null) {
                    groups[tagName] = {};
                }
                for (const key of Object.keys(BOX_STANDARD)) {
                    const result = node.boxValue(parseInt(key));
                    if (result[0] !== '' && result[1] !== '0px') {
                        const name = `${BOX_STANDARD[key].toLowerCase()},${result[0]},${result[1]}`;
                        addToGroup(tagName, node, name);
                    }
                }
                ['android:layout_width:width',
                 'android:layout_height:height',
                 'android:minWidth:minwidth',
                 'android:minHeight:minheight',
                 'app:layout_constraintWidth_min:constraintwidth_min',
                 'app:layout_constraintHeight_min:constraintheight_min'].forEach(value => {
                    const [obj, attr, dimen] = value.split(':');
                    addToGroup(tagName, node, dimen, attr, node[obj](attr));
                });
            }
        }
        if (SETTINGS.dimensResourceValue) {
            const resource = <Map<string, string>> Resource.STORED.DIMENS;
            for (const tagName in groups) {
                const group: ObjectMap<T[]> = groups[tagName];
                for (const name in group) {
                    const [dimen, attr, value] = name.split(',');
                    const key = this.getDimenResourceKey(resource, `${tagName}_${parseRTL(dimen)}`, value);
                    group[name].forEach(node => node[(attr.indexOf('constraint') !== -1 ? 'app' : 'android')](attr, `@dimen/${key}`));
                    resource.set(key, value);
                }
            }
        }
    }

    public parseDimensions(content: string) {
        const resource = <Map<string, string>> Resource.STORED.DIMENS;
        const pattern = /\s+\w+:\w+="({%(\w+),(\w+),(-?\w+)})"/g;
        let match: Null<RegExpExecArray>;
        while ((match = pattern.exec(content)) != null) {
            const key = this.getDimenResourceKey(resource, `${match[2]}_${parseRTL(match[3])}`, match[4]);
            resource.set(key, match[4]);
            content = content.replace(new RegExp(match[1], 'g'), `@dimen/${key}`);
        }
        return content;
    }

    public addXmlNs(name: string, uri: string) {
        XMLNS_ANDROID[name] = uri;
    }

    private parseAttributes(node: T) {
        if (node.dir === 'rtl') {
            switch (node.nodeName) {
                case NODE_ANDROID.RADIO:
                case NODE_ANDROID.CHECKBOX:
                    node.android('layoutDirection', 'rtl');
                    break;
                default:
                    if (node.renderChildren.length === 0) {
                        node.android('textDirection', 'rtl');
                    }
                    break;
            }
        }
        for (const name in node.dataset) {
            if (/^attr[A-Z]+/.test(name)) {
                const obj = capitalize(name.substring(4), false);
                (node.dataset[name] as string).split(';').forEach(values => {
                    const [key, value] = values.split('::');
                    if (hasValue(key) && hasValue(value)) {
                        node.add(obj, key, value);
                    }
                });
            }
        }
        const indent = repeat(node.renderDepth + 1);
        return node.combine().map(value => `\n${indent + value}`).join('');
    }

    private getRootNamespace(content: string) {
        let output = '';
        for (const namespace in XMLNS_ANDROID) {
            if (new RegExp(`\\s+${namespace}:`).test(content)) {
                output += `\n\txmlns:${namespace}="${XMLNS_ANDROID[namespace]}"`;
            }
        }
        return output;
    }

    private getDimenResourceKey(resource: Map<string, string>, key: string, value: string) {
        if (resource.has(key) && resource.get(key) !== value) {
            key = generateId('dimens', `${key}_1`);
        }
        return key;
    }

    private setAlignParent(node: T, orientation = '', bias = false) {
        const map = MAP_LAYOUT.constraint;
        [AXIS_ANDROID.HORIZONTAL, AXIS_ANDROID.VERTICAL].forEach((value, index) => {
            if (!node.constraint[value] && (orientation === '' || value === orientation)) {
                node.app(map[(index === 0 ? 'left' : 'top')], 'parent');
                node.app(map[(index === 0 ? 'right' : 'bottom')], 'parent');
                node.constraint[value] = true;
                if (bias) {
                    node.app(`layout_constraint${value.charAt(0).toUpperCase() + value.substring(1)}_bias`, node[`${value}Bias`]);
                }
            }
        });
    }

    private partitionChain(node: T, nodes: NodeList<T>, orientation: string) {
        const map = MAP_LAYOUT.constraint;
        const mapParent: string[] = [];
        const coordinate: string[] = [];
        const connected: string[] = [];
        switch (orientation) {
            case AXIS_ANDROID.HORIZONTAL:
                mapParent.push(map['left'], map['right']);
                coordinate.push('linear.top', 'linear.bottom');
                connected.push(map['leftRight'], map['rightLeft']);
                break;
            case AXIS_ANDROID.VERTICAL:
                mapParent.push(map['top'], map['bottom']);
                coordinate.push('linear.left', 'linear.right');
                connected.push(map['topBottom'], map['bottomTop']);
                break;
        }
        const result = coordinate.map(value => {
            const sameXY = sortAsc(nodes.list.filter(item => same(node, item, value)), coordinate[0]);
            if (sameXY.length > 1) {
                const parent = node.documentParent;
                if (orientation === AXIS_ANDROID.HORIZONTAL && parent.toInt('columnCount') === sameXY.length) {
                    const marginLeft = convertInt(convertPX(parent.css('columnGap')));
                    if (marginLeft > 0) {
                        for (let i = 1; i < sameXY.length; i++) {
                            sameXY[i].android(`layout_${parseRTL('marginLeft')}`, formatPX(sameXY[i].marginLeft + marginLeft));
                        }
                    }
                    return sameXY;
                }
                else if (!sameXY.some(item => item.floating) && sameXY[0].app(mapParent[0]) === 'parent' && sameXY[sameXY.length - 1].app(mapParent[1]) === 'parent') {
                    return sameXY;
                }
                else {
                    let valid;
                    const chained: Set<T> = new Set([node]);
                    do {
                        valid = false;
                        Array.from(chained).some(item => {
                            return sameXY.some(adjacent => {
                                if (!chained.has(adjacent) && (adjacent.app(connected[0]) === item.stringId || adjacent.app(connected[1]) === item.stringId)) {
                                    chained.add(adjacent);
                                    valid = true;
                                }
                                return valid;
                            });
                        });
                    }
                    while (valid);
                    return Array.from(chained);
                }
            }
            return [];
        }).reduce((a, b) => a.length >= b.length ? a : b);
        return result;
    }

    private addGuideline(node: T, orientation = '', percent?: boolean, opposite?: boolean) {
        const map = MAP_LAYOUT.constraint;
        if (node.pageflow) {
            if (opposite == null) {
                opposite = (node.float === 'right' || (node.left == null && node.right != null) || (node.is(NODE_STANDARD.TEXT) && node.css('textAlign') === 'right') || node.app(MAP_LAYOUT.constraint['right']) === 'parent');
            }
            if (percent == null && opposite === true) {
                percent = true;
            }
        }
        if (node.dataset.constraintPercent != null) {
            percent = (node.dataset.constraintPercent === 'true');
        }
        const beginPercent = `layout_constraintGuide_${(percent ? 'percent' : 'begin')}`;
        const parent = node.documentParent;
        [AXIS_ANDROID.HORIZONTAL, AXIS_ANDROID.VERTICAL].forEach((value, index) => {
            if (!node.constraint[value] && (orientation === '' || value === orientation)) {
                let LT = '';
                let RB = '';
                let LTRB = '';
                let RBLT = '';
                let found = false;
                switch (index) {
                    case 0:
                        LT = (!opposite ? 'left' : 'right');
                        RB = (!opposite ? 'right' : 'left');
                        LTRB = (!opposite ? 'leftRight' : 'rightLeft');
                        RBLT = (!opposite ? 'rightLeft' : 'leftRight');
                        break;
                    case 1:
                        LT = (!opposite ? 'top' : 'bottom');
                        RB = (!opposite ? 'bottom' : 'top');
                        LTRB = (!opposite ? 'topBottom' : 'bottomTop');
                        RBLT = (!opposite ? 'bottomTop' : 'topBottom');
                        break;
                }
                const dimension = (node.pageflow ? 'bounds' : 'linear');
                const position = (percent ? Math.abs(node[dimension][LT] - (parent.documentBody ? 0 : parent.box[LT])) / parent.box[(index === 0 ? 'width' : 'height')] : 0);
                if (!percent) {
                    found = parent.renderChildren.some(item => {
                        if (item.constraint[value] && (!item.constraint[`chain${capitalize(value)}`] || item.constraint[`margin${capitalize(value)}`] != null)) {
                            if (withinFraction(node.linear[LT], item.linear[RB])) {
                                node.anchor(map[LTRB], item.stringId, value, true);
                                return true;
                            }
                            else if (withinFraction(node.linear[RB], item.linear[LT])) {
                                node.anchor(map[RBLT], item.stringId, value, true);
                                return true;
                            }
                            if (withinFraction(node.bounds[LT], item.bounds[LT])) {
                                node.anchor(map[(index === 1 && node.is(NODE_STANDARD.TEXT) && node.viewHeight === 0 && item.is(NODE_STANDARD.TEXT) && item.viewHeight === 0 ? 'baseline' : LT)], item.stringId, value, true);
                                return true;
                            }
                            else if (withinFraction(node.bounds[RB], item.bounds[RB])) {
                                node.anchor(map[RB], item.stringId, value, true);
                                return true;
                            }
                        }
                        return false;
                    });
                }
                if (!found) {
                    const guideline = parent.constraint.guideline || {};
                    const location = (percent ? parseFloat(Math.abs(position - (!opposite ? 0 : 1)).toFixed(SETTINGS.constraintPercentAccuracy)) : formatPX(Math.max(0, (!opposite ? node[dimension][LT] - (parent.documentBody ? 0 : parent.box[LT]) : node[dimension][LT] - parent.box[RB]))));
                    if (location === 0 || location === '0px') {
                        node.anchor(map[LT], 'parent', value, true);
                    }
                    else {
                        const options = {
                            android: {
                                orientation: (index === 0 ? AXIS_ANDROID.VERTICAL : AXIS_ANDROID.HORIZONTAL)
                            },
                            app: {
                                [beginPercent]: location
                            }
                        };
                        const anchors: {} = optional(guideline, `${value}.${beginPercent}.${LT}`, 'object');
                        if (anchors) {
                            for (const stringId in anchors) {
                                if (anchors[stringId] === location) {
                                    node.anchor(map[LT], stringId, value, true);
                                    node.delete('app', map[RB]);
                                    found = true;
                                    break;
                                }
                            }
                        }
                        if (!found) {
                            if (!percent) {
                                options.app[beginPercent] = delimitDimens(node.tagName, 'constraintguide_begin', <string> location);
                            }
                            const xml = this.renderNodeStatic(NODE_ANDROID.GUIDELINE, node.renderDepth, options, 'wrap_content', 'wrap_content');
                            const stringId = (<any> options).stringId;
                            this.appendAfter(node.id, xml);
                            node.anchor(map[LT], stringId, value, true);
                            node.delete('app', map[RB]);
                            node.constraint[`${value}Guideline`] = stringId;
                            if (guideline[value] == null) {
                                guideline[value] = {};
                            }
                            if (guideline[value][beginPercent] == null) {
                                guideline[value][beginPercent] = {};
                            }
                            if (guideline[value][beginPercent][LT] == null) {
                                guideline[value][beginPercent][LT] = {};
                            }
                            guideline[value][beginPercent][LT][stringId] = location;
                            parent.constraint.guideline = guideline;
                        }
                    }
                }
            }
        });
    }

    private adjustLineHeight(nodes: T[], parent: T) {
        const lineHeight = Math.max.apply(null, nodes.map(node => node.toInt('lineHeight')));
        if (lineHeight > 0) {
            let minHeight = Number.MAX_VALUE;
            let offsetTop = 0;
            const valid = nodes.every(node => {
                const offset = lineHeight - node.bounds.height;
                if (offset > 0) {
                    minHeight = Math.min(offset, minHeight);
                    if (lineHeight === node.toInt('lineHeight')) {
                        offsetTop = Math.max((node.toInt('top') < 0 ? Math.abs(node.toInt('top')) : 0), offsetTop);
                    }
                    return true;
                }
                return false;
            });
            if (valid) {
                parent.modifyBox(BOX_STANDARD.PADDING_TOP, parent.paddingTop + Math.ceil(minHeight / 2));
                parent.modifyBox(BOX_STANDARD.PADDING_BOTTOM, parent.paddingBottom + Math.floor(minHeight / 2) + offsetTop);
            }
        }
    }

    private findByStringId(id: string) {
        return this.cache.locate('stringId', id);
    }

    get supportInline() {
        return WEBVIEW_ANDROID;
    }

    get supportInclude() {
        return true;
    }
}
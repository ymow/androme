const SETTINGS = {
    density: DENSITY_ANDROID.MDPI,
    showAttributes: true,
    useConstraintLayout: true,
    useConstraintChain: true,
    useGridLayout: true,
    useLayoutWeight: true,
    useUnitDP: true,
    useRTL: false,
    boundsOffset: 2,
    whitespaceHorizontalOffset: 4,
    whitespaceVerticalOffset: 14,
    constraintBiasBoxOffset: 14,
    chainPackedHorizontalOffset: 4,
    chainPackedVerticalOffset: 14
};

const NODE_CACHE = [];

const RESOURCE = {
    string: new Map(),
    array: new Map(),
    color: new Map(),
    image: new Map(),
    drawable: new Map(),
    style: new Map()
};

function writeResourceStringXml() {
    const resource = new Map([...RESOURCE['string'].entries()].sort());
    const xml = [STRING_ANDROID.XML_DECLARATION,
                 '<resources>'];
    for (const [name, value] of resource.entries()) {
        xml.push(`\t<string name="${name}">${value}</string>`);
    }
    xml.push('</resources>',
             '<!-- filename: res/values/string.xml -->\n');
    return xml.join('\n');
}

function writeResourceArrayXml() {
    const resource = new Map([...RESOURCE['array'].entries()].sort());
    const xml = [STRING_ANDROID.XML_DECLARATION,
                 '<resources>'];
    for (const [name, values] of resource.entries()) {
        xml.push(`\t<array name="${name}">`);
        for (const [name, value] of values.entries()) {
            xml.push(`\t\t<item${(value != '' ? ` name="${name}">@string/${value}` : `>${name}`)}</item>`);
        }
        xml.push('\t</array>');
    }
    xml.push('</resources>',
             '<!-- filename: res/values/string_array.xml -->\n');
    return xml.join('\n');
}

function writeResourceStyleXml() {
    let xml = [STRING_ANDROID.XML_DECLARATION,
                 '<resources>'];
    for (const tag of RESOURCE['style'].values()) {
        for (const style of tag) {
            xml.push(`\t<style name="${style.name}">`);
            style.attributes.split(';').forEach(value => {
                const [name, setting] = value.split('=');
                xml.push(`\t\t<item name="${name}">${setting.replace(/"/g, '')}</item>`);
            });
            xml.push('\t<style>');
        }
    }
    xml.push('</resources>',
             '<!-- filename: res/values/styles.xml -->\n');
    xml = xml.join('\n');
    if (SETTINGS.useUnitDP) {
        xml = Utils.insetToDP(xml, true);
    }
    return xml;
}

function writeResourceColorXml() {
    const resource = new Map([...RESOURCE['color'].entries()].sort());
    const xml = [STRING_ANDROID.XML_DECLARATION,
                 '<resources>'];
    for (const [name, value] of resource.entries()) {
        xml.push(`\t<color name="${name}">${value}</color>`);
    }
    xml.push('</resources>',
             '<!-- filename: res/values/colors.xml -->\n');
    return xml.join('\n');
}

function writeResourceDrawableXml() {
    let xml = [];
    for (const [name, value] of RESOURCE['drawable'].entries()) {
        xml.push(value,
                 `<!-- filename: res/drawable/${name}.xml -->\n`);
    }
    if (RESOURCE['image'].size > 0) {
        for (const [name, value] of RESOURCE['image'].entries()) {
            xml.push(`<!-- image: ${value} -->`,
                     `<!-- filename: res/drawable/${name + value.substring(value.lastIndexOf('.'))} -->\n`);
        }
    }
    xml = xml.join('\n');
    if (SETTINGS.useUnitDP) {
        xml = Utils.insetToDP(xml);
    }
    return xml;
}

function addResourceString(node, value) {
    let name = value;
    if (value == null) {
        const element = node.element;
        if (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') {
            name = element.value;
            value = element.value;
        }
        else if (element.nodeName == '#text') {
            name = element.textContent.trim();
            value = name;
        }
        else {
            name = element.innerText;
            value = element.innerHTML;
        }
    }
    if (Utils.hasValue(value)) {
        if (node != null) {
            if (node.isView(WIDGET_ANDROID.TEXT)) {
                const match = (node.style.textDecoration != null ? node.style.textDecoration.match(/(underline|line-through)/) : null);
                if (match != null) {
                    switch (match[0]) {
                        case 'underline':
                            value = `<u>${value}</u>`;
                            break;
                        case 'line-through':
                            value = `<strike>${value}</strike>`;
                            break;
                    }
                }
            }
        }
        value = value.replace(/\s*style=""/g, '');
        for (const [name, resourceValue] in RESOURCE['string'].entries()) {
            if (resourceValue == value) {
                return { text: name };
            }
        }
        name = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().replace(/_+/g, '_').split('_').slice(0, 5).join('_').replace(/_+$/g, '');
        name = insertResourceAsset(RESOURCE['string'], name, value);
        return { text: name };
    }
    return null;
}

function addResourceStringArray(node) {
    const element = node.element
    const stringArray = new Map();
    let integerArray = new Map();
    for (let i = 0; i < element.children.length; i++) {
        const item = element.children[i];
        let value = item.value.trim();
        let text = item.text.trim();
        if (text == '') {
            text = value;
        }
        if (value == '') {
            value = text;
        }
        if (text != '') {
            if (integerArray != null && !stringArray.size && /^\d+$/.test(text) && !/^(^0+)\d+$/.test(text)) {
                integerArray.set(value, '');
            }
            else {
                if (integerArray != null && integerArray.size > 0) {
                    i = -1;
                    stringArray = new Map();
                    integerArray = null;
                    continue;
                }
                stringArray.set(value, addResourceString(null, text).text);
            }
        }
    }
    if (stringArray.size > 0 || integerArray.size > 0) {
        const name = insertResourceAsset(RESOURCE['array'], `${element.androidNode.androidId}_array`, (stringArray.size ? stringArray : integerArray));
        return { entries: name };
    }
    return null;
}

function addResourceColor(value) {
    value = value.toUpperCase().trim();
    if (value != '') {
        let colorName = '';
        if (!RESOURCE['color'].has(value)) {
            const color = Color.findNearestColor(value);
            if (color != null) {
                color.name = Utils.cameltoLowerCase(color.name);
                if (value.toUpperCase().trim() == color.hex) {
                    colorName = color.name;
                }
                else {
                    colorName = Utils.generateId('color', color.name);
                }
            }
            if (colorName != '') {
                RESOURCE['color'].set(value, colorName);
            }
        }
        else {
            colorName = RESOURCE['color'].get(value);
        }
        if (colorName != '') {
            return `@color/${colorName}`;
        }
    }
    return value;
}

function getLTR(ltr, rtl) {
    return (SETTINGS.useRTL ? rtl : ltr);
}

function insertResourceAsset(resource, name, value) {
    let resourceName = null;
    if (Utils.hasValue(value)) {
        let i = 0;
        do {
            resourceName = name;
            if (i > 0) {
                resourceName += i;
            }
            if (!resource.has(resourceName)) {
                resource.set(resourceName, value);
            }
            i++;
        }
        while (resource.has(resourceName) && resource.get(resourceName) != value)
    }
    return resourceName;
}

function setBackgroundStyle(node) {
    const element = node.element;
    const properties = {
        border: parseBorderStyle,
        borderTop: parseBorderStyle,
        borderRight: parseBorderStyle,
        borderBottom: parseBorderStyle,
        borderLeft: parseBorderStyle,
        borderRadius: parseBoxDimensions,
        backgroundColor: Color.parseRGBA
    };
    let backgroundParent = [];
    if (element.parentNode != null) {
        backgroundParent = Color.parseRGBA(Node.getStyle(element.parentNode).backgroundColor);
    }
    const style = Node.getStyle(element);
    for (const i in properties) {
        properties[i] = properties[i](style[i]);
    }
    if (properties.border[0] != 'none' || properties.borderRadius != null) {
        properties.border[2] = addResourceColor(properties.border[2]);
        if (backgroundParent[0] == properties.backgroundColor[0] || properties.backgroundColor[4] == 0) {
            properties.backgroundColor = null;
        }
        else {
            properties.backgroundColor[1] = addResourceColor(properties.backgroundColor[1]);
        }
        const borderStyle = {
            black: 'android:color="@android:color/black"',
            solid: `android:color="${properties.border[2]}"`
        };
        borderStyle.dotted = `${borderStyle.solid} android:dashWidth="3px" android:dashGap="1px"`;
        borderStyle.dashed = `${borderStyle.solid} android:dashWidth="1px" android:dashGap="1px"`;
        borderStyle.default = borderStyle[properties.border[0]] || borderStyle.black;
        let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
        if (properties.border[0] != 'none' && properties.borderRadius != null) {
            xml += `<shape ${STRING_ANDROID.XMLNS_ANDROID} android:shape="rectangle">\n` +
                   `\t<stroke android:width="${properties.border[1]}" ${borderStyle.default} />\n` +
                   (properties.backgroundColor ? `\t<solid android:color="${properties.backgroundColor[1]}" />\n` : '');
            if (properties.borderRadius.length == 1) {
                xml += `\t<corners android:radius="${properties.borderRadius[0]}" />\n`;
            }
            else {
                if (properties.borderRadius.length == 2) {
                    properties.borderRadius.push(...properties.borderRadius.slice());
                }
                xml += '\t<corners';
                properties.borderRadius.forEach((value, index) => xml += ` android:${['topLeft', 'topRight', 'bottomRight', 'bottomLeft'][index]}Radius="${value}"`);
            }
            xml += ' />\n' +
                   '</shape>';
        }
        else if (properties.border[0] != 'none' && properties.backgroundColor == null) {
            xml += `<shape ${STRING_ANDROID.XMLNS_ANDROID} android:shape="rectangle">\n` +
                   `\t<stroke android:width="${properties.border[1]}" ${borderStyle.default} />\n` +
                   '</shape>';
        }
        else {
            xml += `<layer-list ${STRING_ANDROID.XMLNS_ANDROID}>\n`;
            if (properties.backgroundColor != null) {
                xml += '\t<item>\n' +
                       '\t\t<shape android:shape="rectangle">\n' +
                       `\t\t\t<solid android:color="${properties.backgroundColor[1]}" />\n` +
                       '\t\t</shape>\n' +
                       '\t</item>\n';
            }
            if (properties.border[0] != 'none') {
                xml += '\t<item>\n' +
                       '\t\t<shape android:shape="rectangle">\n' +
                       `\t\t\t<stroke android:width="${properties.border[1]}" ${borderStyle.default} />\n` +
                       '\t\t</shape>\n' +
                       '\t</item>\n';
            }
            else {
                [properties.borderTopWidth, properties.borderRightWidth, properties.borderBottomWidth, properties.borderLeftWidth].forEach((item, index) => {
                    xml += `\t<item android:${['top', 'right', 'bottom', 'left'][index]}="${item[2]}">\n` +
                           '\t\t<shape android:shape="rectangle">\n' +
                           `\t\t\t<stroke android:width="${item[1]}" ${borderStyle[item[0]] || borderStyle.black} />\n` +
                           '\t\t</shape>\n' +
                           '\t</item>\n';
                });
            }
            xml += '</layer-list>';
        }
        let drawableName = null;
        for (const [i, j] of RESOURCE['drawable'].entries()) {
            if (j == xml) {
                drawableName = i;
                break;
            }
        }
        if (drawableName == null) {
            drawableName = `${node.tagName.toLowerCase()}_${node.androidId}`;
            RESOURCE['drawable'].set(drawableName, xml);
        }
        node.drawable = drawableName;
        return { backgroundColor: drawableName };
    }
    return null;
}

function setComputedStyle(node) {
    return Node.getStyle(node.element);
}

function setBoxSpacing(node) {
    const result = getBoxSpacing(node);
    for (const i in result) {
        result[i] += 'px';
    }
    return result;
}

function getBoxSpacing(node, complete) {
    const result = {};
    ['padding', 'margin'].forEach(border => {
        ['Top', 'Left', 'Right', 'Bottom'].forEach(side => {
            const property = border + side;
            const value = Utils.parseInt(node.css(property));
            if (complete || value != 0) {
                result[property] = value;
            }
        });
    });
    return result;
}

function parseBorderStyle(value) {
    let stroke = value.match(/(none|dotted|dashed|solid)/);
    let width = value.match(/([0-9\.]+(?:px|pt|em))/);
    let color = Color.parseRGBA(value);
    if (stroke != null) {
        stroke = stroke[1];
    }
    if (width != null) {
        width = Utils.convertToPX(width[1]);
    }
    if (color != null) {
        color = color[1];
    }
    return [stroke || 'solid', width || '1px', color || '#000'];
}

function parseBoxDimensions(value) {
    const match = value.match(/^([0-9]+(?:px|pt|em)) ([0-9]+(?:px|pt|em)) ([0-9]+(?:px|pt|em)) ([0-9]+(?:px|pt|em))$/);
    if (match != null && match.length == 5) {
        if (match[1] == match[2] && match[2] == match[3] && match[3] == match[4]) {
            return [Utils.convertToPX(match[1])];
        }
        else if (match[1] == match[3] && match[2] == match[4]) {
            return [Utils.convertToPX(match[1]), Utils.convertToPX(match[2])];
        }
        else {
            return [Utils.convertToPX(match[1]), Utils.convertToPX(match[2]), Utils.convertToPX(match[3]), Utils.convertToPX(match[4])];
        }
    }
    return null;
}

function writeLinearLayout(node, depth, parent, vertical) {
    node.android('orientation', (vertical ? 'vertical' : 'horizontal'));
    return writeViewLayout(node, depth, parent, WIDGET_ANDROID.LINEAR);
}

function writeRelativeLayout(node, depth, parent) {
    return writeViewLayout(node, depth, parent, WIDGET_ANDROID.RELATIVE);
}

function writeConstraintLayout(node, depth, parent) {
    return writeViewLayout(node, depth, parent, WIDGET_ANDROID.CONSTRAINT);
}

function writeGridLayout(node, depth, parent, columnCount = 2) {
    node.android('columnCount', columnCount);
    return writeViewLayout(node, depth, parent, WIDGET_ANDROID.GRID);
}

function writeViewLayout(node, depth, parent, tagName) {
    let preXml = '';
    let postXml = '';
    if (node.wrapNode == null) {
        node.setAndroidId(tagName);
    }
    if (node.overflow != 0) {
        const scrollView = [];
        if (node.overflowY) {
            scrollView.push((node.nestedScroll ? WIDGET_ANDROID.SCROLL_NESTED : WIDGET_ANDROID.SCROLL_VERTICAL));
        }
        if (node.overflowX) {
            scrollView.push(WIDGET_ANDROID.SCROLL_HORIZONTAL);
        }
        node.depthIndent += scrollView.length;
        node.children.forEach(item => {
            item.depthIndent += scrollView.length
            item.nestedScroll = true;
        });
        let current = node;
        let scrollDepth = depth + scrollView.length;
        scrollView.forEach((widgetName, index) => {
            const wrapNode = Node.createWrapNode(generateNodeId(), current, parent, [current]);
            wrapNode.setAndroidId(widgetName);
            wrapNode.setBounds();
            wrapNode.setLinearBoxRect();
            wrapNode.setAttributes();
            wrapNode.renderDepth = --scrollDepth;
            wrapNode.renderParent = parent;
            NODE_CACHE.push(wrapNode);
            wrapNode.styleMap.overflow = node.styleMap.overflow;
            if (widgetName == WIDGET_ANDROID.SCROLL_HORIZONTAL) {
                wrapNode.styleMap.width = node.styleMap.width; 
                wrapNode.styleMap.overflowX = node.styleMap.overflowX;
            }
            else {
                wrapNode.styleMap.height = node.styleMap.height;
                wrapNode.styleMap.overflowY = node.styleMap.overflowY;
            }
            let indent = Utils.setIndent(scrollDepth);
            preXml = indent + `<${widgetName}{@${wrapNode.id}}>\n` + preXml;
            postXml += indent + `</${widgetName}>\n`;
            current.renderParent = wrapNode;
            current = wrapNode;
            depth++;
        });
    }
    else {
        node.renderParent = parent;
    }
    node.setAttributes();
    node.renderDepth = depth;
    node.setGravity();
    return getEnclosingTag(depth, tagName, node.id, `{${node.id}}`, getGridSpacing(node, depth), preXml, postXml);
}

function writeViewTag(node, depth, parent, tagName, recursive = false) {
    const element = node.element;
    let preXml = '';
    let postXml = '';
    node.setAndroidId(tagName);
    if (!recursive) {
        switch (element.type) {
            case 'radio':
                const result = NODE_CACHE.filter(item => (item.element.type == 'radio' && item.element.name == element.name && !item.renderParent && ((node.original.depth || node.depth) == (item.original.depth || item.depth))));
                let xml = '';
                if (result.length > 1) {
                    const radioGroup = [];
                    let rowSpan = 1;
                    let columnSpan = 1;
                    let checked = '';
                    const wrapNode = Node.createWrapNode(generateNodeId(), node, parent, result);
                    wrapNode.setAndroidId(WIDGET_ANDROID.RADIO_GROUP);
                    NODE_CACHE.push(wrapNode);
                    for (const item of result) {
                        rowSpan += (Utils.parseInt(item.android('layout_rowSpan')) || 1) - 1;
                        columnSpan += (Utils.parseInt(item.android('layout_columnSpan')) || 1) - 1;
                        if (item != node) {
                            if (item.parent != node.parent) {
                                item.parent = node.parent;
                            }
                        }
                        radioGroup.push(item);
                        item.depthIndent = (depth + 1) - item.depth;
                        if (item.element.checked) {
                            checked = item;
                        }
                        xml += writeViewTag(item, item.depth + item.depthIndent, wrapNode, WIDGET_ANDROID.RADIO, true);
                        wrapNode.inheritGrid(item);
                    }
                    if (rowSpan > 1) {
                        wrapNode.android('layout_rowSpan', rowSpan);
                    }
                    if (columnSpan > 1) {
                        wrapNode.android('layout_columnSpan', columnSpan);
                    }
                    wrapNode.android('orientation', (Node.isLinearXY(radioGroup)[0] ? 'horizontal' : 'vertical'));
                    wrapNode.android('checkedButton', checked.stringId);
                    wrapNode.setBounds();
                    wrapNode.setLinearBoxRect();
                    wrapNode.setAttributes();
                    wrapNode.renderDepth = depth;
                    wrapNode.renderParent = parent;
                    if (parent.isView(WIDGET_ANDROID.LINEAR)) {
                        parent.linearRows.push(wrapNode);
                    }
                    return getEnclosingTag(depth, WIDGET_ANDROID.RADIO_GROUP, wrapNode.id, xml, getGridSpacing(wrapNode, depth));
                }
                break;
            case 'password':
                node.android('inputType', 'textPassword');
                break;
        }
        switch (element.tagName) {
            case 'IMG':
                const image = element.src.substring(element.src.lastIndexOf('/') + 1);
                const format = image.substring(image.lastIndexOf('.') + 1).toLowerCase();
                let src = image.replace(/.\w+$/, '');
                switch (format) {
                    case 'bmp':
                    case 'gif':
                    case 'jpg':
                    case 'png':
                    case 'webp':
                        src = insertResourceAsset(RESOURCE['image'], src, element.src);
                        break;
                    default:
                        src = `(UNSUPPORTED: ${image})`;
                }
                node.androidSrc = src;
                break;
            case 'TEXTAREA':
                node.android('minLines', 2);
                if (element.rows > 2) {
                    node.android('maxLines', element.rows);
                }
                if (element.maxlength != null) {
                    node.android('maxLength', parseInt(element.maxlength));
                }
                node.android('hint', element.placeholder);
                node.android('scrollbars', 'vertical');
                node.android('inputType', 'textMultiLine');
                if (node.styleMap.overflowX == 'scroll') {
                    node.android('scrollHorizontally', 'true');
                }
                break;
        }
        if (node.overflow != 0) {
            let scrollbars = '';
            if (node.overflowX) {
                scrollbars += 'horizontal';
            }
            if (node.overflowY) {
                scrollbars += (scrollbars != '' ? '|' : '') + 'vertical';
            }
            node.android('scrollbars', scrollbars);
        }
    }
    node.setAttributes();
    node.renderDepth = depth;
    node.renderParent = parent;
    node.setGravity();
    node.children.forEach(item => item.hide());
    return getEnclosingTag(depth, node.widgetName, node.id, '', getGridSpacing(node, depth));
}

function writeDefaultLayout(node, depth, parent) {
    if (SETTINGS.useConstraintLayout || node.flex.enabled) {
        return writeConstraintLayout(node, depth, parent);
    }
    else {
        return writeRelativeLayout(node, depth, parent);
    }
}

function getEnclosingTag(depth, tagName, id, content, space = ['', ''], preXml = '', postXml = '') {
    const indent = Utils.setIndent(depth);
    let xml = space[0] +
              preXml;
    if (Utils.hasValue(content)) {
        xml += indent + `<${tagName}{@${id}}>\n` +
                        content +
               indent + `</${tagName}>\n`;
    }
    else {
        xml += indent + `<${tagName}{@${id}} />\n`;
    }
    xml += postXml +
           space[1];
    return xml;
}

function inlineAttributes(output) {
    for (const node of NODE_CACHE) {
        if (node.visible) {
            node.setAndroidDimensions();
        }
        const result = node.combine();
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                if (result[i].startsWith('android:id=')) {
                    result.unshift(...result.splice(i, 1));
                    break;
                }
            }
            const indent = Utils.setIndent(node.renderDepth + 1);
            if (node.renderDepth == 0) {
                if (SETTINGS.useConstraintLayout) {
                    result.unshift(STRING_ANDROID.XMLNS_APP);
                }
                result.unshift(STRING_ANDROID.XMLNS_ANDROID);
            }
            const xml = result.map(value => `\n${indent + value}`).join('').replace('{id}', node.androidId);
            output = output.replace(`{@${node.id}}`, xml);
        }
    }
    return output;
}

function setNodePosition(current, name, adjacent) {
    const value = (adjacent.androidId != 'parent' ? adjacent.stringId : 'parent');
    if (current.renderParent.isView(WIDGET_ANDROID.CONSTRAINT)) {
        current.app(name, value, false);
    }
    else {
        current.android(name, value, false);
    }
}

function positionConstraints() {
    const layoutMap = {
        relative: {
            top: 'layout_alignTop',
            right: getLTR('layout_alignRight', 'layout_alignEnd'),
            bottom: 'layout_alignBottom',
            left: getLTR('layout_alignLeft', 'layout_alignStart'),
            baseline: 'layout_alignBaseline',
            bottomTop: 'layout_above',
            topBottom: 'layout_below',
            rightLeft: getLTR('layout_toLeftOf', 'layout_toStartOf'),
            leftRight: getLTR('layout_toRightOf', 'layout_toEndOf')
        },
        constraint: {
            top: 'layout_constraintTop_toTopOf',
            right: getLTR('layout_constraintRight_toRightOf', 'layout_constraintEnd_toEndOf'),
            bottom: 'layout_constraintBottom_toBottomOf',
            left: getLTR('layout_constraintLeft_toLeftOf', 'layout_constraintStart_toStartOf'),
            baseline: 'layout_constraintBaseline_toBaselineOf',
            bottomTop: 'layout_constraintBottom_toTopOf',
            topBottom: 'layout_constraintTop_toBottomOf',
            rightLeft: getLTR('layout_constraintRight_toLeftOf', 'layout_constraintEnd_toStartOf'),
            leftRight: getLTR('layout_constraintLeft_toRightOf', 'layout_constraintStart_toEndOf')
        }
    };
    for (const node of NODE_CACHE) {
        const relative = node.isView(WIDGET_ANDROID.RELATIVE);
        const constraint = node.isView(WIDGET_ANDROID.CONSTRAINT);
        const layout = layoutMap[(relative ? 'relative' : 'constraint')];
        const flex = node.flex;
        if (relative || constraint || flex.enabled) {
            const nodes = node.renderChildren.filter(item => item.visible);
            if (!flex.enabled) {
                for (const current of nodes) {
                    let parentHorizontal = true;
                    let parentVertical = true;
                    for (const adjacent of nodes) {
                        if (current != adjacent) {
                            if ((Utils.withinRange(current.linear.left, node.box.left, SETTINGS.constraintBiasBoxOffset) && Utils.withinRange(current.linear.right, node.box.right, SETTINGS.constraintBiasBoxOffset)) || current.withinX(adjacent.linear)) {
                                parentHorizontal = false;
                            }
                            if ((Utils.withinRange(current.linear.top, node.box.top, SETTINGS.constraintBiasBoxOffset) && Utils.withinRange(current.linear.bottom, node.box.bottom, SETTINGS.constraintBiasBoxOffset)) || current.withinY(adjacent.linear)) {
                                parentVertical = false;
                            }
                        }
                    }
                    if (parentHorizontal) {
                        const bias = current.horizontalBias;
                        if (bias != 0) {
                            if (constraint) {
                                current.app(layout['left'], 'parent');
                                current.app(layout['right'], 'parent');
                                current.app('layout_constraintHorizontal_bias', bias);
                                current.constraint.layoutHorizontal = true;
                            }
                            else {
                                if (Utils.withinRange(parseFloat(bias), 0.5, 0.02)) {
                                    current.android('layout_centerHorizontal', 'true');
                                }
                            }
                        }
                    }
                    if (parentVertical) {
                        const bias = current.verticalBias;
                        if (bias != 0) {
                            if (constraint) {
                                current.app(layout['top'], 'parent');
                                current.app(layout['bottom'], 'parent');
                                current.app('layout_constraintVertical_bias', bias);
                                current.constraint.layoutVertical = true;
                            }
                            else {
                                if (Utils.withinRange(parseFloat(bias), 0.5, 0.02)) {
                                    current.android('layout_centerVertical', 'true');
                                }
                            }
                        }
                    }
                }
                nodes.unshift(node);
                for (let current of nodes) {
                    for (let adjacent of nodes) {
                        if (current == adjacent || (relative && current == node)) {
                            continue;
                        }
                        else if (relative && adjacent == node) {
                            if (current.linear.top == node.box.top) {
                                current.android('layout_alignParentTop', 'true');
                                current.constraint.layoutVertical = true;
                            }
                            else if (current.linear.bottom == node.box.bottom) {
                                current.android('layout_alignParentBottom', 'true');
                                current.constraint.layoutVertical = true;
                            }
                            if (current.linear.left == node.box.left) {
                                current.android(getLTR('layout_alignParentLeft', 'layout_alignParentStart'), 'true');
                                current.constraint.layoutHorizontal = true;
                            }
                            else if (current.linear.right == node.box.right) {
                                current.android(getLTR('layout_alignParentRight', 'layout_alignParentEnd'), 'true');
                                current.constraint.layoutHorizontal = true;
                            }
                        }
                        else {
                            let baseline = (current.isView(WIDGET_ANDROID.TEXT) && adjacent.isView(WIDGET_ANDROID.TEXT) && current.style.verticalAlign == 'baseline' && adjacent.style.verticalAlign == 'baseline');
                            if (current == node || adjacent == node) {
                                if (current == node) {
                                    current = adjacent;
                                }
                                adjacent = Object.assign({}, node);
                                adjacent.androidId = 'parent';
                                baseline = false;
                            }
                            const withinY = (adjacent.androidId != 'parent' && current.withinY(adjacent.linear));
                            if (current.linear.bottom == adjacent.linear.top) {
                                setNodePosition(current, layout['bottomTop'], adjacent);
                                current.constraint.layoutVertical = true;
                            }
                            else if (current.linear.top == adjacent.linear.bottom) {
                                setNodePosition(current, layout['topBottom'], adjacent);
                                current.constraint.layoutVertical = true;
                            }
                            if (current.linear.top == adjacent.linear.top) {
                                if (baseline) {
                                    setNodePosition(current, layout['baseline'], adjacent);
                                }
                                setNodePosition(current, layout['top'], adjacent);
                                current.constraint.layoutVertical = true;
                            }
                            else if (current.linear.bottom == adjacent.linear.bottom) {
                                setNodePosition(current, layout['bottom'], adjacent);
                                current.constraint.layoutVertical = true;
                            }
                            if (Utils.withinFraction(current.linear.right, adjacent.linear.left) || (withinY && Utils.withinRange(current.linear.right, adjacent.linear.left, SETTINGS.whitespaceHorizontalOffset))) {
                                if (baseline) {
                                    setNodePosition(current, layout['baseline'], adjacent);
                                }
                                setNodePosition(current, layout['rightLeft'], adjacent);
                                current.constraint.layoutHorizontal = true;
                            }
                            else if (Utils.withinFraction(adjacent.linear.right, current.linear.left) || (withinY && Utils.withinRange(current.linear.left, adjacent.linear.right, SETTINGS.whitespaceHorizontalOffset))) {
                                if (baseline) {
                                    setNodePosition(current, layout['baseline'], adjacent);
                                }
                                setNodePosition(current, layout['leftRight'], adjacent);
                                current.constraint.layoutHorizontal = true;
                            }
                            if (current.linear.left == adjacent.linear.left) {
                                setNodePosition(current, layout['left'], adjacent);
                                current.constraint.layoutHorizontal = true;
                            }
                            else if (current.linear.right == adjacent.linear.right) {
                                setNodePosition(current, layout['right'], adjacent);
                                current.constraint.layoutHorizontal = true;
                            }
                        }
                    }
                }
                nodes.shift();
            }
            if (constraint || flex.enabled) {
                if (SETTINGS.useConstraintChain || flex.enabled) {
                    const chainMap = {
                        chain: ['horizontalChain', 'verticalChain'],
                        leftTop: ['left', 'top'],
                        rightBottom: ['right', 'bottom'],
                        rightLeftBottomTop: ['rightLeft', 'bottomTop'],
                        leftRightTopBottom: ['leftRight', 'topBottom'],
                        widthHeight: ['Width', 'Height'],
                        horizontalVertical: ['Horizontal', 'Vertical']
                    };
                    let flexNodes = null;
                    if (flex.enabled) {
                        let horizontalChain = nodes.slice();
                        let verticalChain = nodes.slice();
                        switch (flex.direction) {
                            case 'row-reverse':
                                horizontalChain.reverse();
                            case 'row':
                                verticalChain = null;
                                break;
                            case 'column-reverse':
                                verticalChain.reverse();
                            case 'column':
                                horizontalChain = null;
                                break;
                        }
                        flexNodes = [{ constraint: { horizontalChain, verticalChain }}];
                    }
                    else {
                        nodes.forEach(current => {
                            current.constraint.horizontalChain = nodes.filter(item => current.withinX(item.linear)).sort((a, b) => (a.bounds.x > b.bounds.x ? 1 : -1));
                            current.constraint.verticalChain = nodes.filter(item => current.withinY(item.linear)).sort((a, b) => (a.bounds.y > b.bounds.y ? 1 : -1));
                        });
                    }
                    chainMap.chain.forEach((value, index) => {
                        const chainNodes = flexNodes || nodes.slice().sort((a, b) => (a.constraint[value].length > b.constraint[value].length ? -1 : 1));
                        chainNodes.forEach(current => {
                            const chainDirection = current.constraint[value];
                            if (chainDirection != null && (flex.enabled || (chainDirection.length > 1 && chainDirection.map(item => parseInt((item.constraint[value] || [{ id: 0 }]).map(chain => chain.id).join(''))).reduce((a, b) => (a == b ? a : 0)) > 0))) {
                                const horizontalVertical = chainMap['horizontalVertical'][index];
                                const widthHeight = chainMap['widthHeight'][index];
                                const layoutWidthHeight = `layout_${widthHeight.toLowerCase()}`;
                                const firstNode = chainDirection[0];
                                const lastNode = chainDirection[chainDirection.length - 1];
                                firstNode.app(layout[chainMap['leftTop'][index]], 'parent');
                                lastNode.app(layout[chainMap['rightBottom'][index]], 'parent');
                                let maxOffset = -1;
                                const wrapContent = [];
                                for (let i = 0; i < chainDirection.length; i++) {
                                    const chain = chainDirection[i];
                                    const chainNext = chainDirection[i + 1];
                                    const chainPrev = chainDirection[i - 1];
                                    const chainWidthHeight = chain.styleMap[widthHeight.toLowerCase()];
                                    if (chainNext != null) {
                                        chain.app(layout[chainMap['rightLeftBottomTop'][index]], chainNext.stringId);
                                        maxOffset = Math.max(chainNext.linear[chainMap['leftTop'][index]] - chain.linear[chainMap['rightBottom'][index]], maxOffset);
                                    }
                                    if (chainPrev != null) {
                                        chain.app(layout[chainMap['leftRightTopBottom'][index]], chainPrev.stringId);
                                    }
                                    if (chainWidthHeight == null) {
                                        chain.android(layoutWidthHeight, 'match_constraint');
                                        const min = chain.styleMap[`min${widthHeight}`];
                                        const max = chain.styleMap[`max${widthHeight}`];
                                        if (min != null) {
                                            chain.app(`layout_constraint${widthHeight}_min`, Utils.convertToPX(min));
                                        }
                                        if (max != null) {
                                            chain.app(`layout_constraint${widthHeight}_max`, Utils.convertToPX(max));
                                        }
                                        else {
                                            wrapContent.push(chain);
                                        }
                                    }
                                    if (flex.enabled) {
                                        chain.app(`layout_constraint${horizontalVertical}_weight`, chain.flex.grow);
                                        if (chainWidthHeight == null && chain.flex.grow == 0 && chain.flex.shrink <= 1) {
                                            chain.android(layoutWidthHeight, 'wrap_content');
                                        }
                                        if (chain.flex.shrink == 0) {
                                            chain.app(`layout_constrained${widthHeight}`, 'true');
                                        }
                                        switch (chain.flex.alignSelf) {
                                            case 'flex-start':
                                                chain.android(`layout_gravity`, (index == 0 ? 'top' : getLTR('left', 'start')));
                                                break;
                                            case 'flex-end':
                                                chain.android(`layout_gravity`, (index == 0 ? 'bottom' : getLTR('right', 'end')));
                                                break;
                                            case 'center':
                                                chain.android(`layout_gravity`, (index == 0 ? 'center_vertical' : 'center_horizontal'));
                                                break;
                                            case 'baseline':
                                                chain.android(`layout_gravity`, 'baseline');
                                                break;
                                            case 'stretch':
                                                chain.android(`layout_gravity`, (index == 0 ? 'fill_vertical' : 'fill_horizontal'));
                                                chain.android(`layout_${chainMap['widthHeight'][(index == 0 ? 1 : 0)].toLowerCase()}`, 'match_parent');
                                                break;
                                        }
                                        if (chain.flex.basis != 'auto') {
                                            if (/(100|[1-9][0-9]?)%/.test(chain.flex.basis)) {
                                                chain.app(`layout_constraint${widthHeight}_percent`, parseInt(chain.flex.basis));
                                            }
                                            else {
                                                const width = Utils.convertToPX(chain.flex.basis);
                                                if (width != '0px') {
                                                    chain.app(`layout_constraintWidth_min`, width);
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        chain.constraint[`layout${horizontalVertical}`] = true;
                                    }
                                }
                                const chainStyle = `layout_constraint${horizontalVertical}_chainStyle`;
                                if (flex.enabled) {
                                    if (chainDirection.reduce((a, b) => Math.max(a, b.flex.grow), -1) == 0 && flex.justifyContent != 'normal') {
                                        switch (flex.justifyContent) {
                                            case 'space-between':
                                                firstNode.app(chainStyle, 'chain_spread_inside');
                                                Node.android(wrapContent, layoutWidthHeight, 'wrap_content');
                                                break;
                                            case 'space-around':
                                                node.android('gravity', 'center');
                                            case 'space-evenly':
                                                firstNode.app(chainStyle, 'chain_spread');
                                                const width = node.box[widthHeight.toLowerCase()];
                                                for (let i = 0; i < chainDirection.length; i++) {
                                                    const item = chainDirection[i];
                                                    item.app(`layout_constraint${horizontalVertical}_weight`, 1);
                                                    if (flex.justifyContent == 'space-evenly') {
                                                        if (index == 0) {
                                                            gravity = (i < chainDirection.length - 1 ? getLTR('right', 'end') : getLTR('left', 'end'));
                                                        }
                                                        else {
                                                            gravity = (i < chainDirection.length - 1 ? 'bottom' : 'top');
                                                        }
                                                        item.android('layout_gravity', gravity);
                                                    }
                                                    item.app(layoutWidthHeight, 'match_constraint');
                                                }
                                                break;
                                            default:
                                                let bias = 0.5;
                                                switch (flex.justifyContent) {
                                                    case 'flex-start':
                                                        bias = 0;
                                                        break;
                                                    case 'flex-end':
                                                        bias = 1;
                                                        break;
                                                }
                                                firstNode.app(chainStyle, 'chain_packed');
                                                firstNode.app(`layout_constraint${horizontalVertical}_bias`, bias);
                                                Node.android(wrapContent, layoutWidthHeight, 'wrap_content');
                                        }
                                    }
                                    else {
                                        chainDirection.forEach(item => {
                                            firstNode.app(chainStyle, 'chain_spread');
                                            item.app(`layout_constraint${horizontalVertical}_weight`, item.flex.grow);
                                        });
                                        Node.android(wrapContent, layoutWidthHeight, 'wrap_content');
                                    }
                                }
                                else {
                                    if (Utils.withinFraction(node.box.left, firstNode.linear.left) && Utils.withinFraction(lastNode.linear.right, node.box.right)) {
                                        firstNode.app(chainStyle, 'chain_spread_inside');
                                        Node.android(wrapContent, layoutWidthHeight, 'wrap_content');
                                    }
                                    else if (maxOffset <= SETTINGS[`chainPacked${horizontalVertical}Offset`]) {
                                        firstNode.app(chainStyle, 'chain_packed');
                                        firstNode.app(`layout_constraint${horizontalVertical}_bias`, Node[`get${horizontalVertical}Bias`](node, firstNode, lastNode));
                                        Node.android(wrapContent, layoutWidthHeight, 'wrap_content');
                                    }
                                    else {
                                        let percentTotal = 0;
                                        for (let i = 0; i < chainDirection.length; i++) {
                                            const chain = chainDirection[i];
                                            const chainPrev = chainDirection[i - 1];
                                            let percent = ((chain.linear.right - node.box.left) - (chainPrev != null ? chainPrev.linear.right - node.box.left : 0)) / (node.box.right - node.box.left);
                                            if (chain != lastNode || Utils.withinRange(percent + percentTotal, 1.0, 0.01)) {
                                                chain.android('layout_gravity', getLTR('right', 'end'), !flex.enabled);
                                            }
                                            if (chain == lastNode) {
                                                percent = 1 - percentTotal;
                                            }
                                            chain.app(layoutWidthHeight, 'match_constraint');
                                            chain.app(`layout_constraint${widthHeight}_percent`, percent.toFixed(2));
                                            percentTotal += parseFloat(percent.toFixed(2));
                                        }
                                    }
                                    chainDirection.forEach(item => {
                                        item.constraint.horizontalChain = [];
                                        item.constraint.verticalChain = [];
                                    });
                                }
                            }
                        });
                    });
                }
                if (!flex.enabled) {
                    for (let i = 0; i < nodes.length; i++) {
                        const opposite = nodes[i];
                        if (!opposite.constraint.layoutVertical || !opposite.constraint.layoutHorizontal) {
                            const adjacent = nodes.filter(item => (item != opposite && item.constraint.layoutVertical && item.constraint.layoutHorizontal))[0];
                            if (adjacent != null) {
                                const center1 = opposite.center;
                                const center2 = adjacent.center;
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
                                opposite.app('layout_constraintCircle', adjacent.stringId);
                                opposite.app('layout_constraintCircleRadius', `${radius}px`);
                                opposite.app('layout_constraintCircleAngle', degrees);
                                opposite.delete('app', 'layout_constraintHorizontal_bias');
                                opposite.delete('app', 'layout_constraintVertical_bias');
                            }
                        }
                    }
                }
            }
        }
    }
}

function getGridSpacing(node, depth) {
    let preXml = '';
    let postXml = '';
    if (node.parent.isView(WIDGET_ANDROID.GRID)) {
        const indent = Utils.setIndent(depth);
        let container = node.original.parent;
        if (node.renderId != null) {
            container = container.original.parent;
        }
        const dimensions = getBoxSpacing(container, true);
        if (node.gridFirst) {
            const heightTop = dimensions.paddingTop + dimensions.marginTop;
            if (heightTop > 0) {
                preXml += getSpaceXml(depth, 'match_parent', Utils.convertToPX(heightTop), node.renderParent.gridColumnCount, 1);
            }
        }
        if (node.gridRowStart) {
            const paddingLeft = dimensions.marginLeft + dimensions.paddingLeft;
            if (paddingLeft > 0) {
                node.android('paddingLeft', Utils.convertToPX(paddingLeft));
            }
        }
        if (node.gridRowEnd) {
            const heightBottom =  dimensions.marginBottom + dimensions.paddingBottom + (!node.gridLast ? dimensions.marginTop + dimensions.paddingTop : 0);
            const paddingRight = dimensions.marginRight + dimensions.paddingRight;
            if (heightBottom > 0) {
                postXml += getSpaceXml(depth, 'match_parent', Utils.convertToPX(heightBottom), node.renderParent.gridColumnCount, 1);
            }
            if (paddingRight > 0) {
                node.android('paddingRight', Utils.convertToPX(paddingRight));
            }
        }
    }
    return [preXml, postXml];
}

function getSpaceXml(depth, width, height, columnCount, columnWeight = 0) {
    let indent = Utils.setIndent(depth);
    if (SETTINGS.showAttributes) {
        let xml = Utils.formatString(STRING_ANDROID.SPACE, width, height, columnCount, columnWeight);
        return `${indent + xml.replace(/\n/g, `\n${Utils.setIndent(depth + 1)}`)}\n`;
    }
    return `${indent}<Space />\n`;
}

function deleteStyleAttribute(sorted, attributes, nodeIds) {
    attributes.split(';').forEach(value => {
        for (let i = 0; i < sorted.length; i++) {
            if (sorted[i] != null) {
                let index = -1;
                let key = '';
                for (const j in sorted[i]) {
                    if (j == value) {
                        index = i;
                        key = j;
                        i = sorted.length;
                        break;
                    }
                }
                if (index != -1) {
                    sorted[index][key] = sorted[index][key].filter(value => !nodeIds.includes(value));
                    if (sorted[index][key].length == 0) {
                        delete sorted[index][key];
                    }
                    break;
                }
            }
        }
    });
}

function setStyleMap() {
    for (const styleSheet of document.styleSheets) {
        for (const rule of styleSheet.rules) {
            const elements = document.querySelectorAll(rule.selectorText);
            const attributes = new Set();
            for (const i of rule.styleMap) {
                attributes.add(Utils.hyphenToCamelCase(i[0]));
            }
            for (const element of elements) {
                for (const i of element.style) {
                    attributes.add(Utils.hyphenToCamelCase(i));
                }
                const style = Node.getStyle(element);
                const styleMap = {};
                for (const name of attributes) {
                    if (name.toLowerCase().indexOf('color') != -1) {
                        const color = Color.getColorByName(rule.style[name]);
                        if (color != null) {
                            rule.style[name] = Color.convertColorToRGB(color);
                        }
                    }
                    if (Utils.hasValue(element.style[name])) {
                        styleMap[name] = element.style[name];
                    }
                    else if (style[name] == rule.style[name]) {
                        styleMap[name] = style[name];
                    }
                }
                element.styleMap = styleMap;
            }
        }
    }
}

function parseStyleAttribute(value) {
    const rgb = Color.parseRGBA(value);
    if (rgb != null) {
        const name = addResourceColor(rgb[1]);
        return value.replace(rgb[0], name);
    }
    const match = value.match(/#[A-Z0-9]{6}/);
    if (match != null) {
        const name = addResourceColor(match[0]);
        return value.replace(match[0], name);
    }
    return value;
}

function setResourceStyle() {
    const cache = {};
    const style = {};
    const layout = {};
    for (const node of NODE_CACHE) {
        if (node.visible && node.styleAttributes.length > 0) {
            if (cache[node.tagName] == null) {
                cache[node.tagName] = [];
            }
            cache[node.tagName].push(node);
        }
    }
    for (const tag in cache) {
        const nodes = cache[tag];
        let sorted = Array.from({ length: nodes.reduce((a, b) => Math.max(a, b.styleAttributes.length), 0) }, value => value = {});
        for (const node of nodes) {
            for (let i = 0; i < node.styleAttributes.length; i++) {
                const attr = parseStyleAttribute(node.styleAttributes[i]);
                if (sorted[i][attr] == null) {
                    sorted[i][attr] = [];
                }
                sorted[i][attr].push(node.id);
            }
        }
        style[tag] = {};
        layout[tag] = {};
        do {
            if (sorted.length == 1) {
                for (const attr in sorted[0]) {
                    const value = sorted[0][attr];
                    if (value.length > 2) {
                        style[tag][attr] = value;
                    }
                    else {
                        layout[tag][attr] = value;
                    }
                }
                sorted.length = 0;
            }
            else {
                const styleKey = {};
                const layoutKey = {}
                for (let i = 0; i < sorted.length; i++) {
                    const filtered = {};
                    for (const attr1 in sorted[i]) {
                        if (sorted[i] == null) {
                            continue;
                        }
                        const ids = sorted[i][attr1];
                        let revalidate = false;
                        if (ids == null) {
                            continue;
                        }
                        else if (ids.length == nodes.length) {
                            styleKey[attr1] = ids;
                            sorted[i] = null;
                            revalidate = true;
                        }
                        else if (ids.length == 1) {
                            layoutKey[attr1] = ids;
                            sorted[i] = null;
                            revalidate = true;
                        }
                        if (!revalidate) {
                            const found = {};
                            for (let j = 0; j < sorted.length; j++) {
                                if (i != j) {
                                    for (const attr in sorted[j]) {
                                        const compare = sorted[j][attr];
                                        for (let k = 0; k < ids.length; k++) {
                                            if (compare.includes(ids[k])) {
                                                if (found[attr] == null) {
                                                    found[attr] = [];
                                                }
                                                found[attr].push(ids[k]);
                                            }
                                        }
                                    }
                                }
                            }
                            for (const attr2 in found) {
                                if (found[attr2].length > 1) {
                                    filtered[[attr1, attr2].sort().join(';')] = found[attr2];
                                }
                            }
                        }
                    }
                    const combined = {};
                    const deleteKeys = new Set();
                    for (const attr1 in filtered) {
                        for (const attr2 in filtered) {
                            if (attr1 != attr2 && filtered[attr1].join('') == filtered[attr2].join('')) {
                                const shared = filtered[attr1].join(',');
                                if (combined[shared] != null) {
                                    combined[shared] = new Set([...combined[shared], ...attr2.split(';')]);
                                }
                                else {
                                    combined[shared] = new Set([...attr1.split(';'), ...attr2.split(';')]);
                                }
                                deleteKeys.add(attr1).add(attr2);
                            }
                        }
                    }
                    deleteKeys.forEach(value => delete filtered[value]);
                    for (const attrs in filtered) {
                        deleteStyleAttribute(sorted, attrs, filtered[attrs]);
                        style[tag][attrs] = filtered[attrs];
                    }
                    for (const ids in combined) {
                        const attrs = Array.from(combined[ids]).sort().join(';');
                        const nodeIds = ids.split(',').map(id => parseInt(id));
                        deleteStyleAttribute(sorted, attrs, nodeIds);
                        style[tag][attrs] = nodeIds;
                    }
                }
                const combined = Object.keys(styleKey);
                if (combined.length > 0) {
                    style[tag][combined.join(';')] = styleKey[combined[0]];
                }
                for (const attribute in layoutKey) {
                    layout[tag][attribute] = layoutKey[attribute];
                }
                for (let i = 0; i < sorted.length; i++) {
                    if (sorted[i] != null && Object.keys(sorted[i]).length == 0) {
                        delete sorted[i];
                    }
                }
                sorted = sorted.filter(item => item);
            }
        }
        while (sorted.length > 0)
    }
    const resource = new Map();
    for (const name in style) {
        const tag = style[name];
        const tagData = [];
        for (const attributes in tag) {
            tagData.push({ attributes, ids: tag[attributes]});
        }
        tagData.sort((a, b) => {
            let [c, d] = [a.ids.length, b.ids.length];
            if (c == d) {
                [c, d] = [a.attributes.split(';').length, b.attributes.split(';').length];
            }
            return (c >= d ? -1 : 1);
        });
        tagData.forEach((item, index) => item.name = `${name.charAt(0) + name.substring(1).toLowerCase()}_${(index + 1)}`);
        resource.set(name, tagData);
    }
    for (const node of NODE_CACHE) {
        const tagName = node.tagName;
        if (resource.has(tagName)) {
            const styles = [];
            for (const tag of resource.get(tagName)) {
                if (tag.ids.includes(node.id)) {
                    styles.push(tag.name);
                }
            }
            node.androidStyle = styles.join('.');
            if (node.androidStyle != '') {
                node.attr(`style="@style/${node.androidStyle}"`);
            }
        }
        const tag = layout[tagName];
        if (tag != null) {
            for (const attr in tag) {
                if (tag[attr].includes(node.id)) {
                    node.attr((SETTINGS.useUnitDP ? Utils.insetToDP(attr, true) : attr));
                }
            }
        }
    }
    RESOURCE['style'] = resource;
}

function setMarginPadding() {
    for (const node of NODE_CACHE) {
        if (node.isView(WIDGET_ANDROID.LINEAR) || node.isView(WIDGET_ANDROID.RADIO_GROUP)) {
            const children = NODE_CACHE.filter(item => (item.renderParent == node));
            if (node.android('orientation') == 'vertical') {
                let current = node.box.top + node.paddingTop;
                children.sort((a, b) => (a.linear.top > b.linear.top ? 1 : -1)).forEach(item => {
                    const height = Math.ceil(item.linear.top - current);
                    if (height > 0) {
                        const visible = (item.visible ? item : item.firstChild);
                        if (visible != null) {
                            const marginTop = Utils.parseInt(node.android('layout_marginTop')) + height;
                            visible.android('layout_marginTop', `${marginTop}px`);
                            visible.boxRefit.layout_marginTop = true;
                        }
                    }
                    current = item.linear.bottom;
                });
            }
            else {
                let current = node.box.left + node.paddingLeft;
                children.sort((a, b) => (a.linear.left > b.linear.left ? 1 : -1)).forEach(item => {
                    if (!item.floating) {
                        const width = Math.ceil(item.linear.left - current);
                        if (width > 0) {
                            const visible = (item.visible ? item : item.firstChild);
                            if (visible != null) {
                                const marginLeft = Utils.parseInt(node.android('layout_marginLeft')) + width;
                                visible.android('layout_marginLeft', `${marginLeft}px`);
                                visible.boxRefit.layout_marginLeft = true;
                            }
                        }
                    }
                    current = (item.label || item).linear.right;
                });
            }
        }
        if (!node.visible && node.children.length > 0 && (!node.parent.isView(WIDGET_ANDROID.GRID) || typeof node.renderParent == 'object')) {
            const box = {
                layout_marginTop: Utils.convertToPX(node.marginTop, false),
                layout_marginRight: Utils.convertToPX(node.marginRight, false),
                layout_marginBottom: Utils.convertToPX(node.marginBottom, false),
                layout_marginLeft: Utils.convertToPX(node.marginLeft, false),
                paddingTop: Utils.convertToPX(node.paddingTop, false),
                paddingRight: Utils.convertToPX(node.paddingRight, false),
                paddingBottom: Utils.convertToPX(node.paddingBottom, false),
                paddingLeft: Utils.convertToPX(node.paddingLeft, false)
            };
            const children = node.children.filter(item => (item.visible && (item.original.depth || item.depth) == ((node.original.depth || node.depth) + 1)));
            const nodesOuter = Node.getNodesOuter(children);
            children.forEach(item => {
                const childBox = {
                    layout_marginTop: 0,
                    layout_marginRight: 0,
                    layout_marginBottom: 0,
                    layout_marginLeft: 0,
                    paddingTop: 0,
                    paddingRight: 0,
                    paddingBottom: 0,
                    paddingLeft: 0
                };
                for (const name in childBox) {
                    childBox[name] = Utils.parseInt(item.android(name));
                }
                for (const side in nodesOuter) {
                    if (nodesOuter[side].includes(item)) {
                        for (const name in childBox) {
                            if (name.toLowerCase().indexOf(side) != -1 && !item.boxRefit[name]) {
                                childBox[name] += box[name];
                            }
                        }
                    }
                }
                for (const side in nodesOuter) {
                    if (nodesOuter[side].includes(item)) {
                        switch (side) {
                            case 'top':
                                if (childBox.layout_marginTop > 0) {
                                    item.android('layout_marginTop', `${childBox.layout_marginTop}px`);
                                }
                                if (childBox.paddingTop > 0) {
                                    item.android('paddingTop', `${childBox.paddingTop}px`);
                                }
                                break;
                            case 'right':
                                if (childBox.layout_marginRight > 0) {
                                    item.android('layout_marginRight', `${childBox.layout_marginRight}px`);
                                }
                                if (childBox.paddingRight > 0) {
                                    item.android('paddingRight', `${childBox.paddingRight}px`);
                                }
                                break;
                            case 'bottom':
                                if (childBox.layout_marginBottom > 0) {
                                    item.android('layout_marginBottom', `${childBox.layout_marginBottom}px`);
                                }
                                if (childBox.paddingBottom > 0) {
                                    item.android('paddingBottom', `${childBox.paddingBottom}px`);
                                }
                                break;
                            case 'left':
                                if (childBox.layout_marginLeft > 0) {
                                    item.android('layout_marginLeft', `${childBox.layout_marginLeft}px`);
                                }
                                if (childBox.paddingLeft > 0) {
                                    item.android('paddingLeft', `${childBox.paddingLeft}px`);
                                }
                                break;
                        }
                    }
                }
            });
        }
    }
    mergeMarginPadding();
}

function mergeMarginPadding() {
    for (const node of NODE_CACHE) {
        if (node.visible) {
            const marginTop = Utils.parseInt(node.android('layout_marginTop'));
            const marginRight = Utils.parseInt(node.android('layout_marginRight'));
            const marginBottom = Utils.parseInt(node.android('layout_marginBottom'));
            const marginLeft = Utils.parseInt(node.android('layout_marginLeft'));
            if (marginTop != 0 && marginTop == marginBottom) {
                node.android('layout_marginVertical', `${marginTop}px`);
                node.delete('android', 'layout_marginTop');
                node.delete('android', 'layout_marginBottom');
            }
            if (marginLeft != 0 && marginLeft == marginRight) {
                node.android('layout_marginHorizontal', `${marginLeft}px`);
                node.delete('android', 'layout_marginLeft');
                node.delete('android', 'layout_marginRight');
            }
            const paddingTop = Utils.parseInt(node.android('paddingTop'));
            const paddingRight = Utils.parseInt(node.android('paddingRight'));
            const paddingBottom = Utils.parseInt(node.android('paddingBottom'));
            const paddingLeft = Utils.parseInt(node.android('paddingLeft'));
            if (paddingTop != 0 && paddingTop == paddingBottom) {
                node.android('paddingVertical', `${paddingTop}px`);
                node.delete('android', 'paddingTop');
                node.delete('android', 'paddingBottom');
            }
            if (paddingLeft != 0 && paddingLeft == paddingRight) {
                node.android('paddingHorizontal', `${paddingLeft}px`);
                node.delete('android', 'paddingLeft');
                node.delete('android', 'paddingRight');
            }
        }
    }
}

function setLayoutWeight() {
    for (const node of NODE_CACHE) {
        if (node.linearRows.length > 0) {
            const columnLeft = [];
            const columnRight = [];
            const columnWeight = [];
            const columnOuter = [];
            const borderSpacing = (node.style.borderSpacing != null ? Utils.parseInt(node.style.borderSpacing.split(' ')[0]) : 0);
            for (let i = 0; i < node.linearRows.length; i++) {
                const row = node.linearRows[i];
                const children = row.renderChildren.filter(item => item.visible);
                for (let j = 0; j < children.length; j++) {
                    let column = children[j];
                    if (columnLeft[j] == null) {
                        columnLeft[j] = new Array(node.linearRows.length).fill(null);
                        columnRight[j] = new Array(node.linearRows.length).fill(null);
                    }
                    if (column.renderId != null && column.original.parent != null && !column.original.parent.visible) {
                        column = column.original.parent;
                    }
                    if (row.isHorizontal()) {
                        columnLeft[j][i] = column.bounds.left - (Utils.parseInt(column.android('layout_marginLeft') + borderSpacing));
                        columnRight[j][i] = (column.label != null ? column.label.linear.right : column.bounds.right + (Utils.parseInt(column.android('layout_marginRight') + borderSpacing)));
                        columnOuter[i] = (row.isView(WIDGET_ANDROID.RADIO_GROUP) ? row.box.right : column.parent.box.right);
                    }
                    else {
                        columnLeft[j][i] = column.bounds.top - (Utils.parseInt(column.android('layout_marginTop') + borderSpacing));
                        columnRight[j][i] = column.bounds.bottom + (Utils.parseInt(column.android('layout_marginBottom') + borderSpacing));
                        columnOuter[i] = column.parent.box.bottom;
                    }
                }
            }
            columnLeft.push(columnOuter);
            for (let i = 1; i < columnLeft.length; i++) {
                columnWeight[i - 1] = new Array(columnLeft[i - 1].length).fill(null);
                for (let j = 0; j < columnLeft[i].length; j++) {
                    const left = columnLeft[i][j];
                    const right = columnRight[i - 1][j];
                    if (left != null && right != null) {
                        columnWeight[i - 1][j] = left - right;
                    }
                }
            }
            for (let i = 0; i < node.linearRows.length; i++) {
                const row = node.linearRows[i];
                const children = row.renderChildren.filter(item => item.visible);
                for (let j = 0; j < children.length; j++) {
                    children[j][`layoutWeight${(node.isHorizontal() ? 'Width' : 'Height')}`] = (columnWeight[j][i] != null && columnWeight[j][i] <= SETTINGS[(node.isHorizontal() ? 'whitespaceHorizontalOffset' : 'whitespaceVerticalOffset')] ? 0 : 1);
                }
            }
        }
    }
}

function generateNodeId() {
    return NODE_CACHE.length + 1;
}

function setNodeCache() {
    let nodeTotal = 0;
    document.body.childNodes.forEach(element => {
        if (element.nodeName == '#text') {
            if (element.textContent.trim() != '') {
                nodeTotal++;
            }
        }
        else {
            if (Utils.isVisible(element)) {
                nodeTotal++;
            }   
        }
    });
    let elements = document.querySelectorAll((nodeTotal > 1 ? 'body, body *' : 'body *'));
    for (const i in elements) {
        const element = elements[i];
        if (INLINE_CHROME.includes(element.tagName) && (MAPPING_ANDROID[element.parentNode.tagName] != null || INLINE_CHROME.includes(element.parentNode.tagName))) {
            continue;
        }
        if (Utils.isVisible(element)) {
            const node = new Node(generateNodeId(), element);
            NODE_CACHE.push(node);
        }
    }
    for (const node of NODE_CACHE) {
        switch (node.style.textAlign) {
            case 'center':
            case 'right':
            case 'end':
                node.preAlignment.textAlign = node.style.textAlign;
                node.element.style.textAlign = '';
                break
        }
        node.preAlignment.verticalAlign = node.styleMap.verticalAlign || '';
        node.element.style.verticalAlign = 'top';
        if (node.overflow != 0) {
            if (Utils.hasValue(node.styleMap.width)) {
                node.preAlignment.width = node.styleMap.width;
                node.element.style.width = '';
            }
            if (Utils.hasValue(node.styleMap.height)) {
                node.preAlignment.height = node.styleMap.height;
                node.element.style.height = '';
            }
            node.preAlignment.overflow = node.style.overflow;
            node.element.style.overflow = 'visible';
        }
    }
    const parentNodes = {};
    const textCache = [];
    for (const parent of NODE_CACHE) {
        if (parent.bounds == null) {
            parent.setBounds();
            parent.setLinearBoxRect();
        }
        for (const child of NODE_CACHE) {
            if (parent != child) {
                if (child.bounds == null) {
                    child.setBounds();
                    child.setLinearBoxRect();
                }
                if (child.box.left >= parent.linear.left && child.box.right <= parent.linear.right && child.box.top >= parent.linear.top && child.box.bottom <= parent.linear.bottom) {
                    if (parentNodes[child.id] == null) {
                        parentNodes[child.id] = [];
                    }
                    parentNodes[child.id].push(parent);
                    parent.children.push(child);
                }
            }
        }
    }
    NODE_CACHE.forEach(node => {
        const nodes = parentNodes[node.id];
        if (nodes != null) {
            let parent = node.element.parentNode.androidNode;
            if (!node.withinX(parent.box) && !node.withinY(parent.box)) {
                if (nodes.length > 1) {
                    let minArea = Number.MAX_VALUE;
                    nodes.forEach(item => {
                        const area = (node.box.left - item.linear.left) + (node.box.right - item.linear.right) + (node.box.top - item.linear.top) + (node.box.bottom - item.linear.bottom);
                        if (area < minArea) {
                            parent = item;
                            minArea = area;
                        }
                        else if (area == minArea) {
                            if (item.element == node.element.parentNode) {
                                parent = item;
                            }
                        }
                    });
                    node.parent = parent;
                }
                else {
                    node.parent = nodes[0];
                }
            }
            else {
                node.parent = parent;
            }
        }
        if (node.element.children.length > 1) {
            node.element.childNodes.forEach(element => {
                if (element.nodeName == '#text' && element.textContent.trim() != '') {
                    const textNode = Node.createTextNode(NODE_CACHE.length + textCache.length + 1, element, node, [0, 4]);
                    textCache.push(textNode);
                    node.children.push(textNode);
                }
            });
        }
    });
    NODE_CACHE.push(...textCache);
    for (const node of NODE_CACHE) {
        for (const property in node.preAlignment) {
            node.element.style[property] = node.preAlignment[property];
        }
    }
    NODE_CACHE.sort(Node.orderDefault);
    for (const node of NODE_CACHE) {
        let i = 0;
        Array.from(node.element.childNodes).forEach(item => {
            if (item.androidNode != null && item.androidNode.parent.element == node.element) {
                item.androidNode.parentIndex = i++;
            }
        });
        node.children.sort(Node.orderDefault);
    }
}

function parseDocument() {
    const mapX = [];
    const mapY = [];
    let output = `${STRING_ANDROID.XML_DECLARATION}\n{0}`;
    setStyleMap();
    setNodeCache();
    for (const node of NODE_CACHE) {
        const x = Math.floor(node.bounds.x);
        const y = node.parent.id;
        if (mapX[node.depth] == null) {
            mapX[node.depth] = {};
        }
        if (mapY[node.depth] == null) {
            mapY[node.depth] = {};
        }
        if (mapX[node.depth][x] == null) {
            mapX[node.depth][x] = [];
        }
        if (mapY[node.depth][y] == null) {
            mapY[node.depth][y] = [];
        }
        mapX[node.depth][x].push(node);
        mapY[node.depth][y].push(node);
    }
    for (let i = 0; i < mapY.length; i++) {
        const coordsX = Object.keys(mapX[i]);
        const coordsY = Object.keys(mapY[i]);
        const partial = {};
        for (let j = 0; j < coordsY.length; j++) {
            const axisY = mapY[i][coordsY[j]].sort((a, b) => {
                if (!a.flex.parent.enabled && !b.flex.parent.enabled && a.withinX(b.linear)) {
                    return (a.linear.left > b.linear.left ? 1 : -1);
                }
                return (a.parentIndex > b.parentIndex ? 1 : -1);
            });
            for (let k = 0; k < axisY.length; k++) {
                const nodeY = axisY[k];
                if (!nodeY.renderParent) {
                    const parentId = nodeY.parent.id;
                    let tagName = nodeY.widgetName;
                    let xml = '';
                    if (tagName == null) {
                        if ((nodeY.children.length == 0 && Utils.hasFreeFormText(nodeY.element)) || nodeY.children.every(item => INLINE_CHROME.includes(item.tagName))) {
                            tagName = WIDGET_ANDROID.TEXT;
                        }
                        else if (nodeY.children.length > 0) {
                            const nextDepth = nodeY.children.filter(item => (item.depth == nodeY.depth + 1));
                            if (SETTINGS.useGridLayout && !nodeY.flex.enabled && nextDepth.length > 1 && nextDepth.every(item => BLOCK_CHROME.includes(item.tagName))) {
                                const nextMapX = mapX[nodeY.depth + 2];
                                const nextCoordsX = (nextMapX ? Object.keys(nextMapX) : []);
                                if (nextCoordsX.length > 1) {
                                    const columnLeft = [];
                                    const columnRight = [];
                                    let columns = [];
                                    let columnSymmetry = [];
                                    for (let l = 0; l < nextCoordsX.length; l++) {
                                        const nextAxisX = nextMapX[nextCoordsX[l]].sort((a, b) => (a.bounds.top > b.bounds.top ? 1 : -1));
                                        columnLeft[l] = parseInt(nextCoordsX[l]);
                                        columnRight[l] = (l == 0 ? Number.MIN_VALUE : columnRight[l - 1]);
                                        for (let m = 0; m < nextAxisX.length; m++) {
                                            const nextX = nextAxisX[m];
                                            if (nextX.parent.parent != null && nodeY.id == nextX.parent.parent.id) {
                                                const [left, right] = [nextX.bounds.left, nextX.bounds.right];
                                                if (l == 0 || left >= columnRight[l - 1]) {
                                                    if (columns[l] == null) {
                                                        columns[l] = [];
                                                    }
                                                    if (columnSymmetry[l] == null) {
                                                        columnSymmetry[l] = [];
                                                    }
                                                    columns[l].push(nextX);
                                                    columnSymmetry[l].push(right);
                                                }
                                                columnLeft[l] = Math.max(left, columnLeft[l]);
                                                columnRight[l] = Math.max(right, columnRight[l]);
                                            }
                                        }
                                    }
                                    columns = columns.filter(nodes => nodes);
                                    columnSymmetry = columnSymmetry.filter(item => item).map(item => (item.length == 1 || new Set(item).size == 1));
                                    const columnLength = columns.reduce((a, b) => Math.max(a, b.length), 0);
                                    for (let l = 0; l < columnLength; l++) {
                                        let y = null;
                                        for (let m = 0; m < columns.length; m++) {
                                            const nodeX = columns[m][l];
                                            if (nodeX != null) {
                                                if (y == null) {
                                                    y = nodeX.linear.top;
                                                }
                                                else if (!Utils.withinRange(nodeX.linear.top, y, SETTINGS.boundsOffset)) {
                                                    const nextRowX = columns[m - 1][l + 1];
                                                    if (columns[m][l - 1] == null || (nextRowX && Utils.withinRange(nextRowX.linear.top, nodeX.linear.top, SETTINGS.boundsOffset))) {
                                                        columns[m].splice(l, 0, { spacer: 1 });
                                                    }
                                                    else if (columns[m][l + 1] == null) {
                                                        columns[m][l + 1] = nodeX;
                                                        columns[m][l] = { spacer: 1 };
                                                    }
                                                }
                                            }
                                            else {
                                                columns[m].splice(l, 0, { spacer: 1 });
                                            }
                                        }
                                    }
                                    if (columns.length > 1) {
                                        const columnStart = []
                                        const columnEnd = [];
                                        const rowStart = [];
                                        const columnWeightExclude = {};
                                        xml += writeGridLayout(nodeY, nodeY.depth + nodeY.depthIndent, nodeY.parent, columns.length);
                                        for (let l = 0, count = 0; l < columns.length; l++) {
                                            columnStart[l] = Number.MAX_VALUE;
                                            columnEnd[l] = Number.MIN_VALUE;
                                            let spacer = 0;
                                            for (let m = 0; m < columns[l].length; m++) {
                                                const nodeX = columns[l][m];
                                                if (!nodeX.spacer) {
                                                    columnStart[l] = Math.min(nodeX.bounds.left, columnStart[l]);
                                                    columnEnd[l] = Math.max(nodeX.bounds.right, columnEnd[l]);
                                                    nodeX.depth = nodeY.depth + 1;
                                                    if (nodeX.children.length > 0) {
                                                        const offsetDepth = nodeX.original.depth - nodeX.depth;
                                                        nodeX.children.forEach(item => item.depth -= offsetDepth);
                                                    }
                                                    nodeX.parent.hide();
                                                    nodeX.parent = nodeY;
                                                    let rowSpan = 1;
                                                    let columnSpan = 1 + spacer;
                                                    for (let n = l + 1; n < columns.length; n++) {
                                                        if (columns[n][m].spacer == 1) {
                                                            columnSpan++;
                                                            columns[n][m].spacer = 2;
                                                        }
                                                        else {
                                                            break;
                                                        }
                                                    }
                                                    if (columnSpan == 1) {
                                                        for (let n = m + 1; n < columns[l].length; n++) {
                                                            if (columns[l][n].spacer == 1) {
                                                                rowSpan++;
                                                                columns[l][n].spacer = 2;
                                                            }
                                                            else {
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    if (rowSpan > 1) {
                                                        nodeX.android('layout_rowSpan', rowSpan);
                                                    }
                                                    if (columnSpan > 1) {
                                                        nodeX.android('layout_columnSpan', columnSpan);
                                                    }
                                                    nodeX.gridIndex = l;
                                                    nodeX.gridRowEnd = (columnSpan + l == columns.length);
                                                    nodeX.gridFirst = (count++ == 0);
                                                    nodeX.gridLast = (nodeX.gridRowEnd && m == columns[l].length - 1);
                                                    if (SETTINGS.useLayoutWeight) {
                                                        nodeX.gridColumnWeight = (columnSymmetry[l] && nodeY.tagName != 'TBODY' ? 0 : 1);
                                                    }
                                                    if (rowStart[m] == null) {
                                                        nodeX.gridRowStart = true;
                                                        rowStart[m] = nodeX;
                                                    }
                                                    spacer = 0;
                                                }
                                                else if (nodeX.spacer == 1) {
                                                    spacer++;
                                                }
                                            }
                                        }
                                        columnEnd[columnEnd.length - 1] = columnRight[columnRight.length - 1];
                                        nodeY.gridColumnStart = columnStart;
                                        nodeY.gridColumnEnd = columnEnd;
                                        nodeY.gridColumnCount = columns.length;
                                    }
                                }
                            }
                            if (!nodeY.renderParent) {
                                const [linearX, linearY] = Node.isLinearXY(nodeY.children.filter(item => (item.depth == nodeY.depth + 1)));
                                if (linearX && linearY) {
                                    if (nodeY.children.length == 1) {
                                        const childNode = nodeY.children[0];
                                        childNode.parent = nodeY.parent;
                                        childNode.renderId = nodeY.id;
                                        childNode.inheritGrid(nodeY);
                                        childNode.inheritStyleMap(nodeY);
                                    }
                                    nodeY.children.forEach(item => item.depthIndent -= 1);
                                    xml += `{${nodeY.id}}`;
                                    nodeY.hide(nodeY.parent);
                                }
                                else if (!nodeY.flex.enabled && (linearX || linearY)) {
                                    if (nodeY.parent.isView(WIDGET_ANDROID.LINEAR)) {
                                        nodeY.parent.linearRows.push(nodeY);
                                    }
                                    xml += writeLinearLayout(nodeY, nodeY.depth + nodeY.depthIndent, nodeY.parent, linearY);
                                }
                                else {
                                    xml += writeDefaultLayout(nodeY, nodeY.depth + nodeY.depthIndent, nodeY.parent);
                                }
                            }
                        }
                        else {
                            continue;
                        }
                    }
                    if (!nodeY.renderParent) {
                        if (nodeY.parent.isView(WIDGET_ANDROID.GRID)) {
                            const original = nodeY.parent.children.find(item => item.id == nodeY.original.parentId);
                            if (original != null) {
                                const siblings = original.children.filter(item => !item.renderParent && item.bounds.left >= nodeY.bounds.right && item.bounds.right <= nodeY.parent.gridColumnEnd[nodeY.gridIndex]).sort((a, b) => (a.bounds.x >= b.bounds.x ? 1 : -1));
                                if (siblings.length > 0) {
                                    siblings.unshift(nodeY);
                                    const [linearX, linearY] = Node.isLinearXY(siblings);
                                    const wrapNode = Node.createWrapNode(generateNodeId(), nodeY, nodeY.parent, siblings, [0]);
                                    wrapNode.setAndroidId((linearX || linearY ? WIDGET_ANDROID.LINEAR : WIDGET_ANDROID.CONSTRAINT));
                                    wrapNode.setBounds();
                                    wrapNode.setLinearBoxRect();
                                    NODE_CACHE.push(wrapNode);
                                    const rowSpan = nodeY.android('layout_rowSpan');
                                    const columnSpan = nodeY.android('layout_columnSpan');
                                    if (rowSpan > 1) {
                                        wrapNode.android('layout_rowSpan', rowSpan);
                                        nodeY.delete('android', 'layout_rowSpan');
                                    }
                                    if (columnSpan > 1) {
                                        wrapNode.android('layout_columnSpan', columnSpan);
                                        nodeY.delete('android', 'layout_columnSpan');
                                    }
                                    const renderParent = nodeY.parent;
                                    const section = siblings.map(item => {
                                        if (!item.renderParent) {
                                            let visible = true;
                                            const children = item.element.children;
                                            if (children.length > 0) {
                                                visible = false;
                                                for (let l = 0; l < children.length; l++) {
                                                    if (!siblings.includes(children[l].androidNode)) {
                                                        visible = true;
                                                        break;
                                                    }
                                                }
                                            }
                                            if (!visible) {
                                                item.hide();
                                            }
                                            else {
                                                item.parent = wrapNode;
                                                item.depthIndent++;
                                                wrapNode.inheritGrid(item);
                                                if (item.children.length == 0 || item.children.every(item => INLINE_CHROME.includes(item.tagName))) {
                                                    return writeViewTag(item, nodeY.depth + nodeY.depthIndent, wrapNode);
                                                }
                                                else {
                                                    return writeDefaultLayout(item, nodeY.depth + nodeY.depthIndent, wrapNode);
                                                }
                                            }
                                        }
                                        return '';
                                    }).join('');
                                    if (linearX || linearY) {
                                        if (renderParent.isView(WIDGET_ANDROID.LINEAR)) {
                                            renderParent.linearRows.push(wrapNode);
                                        }
                                        xml += writeLinearLayout(wrapNode, nodeY.depth + nodeY.depthIndent - 1, renderParent, linearY);
                                    }
                                    else {
                                        xml += writeDefaultLayout(wrapNode, nodeY.depth + nodeY.depthIndent - 1, renderParent);
                                    }
                                    xml = xml.replace(`{${wrapNode.id}}`, section);
                                }
                            }
                        }
                        if (!nodeY.renderParent) {
                            xml += writeViewTag(nodeY, nodeY.depth + nodeY.depthIndent, nodeY.parent, tagName);
                        }
                    }
                    if (xml != '') {
                        const renderId = nodeY.renderId || parentId;
                        if (partial[renderId] == null) {
                            partial[renderId] = [];
                        }
                        partial[renderId].push(xml);
                    }
                }
            }
        }
        for (const id in partial) {
            if (partial[id] != '') {
                output = output.replace(`{${id}}`, partial[id].join(''));
            }
        }
    }
    setResourceStyle();
    if (SETTINGS.showAttributes) {
        setMarginPadding();
        if (SETTINGS.useLayoutWeight) {
            setLayoutWeight();
        }
        positionConstraints();
        output = inlineAttributes(output);
    }
    else {
        output = output.replace(/{@[0-9]+}/g, '');
    }
    if (SETTINGS.useUnitDP) {
        output = Utils.insetToDP(output);
    }
    return output;
}
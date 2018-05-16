const LAYOUT_ANDROID = {
    TEXT: 'TextView',
    EDIT: 'EditText',
    LINEAR: 'LinearLayout',
    CONSTRAINT: 'ConstraintLayout',
    RELATIVE: 'RelativeLayout',
    GRID: 'GridLayout',
    SCROLL_VERTICAL: 'ScrollView',
    SCROLL_HORIZONTAL: 'HorizontalScrollView',
    SCROLL_NESTED: 'NestedScrollView',
    RADIO: 'RadioButton',
    RADIO_GROUP: 'RadioGroup'
};

const MAPPING_ANDROID = {
    'SPAN': 'TextView',
    'LABEL': 'TextView',
    'A': 'TextView',
    'B': 'TextView',
    'I': 'TextView',
    'PRE': 'TextView',
    'HR': 'View',
    'SELECT': 'Spinner',
    'INPUT' : {
        'text': 'EditText',
        'password': 'EditText',
        'checkbox': 'CheckBox',
        'radio': 'RadioButton',
        'button': 'Button',
        'submit': 'Button'
    },
    'BUTTON': 'Button',
    'TEXTAREA': 'EditText',
    'IMG': 'ImageView'
};

const PROPERTY_ANDROID = {
    'backgroundStyle': {
        'backgroundColor': 'android:background="@drawable/{0}"'
    },
    'computedStyle': {
        'fontFamily': 'android:fontFamily="{0}"',
        'fontSize': 'android:textSize="{0}"',
        'fontWeight': 'android:fontWeight="{0}"',
        'fontStyle': 'android:textStyle="{0}"',
        'color': 'android:textColor="{0}"',
        'backgroundColor': 'android:background="{0}"'
    },
    'boxSpacing': {
        'margin': 'android:layout_margin="{0}"',
        'marginTop': 'android:layout_marginTop="{0}"',
        'marginRight': 'android:layout_marginRight="{0}"',
        'marginBottom': 'android:layout_marginBottom="{0}"',
        'marginLeft': 'android:layout_marginLeft="{0}"',
        'marginHorizontal': 'android:layout_marginHorizontal="{0}"',
        'marginVertical': 'android:layout_marginVertical="{0}"',
        'padding': 'android:padding="{0}"',
        'paddingTop': 'android:paddingTop="{0}"',
        'paddingRight': 'android:paddingRight="{0}"',
        'paddingBottom': 'android:paddingBottom="{0}"',
        'paddingLeft': 'android:paddingLeft="{0}"',
        'paddingHorizontal': 'android:paddingHorizontal="{0}"',
        'paddingVertical': 'android:paddingVertical="{0}"'
    },
    'resourceString': {
        'text': 'android:text="@string/{0}"'
    },
    'resourceStringArray': {
        'entries': 'android:entries="@array/{0}"'
    }
};

const WIDGET_ANDROID = {
    'ConstraintLayout': {
        'androidId': 'android:id="@+id/{0}"',
        'window.setBackgroundStyle': PROPERTY_ANDROID['backgroundStyle'],
        'window.setBoxSpacing': PROPERTY_ANDROID['boxSpacing']
    },
    'LinearLayout': {
        'androidId': 'android:id="@+id/{0}"',
        'window.setBackgroundStyle': PROPERTY_ANDROID['backgroundStyle'],
        'window.setBoxSpacing': PROPERTY_ANDROID['boxSpacing']
    },
    'GridLayout': {
        'androidId': 'android:id="@+id/{0}"',
        'window.setBackgroundStyle': PROPERTY_ANDROID['backgroundStyle'],
        'window.setBoxSpacing': PROPERTY_ANDROID['boxSpacing']
    },
    'ScrollView': {
        'androidId': 'android:id="@+id/{0}"'
    },
    'HorizonatalView': {
        'androidId': 'android:id="@+id/{0}"'
    },
    'NestedScrollView': {
        'androidId': 'android:id="@+id/{0}"'
    },
    'RadioGroup': {
        'androidId': 'android:id="@+id/{0}"',
        'androidCheckedButton': 'android:checkedButton="@id+/{0}"'
    },
    'RadioButton': {
        'androidId': 'android:id="@+id/{0}"',
        'window.getComputedStyle': PROPERTY_ANDROID['computedStyle'],
        'window.setBoxSpacing': PROPERTY_ANDROID['boxSpacing']
    },
    'CheckBox': {
        'androidId': 'android:id="@+id/{0}"',
        'window.getComputedStyle': PROPERTY_ANDROID['computedStyle'],
        'window.setBoxSpacing': PROPERTY_ANDROID['boxSpacing']
    },
    'Spinner': {
        'androidId': 'android:id="@+id/{0}"',
        'window.setBackgroundStyle': PROPERTY_ANDROID['backgroundStyle'],
        'window.getComputedStyle': PROPERTY_ANDROID['computedStyle'],
        'window.setBoxSpacing': PROPERTY_ANDROID['boxSpacing'],
        'window.addResourceStringArray': PROPERTY_ANDROID['resourceStringArray']
    },
    'TextView': {
        'androidId': 'android:id="@+id/{0}"',
        'window.setBackgroundStyle': PROPERTY_ANDROID['backgroundStyle'],
        'window.getComputedStyle': PROPERTY_ANDROID['computedStyle'],
        'window.setBoxSpacing': PROPERTY_ANDROID['boxSpacing'],
        'window.addResourceString': PROPERTY_ANDROID['resourceString']
    },
    'EditText': {
        'androidId': 'android:id="@+id/{0}"',
        'window.setBackgroundStyle': PROPERTY_ANDROID['backgroundStyle'],
        'window.getComputedStyle': PROPERTY_ANDROID['computedStyle'],
        'window.setBoxSpacing': PROPERTY_ANDROID['boxSpacing'],
        'window.addResourceString': PROPERTY_ANDROID['resourceString']
    },
    'View': {
        'androidId': 'android:id="@+id/{0}"',
        'window.setBackgroundStyle': PROPERTY_ANDROID['backgroundStyle'],
        'window.setBoxSpacing': PROPERTY_ANDROID['boxSpacing']
    },
    'Button': {
        'androidId': 'android:id="@+id/{0}"',
        'window.setBackgroundStyle': PROPERTY_ANDROID['backgroundStyle'],
        'window.getComputedStyle': PROPERTY_ANDROID['computedStyle'],
        'window.setBoxSpacing': PROPERTY_ANDROID['boxSpacing'],
        'window.addResourceString': PROPERTY_ANDROID['resourceString']
    },
    'ImageView': {
        'androidId': 'android:id="@+id/{0}"',
        'androidSrc': 'android:src="@drawable/{0}"',
        'window.setBackgroundStyle': PROPERTY_ANDROID['backgroundStyle'],
        'window.setBoxSpacing': PROPERTY_ANDROID['boxSpacing']
    }
};

const STRING_ANDROID = {
    XMLNS: 'xmlns:android="http://schemas.android.com/apk/res/android"',
    SPACE: '<Space android:layout_width="{0}" android:layout_height="{1}" android:layout_columnSpan="{2}" />'
};

const DENSITY_ANDROID = {
    LDPI: 120,
    MDPI: 160,
    HDPI: 240,
    XHDPI: 320,
    XXHDPI: 480,
    XXXHDPI: 640
};

const SETTINGS = {
    density: DENSITY_ANDROID.MDPI,
    defaultLayout: LAYOUT_ANDROID.RELATIVE,
    showAttributes: true,
    showAndroidXmlNamespace: false,
    boundsOffset: 2,
    whitespaceOffset: 4
};

const NODE_CACHE = [];
const RENDER_AFTER = {};
const GENERATE_ID = { '__current': [] };

const RESOURCE_STRING = new Map();
const RESOURCE_ARRAY = new Map();
const RESOURCE_COLOR = new Map();
const RESOURCE_IMAGE = new Map();
let RESOURCE_STYLE = new Map();

function writeResourceStringXml() {
    const resource = new Map([...RESOURCE_STRING.entries()].sort());
    const xml = ['<?xml version="1.0" encoding="utf-8"?>',
                 '<resources>'];
    for (const [i, j] of resource.entries()) {
        xml.push(`\t<string name="${i}">${j}</string>`);
    }
    xml.push('</resources>',
             '<!-- filename: res/values/string.xml -->\n');
    return xml.join('\n');
}

function writeResourceArrayXml() {
    const resource = new Map([...RESOURCE_ARRAY.entries()].sort());
    const xml = ['<?xml version="1.0" encoding="utf-8"?>',
                 '<resources>'];
    for (const [i, j] of resource.entries()) {
        xml.push(`\t<array name="${i}">`);
        for (const [k, l] of j.entries()) {
            xml.push(`\t\t<item${(l != '' ? ` name="${k}"` : '')}>${(l != '' ? `@string/${l}` : `${k}`)}</item>`);
        }
        xml.push('\t</array>');
    }
    xml.push('</resources>',
             '<!-- filename: res/values/string_array.xml -->\n');
    return xml.join('\n');
}

function writeResourceStyleXml() {
    const xml = ['<?xml version="1.0" encoding="utf-8"?>',
                 '<resources>'];
    for (const i in RESOURCE_STYLE) {
        for (const j of RESOURCE_STYLE[i]) {
            xml.push(`\t<style name="${j.name}">`);
            j.attributes.split(';').forEach(value => {
                const [name, setting] = value.split('=');
                xml.push(`\t\t<item name="${name}">${setting.replace(/"/g, '')}</item>`);
            });
            xml.push('\t<style>');
        }
    }
    xml.push('</resources>',
             '<!-- filename: res/values/styles.xml -->\n');
    return xml.join('\n');
}

function writeResourceColorXml() {
    const resource = new Map([...RESOURCE_COLOR.entries()].sort());
    const xml = ['<?xml version="1.0" encoding="utf-8"?>',
                 '<resources>'];
    for (const [i, j] of resource.entries()) {
        xml.push(`\t<color name="${i}">${j}</color>`);
    }
    xml.push('</resources>',
             '<!-- filename: res/values/colors.xml -->\n');
    return xml.join('\n');
}

function writeResourceDrawableXml() {
    const xml = [];
    for (const item of NODE_CACHE) {
        if (item.drawable) {
            xml.push(`${item.drawable}`,
                     `<!-- filename: res/drawable/${item.tagName.toLowerCase()}_${item.androidId}.xml -->\n`);
        }
    }
    if (RESOURCE_IMAGE.size) {
        for (const [i, j] of RESOURCE_IMAGE.entries()) {
            xml.push(`<!-- image: ${j} -->`,
                     `<!-- filename: res/drawable/${i + j.substring(j.lastIndexOf('.'))} -->\n`);
        }
    }
    return xml.join('\n');
}

function addResourceString(element, value) {
    let name = value;
    if (value == null) {
        if (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') {
            name = element.value;
            value = element.value;
        }
        else {
            name = element.innerText;
            value = element.innerHTML;
        }
    }
    if (value != '') {
        if (element != null) {
            const node = element.cacheData;
            if (node.isView(LAYOUT_ANDROID.TEXT)) {
                const match = node.style.textDecoration.match(/(underline|line-through)/);
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
        for (const [i, j] in RESOURCE_STRING.entries()) {
            if (j == value) {
                return { text: i };
            }
        }
        name = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().replace(/_+/g, '_').split('_').slice(0, 5).join('_').replace(/_+$/g, '');
        const resourceName = insertResourceAsset(RESOURCE_STRING, name, value);
        return { text: resourceName };
    }
    return null;
}

function addResourceStringArray(element) {
    const stringArray = new Map();
    let integerArray = new Map();
    for (let i = 0; i < element.children.length; i++) {
        const item = element.children[i];
        const value = item.value.trim();
        const text = item.text.trim();
        if (text != '') {
            if (integerArray != null && !stringArray.size && /^\d+$/.test(text) && !/^(^0+)\d+$/.test(text)) {
                integerArray.set(value, '');
            }
            else {
                if (integerArray != null && integerArray.size) {
                    i = -1;
                    stringArray = new Map();
                    integerArray = null;
                    continue;
                }
                stringArray.set(value, addResourceString(null, text).text);
            }
        }
    }
    if (stringArray.size || integerArray.size) {
        const resourceName = insertResourceAsset(RESOURCE_ARRAY, `${element.cacheData.androidId}_array`, (stringArray.size ? stringArray : integerArray));
        return { entries: resourceName };
    }
    return null;
}

function addResourceColor(value) {
    value = value.toUpperCase().trim();
    if (value != '') {
        let colorName = '';
        if (!RESOURCE_COLOR.has(value)) {
            const color = Color.findNearestColor(value);
            if (color != null) {
                color.name = Utils.cameltoLowerCase(color.name);
                if (value.toUpperCase().trim() == color.hex) {
                    colorName = color.name;
                }
                else {
                    const className = `__color${color.name}`;
                    if (GENERATE_ID[className] == null) {
                        GENERATE_ID[className] = 1;
                    }
                    colorName = color.name + GENERATE_ID[className]++;
                }
            }
            if (colorName != '') {
                RESOURCE_COLOR.set(value, colorName);
            }
        }
        else {
            colorName = RESOURCE_COLOR.get(value);
        }
        if (colorName != '') {
            return `@color/${colorName}`;
        }
    }
    return value;
}

function getXmlNs() {
    return (SETTINGS.showAndroidXmlNamespace ? ` ${STRING_ANDROID.XMLNS}` : '');
}

function insertResourceAsset(resource, name, value = '') {
    let resourceName = null;
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
    return resourceName;
}

function setBackgroundStyle(element) {
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
        backgroundParent = Color.parseRGBA(Node.getElementStyle(element.parentNode).backgroundColor);
    }
    const style = Node.getElementStyle(element);
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
            default: 'android:color="@android:color/black"',
            solid: `android:color="${properties.border[2]}"`,
            dotted: `android:color="${properties.border[2]}" android:dashWidth="3dp" android:dashGap="1dp"`,
            dashed: `android:color="${properties.border[2]}" android:dashWidth="1dp" android:dashGap="1dp"`
        };
        let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
        if (properties.borderRadius != null) {
            xml += `<shape${getXmlNs()} android:shape="rectangle">\n` +
                   `\t<stroke android:width="${properties.border[1]}" ${borderStyle[properties.border[0]] || borderStyle['default']} />\n` +
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
            xml += `<shape${getXmlNs()} android:shape="rectangle">\n` +
                   `\t<stroke android:width="${properties.border[1]}" ${borderStyle[properties.border[0]]} />\n` +
                   '</shape>';
        }
        else {
            xml += `<layer-list${getXmlNs()}>\n`;
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
                       `\t\t\t<stroke android:width="${properties.border[1]}" ${borderStyle[properties.border[0]]} />\n` +
                       '\t\t</shape>\n' +
                       '\t</item>\n';
            }
            else {
                [properties.borderTopWidth, properties.borderRightWidth, properties.borderBottomWidth, properties.borderLeftWidth].forEach((item, index) => {
                    xml += `\t<item android:${['top', 'right', 'bottom', 'left'][index]}="${item[2]}">\n` +
                           '\t\t<shape android:shape="rectangle">\n' +
                           `\t\t\t<stroke android:width="${item[1]}" ${borderStyle[item[0]]} />\n` +
                           '\t\t</shape>\n' +
                           '\t</item>\n';
                });
            }
            xml += '</layer-list>';
        }
        const node = element.cacheData;
        node.drawable = xml;
        GENERATE_ID['__current'].push(`${node.tagName.toLowerCase()}_${node.androidId}`);
        return { backgroundColor: `${element.tagName.toLowerCase()}_{id}` };
    }
    return null;
}

function setBoxSpacing(element) {
    const result = getBoxSpacing(element);
    if (result.paddingTop != null && result.paddingTop == result.paddingBottom) {
        result.paddingVertical = result.paddingTop;
        delete result.paddingTop;
        delete result.paddingBottom;
    }
    if (result.paddingLeft != null && result.paddingLeft == result.paddingRight) {
        result.paddingHorizontal = result.paddingLeft;
        delete result.paddingLeft;
        delete result.paddingRight;
    }
    if (result.marginTop != null && result.marginTop == result.marginBottom) {
        result.marginVertical = result.marginTop;
        delete result.marginTop;
        delete result.marginBottom;
    }
    if (result.marginLeft != null && result.marginLeft == result.marginRight) {
        result.marginHorizontal = result.marginLeft;
        delete result.marginLeft;
        delete result.marginRight;
    }
    return result;
}

function getBoxSpacing(element, complete) {
    const result = {};
    ['padding', 'margin'].forEach(border => {
        ['Top', 'Left', 'Right', 'Bottom'].forEach(side => {
            const property = `${border + side}`;
            let dimension = Node.getElementStyle(element)[property];
            dimension = (complete ? parseInt(dimension) : Utils.convertToDP(dimension));
            if (complete || (dimension != 0 && dimension != '0dp')) {
                result[property] = dimension;
            }
        });
    });
    return result;
}

function parseBorderStyle(value) {
    let stroke = value.match(/(none|dotted|dashed|solid)/);
    let width = value.match(/([0-9]+(?:px|pt))/);
    let color = Color.parseRGBA(value);
    if (stroke != null) {
        stroke = stroke[1];
    }
    if (width != null) {
        width = width[1];
    }
    if (color != null) {
        color = color[1];
    }
    return [stroke || 'solid', Utils.convertToDP(width || 1), color || '#000'];
}

function parseBoxDimensions(value) {
    const match = value.match(/^([0-9]+(?:px|pt)) ([0-9]+(?:px|pt)) ([0-9]+(?:px|pt)) ([0-9]+(?:px|pt))$/);
    if (match != null && match.length == 5) {
        if (match[1] == match[2] && match[2] == match[3] && match[3] == match[4]) {
            return [Utils.convertToDP(match[1])];
        }
        else if (match[1] == match[3] && match[2] == match[4]) {
            return [Utils.convertToDP(match[1]), Utils.convertToDP(match[2])];
        }
        else {
            return [Utils.convertToDP(match[1]), Utils.convertToDP(match[2]), Utils.convertToDP(match[3]), Utils.convertToDP(match[4])];
        }
    }
    return null;
}

function writeNodeAttributes(output) {
    for (const node of NODE_CACHE) {
        const attrs = node.attributes;
        if (attrs.length > 0) {
            attrs.sort((a, b) => {
                if (a.startsWith('android:id=')) {
                    return -1;
                }
                return (a > b);
            });
            let xml = '';
            if (SETTINGS.showAndroidXmlNamespace) {
                xml += ` ${STRING_ANDROID.XMLNS}`;
            }
            xml += attrs.map(value => `\n${Utils.setIndent(node.depthAttribute) + value}`).join('').replace('{id}', node.androidId);
            output = output.replace(`{@${node.id}}`, xml);
        }
    }
    return output;
}

function writeTemplate(node, depth, parent, tagName) {
    let indent = Utils.setIndent(depth);
    let beforeXml = '';
    let afterXml = '';
    node.setAndroidAttributes(tagName);
    node.setAndroidDimensions();
    if (node.scroll.overflow) {
        node.depthIndent++;
        node.children.forEach(item => item.depthIndent++);
        node.scrollView = true;
        let wrapper = Node.insertWrapper(NODE_CACHE, node, parent, [node]);
        let scrollView = (node.isHorizontalScroll() ? LAYOUT_ANDROID.SCROLL_HORIZONTAL : (node.scroll.nested ? LAYOUT_ANDROID.SCROLL_NESTED : LAYOUT_ANDROID.SCROLL_VERTICAL));
        wrapper.setAndroidAttributes(scrollView);
        wrapper.setAndroidDimensions();
        wrapper.setAttributes(depth + 1);
        wrapper.renderParent = parent;
        beforeXml = indent + `<${scrollView}{@${wrapper.id}}{#${wrapper.id}}>\n`;
        afterXml =  indent + `</${scrollView}>\n`;
        indent = Utils.setIndent(++depth);
    }
    node.setAttributes(depth + 1);
    node.renderParent = parent;
    return setGridSpacing(node, depth) + beforeXml + getEnclosingTag(indent, tagName, node.id, `{${node.id}}`) + afterXml;
}

function writeDefaultTemplate() {
    switch (SETTINGS.defaultLayout) {
        case LAYOUT_ANDROID.CONSTRAINT:
            return writeConstraintTemplate.apply(null, arguments);
        case LAYOUT_ANDROID.RELATIVE:
            return writeRelativeTemplate.apply(null, arguments);
    }
}

function writeLinearTemplate(node, depth, parent, vertical) {
    node.attr('orientation', (vertical ? 'vertical' : 'horizontal'));
    return writeTemplate(node, depth, parent, LAYOUT_ANDROID.LINEAR);
}

function writeRelativeTemplate(node, depth, parent) {
    return writeTemplate(node, depth, parent, LAYOUT_ANDROID.RELATIVE);
}

function writeRelativeLayout(output) {
    const nodeIndex = {};
    function addNodeLayout(position, id, viewId = true) {
        if (nodeIndex[id][position] == null) {
            nodeIndex[id][position] = viewId;
        }
    }
    for (const node of NODE_CACHE) {
        if (node.isView(LAYOUT_ANDROID.RELATIVE)) {
            const children = NODE_CACHE.filter(item => (item.renderParent == node));
            for (const i of children) {
                nodeIndex[i.id] = {};
                let centerVertical = false;
                let centerHorizontal = false;
                if (i.linear.top == node.linear.top) {
                    addNodeLayout('layout_alignParentTop', i.id);
                }
                else if (i.linear.bottom == node.linear.bottom) {
                    addNodeLayout('layout_alignParentBottom', i.id);
                }
                else {
                    centerVertical = Utils.withinRange(node.bounds.top - i.bounds.top, node.bounds.bottom - i.bounds.bottom, SETTINGS.boundsOffset);
                }
                if (i.linear.left == node.linear.left) {
                    addNodeLayout('layout_alignParentStart', i.id);
                }
                else if (i.linear.right == node.linear.right) {
                    addNodeLayout('layout_alignParentEnd', i.id);
                }
                else {
                    centerHorizontal = Utils.withinRange(i.bounds.left - node.bounds.left, node.bounds.right - i.bounds.right, SETTINGS.boundsOffset);
                }
                if (centerVertical && centerHorizontal) {
                    addNodeLayout('layout_centerInParent', i.id);
                }
                else if (centerVertical) {
                    addNodeLayout('layout_centerVertical', i.id);
                }
                else if (centerHorizontal) {
                    addNodeLayout('layout_centerHorizontal', i.id);
                }
            }
            for (const i of children) {
                for (const j of children) {
                    if (i != j) {
                        if (i.linear.bottom == j.linear.top) {
                            addNodeLayout('layout_above', i.id, j.androidId);
                        }
                        else if (i.linear.top == j.linear.bottom) {
                            addNodeLayout('layout_below', i.id, j.androidId);
                        }
                        if (i.linear.top == j.linear.top) {
                            addNodeLayout('layout_alignTop', i.id, j.androidId);
                        }
                        else if (i.linear.bottom == j.linear.bottom) {
                            addNodeLayout('layout_alignBottom', i.id, j.androidId);
                        }
                        if (i.linear.left == j.linear.left) {
                            addNodeLayout('layout_alignStart', i.id, j.androidId);
                        }
                        else if (i.linear.right == j.linear.right) {
                            addNodeLayout('layout_alignEnd', i.id, j.androidId);
                        }
                        if (Utils.withinRange(i.linear.right, j.linear.left, SETTINGS.whitespaceOffset)) {
                            addNodeLayout('layout_toStartOf', i.id, j.androidId);
                            if (i.linear.right != j.linear.left) {
                                i.replaceAttribute('android:layout_marginRight', Utils.convertToDP(j.linear.left - i.linear.right), true);
                            }
                        }
                        else if (Utils.withinRange(i.linear.left, j.linear.right, SETTINGS.whitespaceOffset)) {
                            addNodeLayout('layout_toEndOf', i.id, j.androidId);
                        }
                    }
                }
            }
            const indent = Utils.setIndent(node.depthAttribute + 1);
            for (const i in nodeIndex) {
                const position = Object.keys(nodeIndex[i]).sort();
                const result = [];
                for (const j of position) {
                    if (nodeIndex[i][j] == true) {
                        result.push(`android:${j}="true"`);
                    }
                    else {
                        result.push(`android:${j}="@+id/${nodeIndex[i][j]}"`);
                    }
                }
                const xml = result.map(value => `\n${indent + value}`).join('');
                output = output.replace(`{#${i}}`, xml);
            }
        }
    }
    return output;
}

function writeConstraintTemplate(node, depth, parent) {
    return writeTemplate(node, depth, parent, LAYOUT_ANDROID.CONSTRAINT);
}

function writeGridTemplate(node, depth, parent, columnCount = 2) {
    node.attr('columnCount', columnCount);
    parent.gridLayout = node;
    return writeTemplate(node, depth, parent, LAYOUT_ANDROID.GRID);
}

function writeTagTemplate(node, depth, parent, tagName, recursive = false) {
    const element = node.element;
    const indent = Utils.setIndent(depth);
    node.setAndroidAttributes(tagName);
    node.setAndroidDimensions();
    if (!recursive) {
        switch (element.type) {
            case 'radio':
                const result = NODE_CACHE.filter(item => (item.element.type == 'radio' && item.element.name == element.name && !item.renderParent && ((node.previous.depth || node.depth) == (item.previous.depth || item.depth))));
                let xml = '';
                if (result.length > 1) {
                    let rowSpan = 1;
                    let columnSpan = 1;
                    let checked = '';
                    const wrapper = Node.insertWrapper(NODE_CACHE, node, parent, result);
                    wrapper.setAndroidAttributes(LAYOUT_ANDROID.RADIO_GROUP);
                    wrapper.linearExclude = true;
                    node.radioGroup = [];
                    node.radioGroupId = wrapper.id;
                    for (const item of result) {
                        rowSpan += (item.layout_rowSpan || 1) - 1;
                        columnSpan += (item.layout_columnSpan || 1) - 1;
                        if (item != node) {
                            if (item.parent != node.parent) {
                                item.previous.parent = item.parent;
                                item.parent = node.parent;
                            }
                            if (item.depth != node.depth) {
                                item.previous.depth = item.depth;
                                item.depth = node.depth;
                            }
                            node.radioGroup.push(item);
                        }
                        item.depthIndent++;
                        item.autoWrap = true;
                        if (item.element.checked) {
                            checked = item.androidId;
                        }
                        xml += writeTagTemplate(item, depth + 1, parent, tagName, true);
                        wrapper.inheritGridStatus(item);
                    }
                    wrapper.androidCheckedButton = checked;
                    if (rowSpan > 1) {
                        wrapper.attr('layout_rowSpan', rowSpan);
                    }
                    if (columnSpan > 1) {
                        wrapper.attr('layout_columnSpan', columnSpan);
                    }
                    wrapper.setAttributes(depth + 1);
                    wrapper.renderParent = parent;
                    return setGridSpacing(wrapper, depth) + getEnclosingTag(indent, LAYOUT_ANDROID.RADIO_GROUP, wrapper.id, xml);
                }
                break;
            case 'password':
                node.attr('inputType', 'textPassword');
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
                        src = insertResourceAsset(RESOURCE_IMAGE, src, element.src);
                        break;
                    default:
                        src = `(UNSUPPORTED: ${image})`;
                }
                node.androidSrc = src;
                break;
            case 'TEXTAREA':
                node.attr('minLines', 2);
                if (element.rows > 2) {
                    node.attr('maxLines', element.rows);
                }
                if (element.maxlength != null) {
                    node.attr('maxLength', parseInt(element.maxlength));
                }
                node.attr('hint', element.placeholder);
                node.attr('scrollbars', 'vertical');
                node.attr('inputType', 'textMultiLine');
                if (node.styleMap.overflowX == 'scroll') {
                    node.attr('scrollHorizontally', 'true');
                }
                break;
        }
        switch (node.androidWidgetName) {
            case LAYOUT_ANDROID.TEXT:
                if (node.scroll.overflow) {
                    node.attr('scrollbars', (node.isHorizontalScroll() ? 'horizontal' : 'vertical'));
                }
            case LAYOUT_ANDROID.EDIT:
                let textAlign = node.styleMap.textAlign;
                let verticalAlign = node.styleMap.verticalAlign;
                if (node.isView(LAYOUT_ANDROID.GRID)) {
                    const container = node.previous.parent || node.parent;
                    if (textAlign == null) {
                        textAlign = container.styleMap.textAlign;
                    }
                    if (verticalAlign == null) {
                        verticalAlign = container.styleMap.verticalAlign;
                    }
                }
                if (textAlign || verticalAlign) {
                    node.attr('gravity', getAndroidGravity(textAlign, verticalAlign));
                }
                break;
        }
        if (parent.isView(LAYOUT_ANDROID.GRID)) {
            const styleMap = node.previous.parent.styleMap;
            if (styleMap.textAlign || styleMap.verticalAlign) {
                node.attr('layout_gravity', getAndroidGravity(styleMap.textAlign, styleMap.verticalAlign, true));
            }
        }
    }
    node.setAttributes(depth + 1);
    node.renderParent = parent;
    return setGridSpacing(node, depth) + `${indent}<${node.androidWidgetName}{@${node.id}}{#${node.id}} />\n` +
                                         (!node.autoWrap ? `{:${node.id}}` : '');
}

function getEnclosingTag(indent, tagName, id, content = '') {
    return indent + `<${tagName}{@${id}}{#${id}}>\n` +
                    content +
           indent + `</${tagName}>\n` +
                    `{:${id}}`;
}

function getAndroidGravity(textAlign, verticalAlign, layout = false) {
    const gravity = [];
    switch (verticalAlign) {
        case 'top':
            gravity.push('top');
        case 'middle':
            gravity.push('center_vertical');
            break;
        case 'bottom':
        case 'text-bottom':
            gravity.push('bottom');
            break;
        default:
            gravity.push((layout ? 'center_vertical' : 'top'));
    }
    switch (textAlign) {
        case 'right':
            gravity.push('end');
            break;
        case 'center':
            gravity.push('center_horizontal');
            break;
        default:
            gravity.push('start');
    }
    return gravity.join('|');
}

function setGridSpacing(node, depth = 0) {
    const indent = Utils.setIndent(depth);
    let xml = '';
    if (node.previous.parent != null && node.previous.parent.invisible) {
        const dimensions = getBoxSpacing(node.previous.parent.element, true);
        node.grid = {};
        if (node.gridRowStart) {
            node.grid.paddingLeft = dimensions.marginLeft + dimensions.paddingLeft;
            node.grid.paddingRight = dimensions.marginRight + dimensions.paddingRight;
        }
        if (node.gridRowEnd) {
            const heightBottom =  dimensions.marginBottom + dimensions.paddingBottom + (!node.gridLast ? dimensions.marginTop + dimensions.paddingTop : 0);
            if (heightBottom > 0) {
                addRenderAfter(node.id, getSpaceXml(indent, 'match_parent', Utils.convertToDP(heightBottom), node.renderParent.gridColumnCount));
            }
            node.grid.paddingTop = dimensions.marginTop + dimensions.paddingTop;
            node.grid.paddingBottom = dimensions.marginBottom + dimensions.paddingBottom;
        }
        if (node.gridFirst) {
            const heightTop = dimensions.paddingTop + dimensions.marginTop;
            if (heightTop > 0) {
                xml += getSpaceXml(indent, 'match_parent', Utils.convertToDP(heightTop), node.renderParent.gridColumnCount);
            }
        }
    }
    return xml;
}

function getSpaceXml(indent, width, height, columnCount) {
    return `${indent + Utils.formatString(STRING_ANDROID.SPACE, width, `${height}`, columnCount)}\n`;
}

function addRenderAfter(id, xml, index = -1) {
    if (RENDER_AFTER[id] == null) {
        RENDER_AFTER[id] = [];
    }
    if (index != -1 && index < RENDER_AFTER[id].length) {
        RENDER_AFTER[id].splice(index, 0, xml);
    }
    else {
        RENDER_AFTER[id].push(xml);
    }
}

function deleteStyleAttribute(sorted, attributes, nodeIds) {
    attributes.split(';').forEach(value => {
        for (let j = 0; j < sorted.length; j++) {
            if (sorted[j] != null) {
                let index = -1;
                let key = '';
                for (const k in sorted[j]) {
                    if (k == value) {
                        index = j;
                        key = k;
                        j = sorted.length;
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
                const style = Node.getElementStyle(element);
                const styleMap = {};
                for (const name of attributes) {
                    if (name.toLowerCase().indexOf('color') != -1) {
                        const color = Color.getColorByName(rule.style[name]);
                        if (color != null) {
                            rule.style[name] = Color.convertColorToRGB(color);
                        }
                    }
                    if (element.style[name] != null && element.style[name] != '') {
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

function setResourceStyle() {
    const style = {};
    const layout = {};
    for (const [i, j] of RESOURCE_STYLE.entries()) {
        let sorted = Array.from({ length: j.reduce((a, b) => Math.max(a, b.attributes.length), 0) }, v => v = {});
        for (const k of j) {
            for (let l = 0; l < k.attributes.length; l++) {
                const name = k.attributes[l];
                if (sorted[l][name] == null) {
                    sorted[l][name] = [];
                }
                sorted[l][name].push(k.id);
            }
        }
        style[i] = {};
        layout[i] = {};
        do {
            if (sorted.length == 1) {
                for (const k in sorted[0]) {
                    const value = sorted[0][k];
                    if (value.length > 2) {
                        style[i][k] = value;
                    }
                    else {
                        layout[i][k] = value;
                    }
                }
                sorted.length = 0;
            }
            else {
                const styleKey = {};
                const layoutKey = {}
                for (let k = 0; k < sorted.length; k++) {
                    const filtered = {};
                    for (const l in sorted[k]) {
                        if (sorted[k] == null) {
                            continue;
                        }
                        const ids = sorted[k][l];
                        let revalidate = false;
                        if (ids == null) {
                            continue;
                        }
                        else if (ids.length == j.length) {
                            styleKey[l] = ids;
                            sorted[k] = null;
                            revalidate = true;
                        }
                        else if (ids.length == 1) {
                            layoutKey[l] = ids;
                            sorted[k] = null;
                            revalidate = true;
                        }
                        if (!revalidate) {
                            const found = {};
                            for (let m = 0; m < sorted.length; m++) {
                                if (k != m) {
                                    for (const n in sorted[m]) {
                                        const compare = sorted[m][n];
                                        for (let o = 0; o < ids.length; o++) {
                                            if (compare.includes(ids[o])) {
                                                if (found[n] == null) {
                                                    found[n] = [];
                                                }
                                                found[n].push(ids[o]);
                                            }
                                        }
                                    }
                                }
                            }
                            for (const m in found) {
                                if (found[m].length > 1) {
                                    filtered[[l, m].sort().join(';')] = found[m];
                                }
                            }
                        }
                    }
                    const combined = {};
                    const deleteKeys = new Set();
                    for (const l in filtered) {
                        for (const m in filtered) {
                            if (l != m && filtered[l].join('') == filtered[m].join('')) {
                                const shared = filtered[l].join(',');
                                if (combined[shared] != null) {
                                    combined[shared] = new Set([...combined[shared], ...m.split(';')]);
                                }
                                else {
                                    combined[shared] = new Set([...l.split(';'), ...m.split(';')]);
                                }
                                deleteKeys.add(l).add(m);
                            }
                        }
                    }
                    deleteKeys.forEach(value => delete filtered[value]);
                    for (const l in filtered) {
                        deleteStyleAttribute(sorted, l, filtered[l]);
                        style[i][l] = filtered[l];
                    }
                    for (const l in combined) {
                        const attr = Array.from(combined[l]).sort().join(';');
                        const nodeIds = l.split(',').map(m => parseInt(m));
                        deleteStyleAttribute(sorted, attr, nodeIds);
                        style[i][attr] = nodeIds;
                    }
                }
                const combined = Object.keys(styleKey);
                if (combined.length > 0) {
                    style[i][combined.join(';')] = styleKey[combined[0]];
                }
                for (const k in layoutKey) {
                    layout[i][k] = layoutKey[k];
                }
                for (let k = 0; k < sorted.length; k++) {
                    if (sorted[k] != null && Object.keys(sorted[k]).length == 0) {
                        delete sorted[k];
                    }
                }
                sorted = sorted.filter(item => item);
            }
        }
        while (sorted.length > 0)
    }
    const resource = {};
    for (const tag in style) {
        resource[tag] = [];
        for (const attributes in style[tag]) {
            resource[tag].push({ attributes, ids: style[tag][attributes]});
        }
        resource[tag].sort((a, b) => {
            let [c, d] = [a.ids.length, b.ids.length];
            if (c == d) {
                [c, d] = [a.attributes.split(';').length, b.attributes.split(';').length];
            }
            return (c >= d ? -1 : 1);
        });
        resource[tag].forEach((item, index) => item.name = `${tag.charAt(0) + tag.substring(1).toLowerCase()}_${(index + 1)}`);
    }
    RESOURCE_STYLE = resource;
    for (const node of NODE_CACHE) {
        const tagName = node.tagName;
        const styleTag = resource[tagName];
        const layoutTag = layout[tagName];
        if (styleTag != null) {
            const styles = [];
            for (const tag of styleTag) {
                if (tag.ids.includes(node.id)) {
                    styles.push(tag.name);
                }
            }
            node.androidStyle = styles.join('.');
            if (node.androidStyle != '') {
                node.appendAttribute(`style="@style/${node.androidStyle}"`);
            }
        }
        if (layoutTag != null) {
            for (const tag in layoutTag) {
                if (layoutTag[tag].includes(node.id)) {
                    node.appendAttribute(tag);
                }
            }
        }
    }
}

function setLinearMargin() {
    for (const node of NODE_CACHE) {
        if (node.isView(LAYOUT_ANDROID.LINEAR)) {
            const children = NODE_CACHE.filter(item => (item.renderParent == node && !item.scrollView && !item.linearExclude));
            if (node.attr('orientation') == 'vertical') {
                let current = node.bounds.top + node.paddingTop;
                children.sort((a, b) => (a.bounds.top > b.bounds.top ? 1 : -1)).forEach(item => {
                    const height = item.bounds.top - current;
                    if (height > 0) {
                        if (item.invisible && item.gridLayout != null) {
                            item = item.gridLayout;
                        }
                        item.replaceAttribute('android:layout_marginTop', Utils.convertToDP(height));
                    }
                    if (item.style == null) {
                        item = item.wrapped;
                    }
                    current = item.bounds.bottom + item.marginBottom;
                });
            }
            else {
                let current = node.bounds.left + node.paddingLeft;
                children.sort((a, b) => (a.bounds.left > b.bounds.left ? 1 : -1)).forEach(item => {
                    const width = item.bounds.left - current;
                    if (width > 0) {
                        if (item.invisible && item.gridLayout != null) {
                            item = item.gridLayout;
                        }
                        item.replaceAttribute('android:layout_marginLeft', Utils.convertToDP(width));
                    }
                    if (item.label != null) {
                        item = item.label;
                    }
                    else if (item.style == null) {
                        item = item.wrapped;
                    }
                    current = item.bounds.right + item.marginRight;
                });
            }
        }
    }
}

function setNodeCache() {
    let elements = document.querySelectorAll('body > *');
    let selector = 'body *';
    for (const i in elements) {
        if (MAPPING_ANDROID[elements[i].tagName] != null) {
            selector = 'body, body *';
            break;
        }
    }
    elements = document.querySelectorAll(selector);
    for (const i in elements) {
        const element = elements[i];
        if (typeof element.getBoundingClientRect == 'function') {
            const bounds = element.getBoundingClientRect();
            if (bounds.width != 0 && bounds.height != 0) {
                const node = new Node(NODE_CACHE.length + 1, element);
                element.cacheData = node;
                NODE_CACHE.push(node);
            }
        }
    }
    for (const node of NODE_CACHE) {
        if (node.scroll.overflow != '') {
            if (node.scroll.width != '') {
                node.element.style.width = '';
            }
            if (node.scroll.height != '') {
                node.element.style.height = '';
            }
            node.element.style.overflow = 'visible';
            node.children.forEach(item => item.scroll.nested = (item.scroll.overflow != ''));
        }
    }
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
                if (child.box.x >= parent.box.x && child.bounds.right <= parent.bounds.right && child.box.y >= parent.box.y && child.bounds.bottom <= parent.bounds.bottom) {
                    child.parent = parent;
                    child.depth = parent.depth + 1;
                    parent.children.push(child);
                }
            }
        }
    }
    for (const node of NODE_CACHE) {
        if (node.scroll.overflow != '') {
            if (node.scroll.width != '') {
                node.element.style.width = node.scroll.width;
            }
            if (node.scroll.height != '') {
                node.element.style.height = node.scroll.height;
            }
            node.element.style.overflow = node.scroll.overflow;
        }
    }
    for (const node of NODE_CACHE) {
        if (node.parent == null) {
            node.parent = { id: 0 };
        }
        node.children.sort((a, b) => {
            let [x, y] = [a.depth, b.depth];
            if (x == y) {
                [x, y] = [a.id, b.id];
            }
            return (x >= y ? 1 : -1);
        });
    }
    NODE_CACHE.sort((a, b) => {
        let [x, y] = [a.depth, b.depth];
        if (x == y) {
            [x, y] = [a.bounds.x, b.bounds.x];
            if (x == y) {
                [x, y] = [a.id, b.id];
            }
        }
        return (x >= y ? 1 : -1);
    });
}

function parseDocument() {
    const mapX = [];
    const mapY = [];
    let output = '<?xml version="1.0" encoding="utf-8"?>\n{0}';
    setStyleMap();
    setNodeCache();
    for (const node of NODE_CACHE) {
        const x = Math.floor(node.bounds.x);
        const y = (node.parent ? node.parent.id : 0);
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
            const axisX = mapX[i][coordsX[j]];
            const axisY = mapY[i][coordsY[j]];
            axisY.sort((a, b) => (a.id > b.id ? 1 : -1));
            for (let k = 0; k < axisY.length; k++) {
                const nodeY = axisY[k];
                if (!nodeY.renderParent) {
                    const parentId = nodeY.parent.id;
                    let tagName = nodeY.widgetName;
                    let xml = '';
                    if (tagName == null) {
                        if (nodeY.children.length > 0) {
                            if (nodeY.children.findIndex(item => item.widgetName != null && (item.depth == nodeY.depth + 1)) == -1) {
                                const nextMapX = mapX[nodeY.depth + 2];
                                const nextCoordsX = (nextMapX ? Object.keys(nextMapX) : []);
                                if (nextCoordsX.length > 1) {
                                    const columnLeft = [];
                                    const columnRight = [];
                                    const columnWeight = [];
                                    let columns = [];
                                    for (let l = 0; l < nextCoordsX.length; l++) {
                                        const nextAxisX = nextMapX[nextCoordsX[l]];
                                        columnLeft[l] = parseInt(nextCoordsX[l]);
                                        columnRight[l] = (l == 0 ? Number.MIN_VALUE : columnRight[l - 1]);
                                        for (let m = 0; m < nextAxisX.length; m++) {
                                            if (nextAxisX[m].parent.parent && nodeY.id == nextAxisX[m].parent.parent.id) {
                                                const bounds = nextAxisX[m].bounds;
                                                if (l == 0 || bounds.left > columnRight[l - 1]) {
                                                    if (columns[l] == null) {
                                                        columns[l] = [];
                                                    }
                                                    columns[l].push(nextAxisX[m]);
                                                }
                                                columnLeft[l] = Math.max(nextAxisX[m].bounds.left, columnLeft[l]);
                                                columnRight[l] = Math.max(nextAxisX[m].bounds.right, columnRight[l]);
                                            }
                                        }
                                    }
                                    for (let l = 0; l < columns.length; l++) {
                                        if (columns[l] != null) {
                                            columnWeight.push((columns[l + (l < columns.length - 1 ? 1 : -1)] != null));
                                        }
                                    }
                                    columns = columns.filter(nodes => nodes);
                                    let columnLength = 0;
                                    for (const nodes of columns) {
                                        nodes.sort((a, b) => {
                                            let [x, y] = [a.box.y, b.box.y];
                                            if (x == y) {
                                                [x, y] = [a.id, b.id];
                                            }
                                            return (x > y ? 1 : -1);
                                        });
                                        columnLength = Math.max(nodes.length, columnLength);
                                    }
                                    for (let l = 0; l < columnLength; l++) {
                                        let y = null;
                                        for (let m = 0; m < columns.length; m++) {
                                            const nodeX = columns[m][l];
                                            if (nodeX != null) {
                                                if (y == null) {
                                                    y = nodeX.linear.y;
                                                }
                                                else if (Utils.withinRange(nodeX.linear.y, y, SETTINGS.boundsOffset)) {
                                                    const nextRowX = columns[m - 1][l + 1];
                                                    if (columns[m][l - 1] == null || (nextRowX && Utils.withinRange(nextRowX.linear.y, nodeX.linear.y, SETTINGS.boundsOffset))) {
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
                                        const columnRender = [];
                                        const rowStart = [];
                                        xml += writeGridTemplate(nodeY, nodeY.depth + nodeY.depthIndent, nodeY.parent, columns.length);
                                        for (let l = 0, count = 0; l < columns.length; l++) {
                                            columnStart[l] = Number.MAX_VALUE;
                                            columnEnd[l] = Number.MIN_VALUE;
                                            let spacer = 0;
                                            for (let m = 0; m < columns[l].length; m++) {
                                                if (columnRender[m] == null) {
                                                    columnRender[m] = new Set();
                                                }
                                                const nodeX = columns[l][m];
                                                if (!nodeX.spacer) {
                                                    columnStart[l] = Math.min(nodeX.bounds.left, columnStart[l]);
                                                    columnEnd[l] = Math.max(nodeX.bounds.right, columnEnd[l]);
                                                    columnRender[m].add(nodeX.parent.id);
                                                    nodeX.previous.depth = nodeX.depth;
                                                    nodeX.depth = nodeY.depth + 1;
                                                    if (nodeX.children.length > 0) {
                                                        const offsetDepth = nodeX.previous.depth - nodeX.depth;
                                                        nodeX.children.forEach(item => item.depth -= offsetDepth);
                                                    }
                                                    nodeX.previous.parent = nodeX.parent;
                                                    nodeX.previous.parentId = nodeX.parent.id;
                                                    nodeX.parent.renderParent = nodeX.parent;
                                                    nodeX.parent.invisible = true;
                                                    nodeX.parent = nodeY;
                                                    nodeX.gridIndex = l;
                                                    let rowSpan = 1;
                                                    let columnSpan = 1 + spacer;
                                                    let spaceSpan = 0;
                                                    for (let n = l + 1; n < columns.length; n++) {
                                                        if (columns[n][m].spacer == 1) {
                                                            if (nodeX.bounds.right == columnRight[l] && nodeX.bounds.right < columnLeft[n]) {
                                                                spaceSpan++;
                                                            }
                                                            else {
                                                                columnSpan++;
                                                            }
                                                            columns[n][m].spacer = 2;
                                                        }
                                                        else {
                                                            break;
                                                        }
                                                    }
                                                    if (columnSpan + spaceSpan == 1) {
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
                                                        nodeX.android.layout_rowSpan = rowSpan;
                                                    }
                                                    if (columnSpan > 1) {
                                                        nodeX.android.layout_columnSpan = columnSpan;
                                                    }
                                                    nodeX.spaceSpan = spaceSpan;
                                                    nodeX.gridRowEnd = (columnSpan + spaceSpan + l == columns.length);
                                                    nodeX.gridFirst = (count++ == 0);
                                                    nodeX.gridLast = (nodeX.gridRowEnd && m == columns[l].length - 1);
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
                                        columnRender.forEach((item, index) => {
                                            const minId = Array.from(item).reduce((a, b) => Math.min(a, b));
                                            let renderId = null;
                                            if (item.size > 1) {
                                                for (let l = 0; l < columns.length; l++) {
                                                    if (!columns[l][index].spacer && columns[l][index].previous.parentId == minId) {
                                                        renderId = columns[l][index].id;
                                                    }
                                                }
                                                for (let l = 0; l < columns.length; l++) {
                                                    if (!columns[l][index].spacer && columns[l][index].id != renderId) {
                                                        columns[l][index].renderAfterId = renderId;
                                                    }
                                                }
                                            }
                                        });
                                        columnEnd[columnEnd.length - 1] = columnRight[columnRight.length - 1];
                                        nodeY.gridColumnStart = columnStart;
                                        nodeY.gridColumnEnd = columnEnd;
                                        nodeY.gridColumnWeight = columnWeight;
                                        nodeY.gridColumnCount = columns.length;
                                    }
                                }
                            }
                            if (!nodeY.renderParent) {
                                const [linearX, linearY] = Node.isLinearXY(nodeY.children.filter(item => (item.depth == nodeY.depth + 1)));
                                if (linearX || linearY) {
                                    if (nodeY.children.length > 1 && linearX && linearY) {
                                        xml += `{${nodeY.id}}`;
                                        nodeY.children.forEach(item => item.depthIndent -= 1);
                                        nodeY.invisible = true;
                                        nodeY.renderParent = nodeY.parent;
                                    }
                                    else {
                                        xml += writeLinearTemplate(nodeY, nodeY.depth + nodeY.depthIndent, nodeY.parent, linearY);
                                    }
                                }
                                else {
                                    xml += writeDefaultTemplate(nodeY, nodeY.depth + nodeY.depthIndent, nodeY.parent);
                                }
                            }
                        }
                        else if (nodeY.element.innerText.trim() != '') {
                            tagName = LAYOUT_ANDROID.TEXT;
                        }
                        else {
                            continue;
                        }
                    }
                    if (!nodeY.renderParent) {
                        const element = nodeY.element;
                        if (nodeY.parent && nodeY.parent.isView(LAYOUT_ANDROID.GRID) && nodeY.previous.parentId) {
                            const prevParent = nodeY.parent.children.find(item => item.id == nodeY.previous.parentId);
                            if (prevParent != null) {
                                const siblings = prevParent.children.filter(item => !item.renderParent && item.bounds.left >= nodeY.bounds.right && item.bounds.right <= nodeY.parent.gridColumnEnd[nodeY.gridIndex]).sort((a, b) => (a.bounds.x >= b.bounds.x ? 1 : -1));
                                if (siblings.length > 0) {
                                    siblings.unshift(nodeY);
                                    const [linearX, linearY] = Node.isLinearXY(siblings);
                                    const node = Node.insertWrapper(NODE_CACHE, nodeY, nodeY.parent, siblings, [0]);
                                    const rowSpan = nodeY.attr('layout_rowSpan');
                                    const columnSpan = nodeY.attr('layout_columnSpan');
                                    node.setAndroidAttributes((linearX || linearY ? LAYOUT_ANDROID.LINEAR : LAYOUT_ANDROID.CONSTRAINT));
                                    if (rowSpan > 1) {
                                        node.attr('layout_rowSpan', rowSpan);
                                        delete nodeY.android.layout_rowSpan;
                                    }
                                    if (columnSpan > 1) {
                                        node.attr('layout_columnSpan', columnSpan);
                                        delete nodeY.android.layout_columnSpan;
                                    }
                                    const renderParent = nodeY.parent;
                                    const template = siblings.map(item => {
                                        if (!item.renderParent) {
                                            const children = item.element.children;
                                            let invisible = false;
                                            if (children.length > 0) {
                                                invisible = true;
                                                for (let l = 0; l < children.length; l++) {
                                                    if (!siblings.includes(children[l].cacheData)) {
                                                        invisible = false;
                                                        break;
                                                    }
                                                }
                                            }
                                            if (invisible) {
                                                item.invisible = true;
                                                item.renderParent = true;
                                                return '';
                                            }
                                            item.parent = node;
                                            item.depthIndent++;
                                            item.autoWrap = true;
                                            node.inheritGridStatus(item);
                                            if (item.children.length > 0) {
                                                return writeDefaultTemplate(item, nodeY.depth + nodeY.depthIndent, node);
                                            }
                                            else {
                                                return writeTagTemplate(item, nodeY.depth + nodeY.depthIndent, node);
                                            }
                                        }
                                        return '';
                                    }).join('');
                                    if (linearX || linearY) {
                                        xml += writeLinearTemplate(node, nodeY.depth + nodeY.depthIndent - 1, renderParent, linearY);
                                    }
                                    else {
                                        xml += writeDefaultTemplate(node, nodeY.depth + nodeY.depthIndent - 1, renderParent);
                                    }
                                    xml = xml.replace(`{${node.id}}`, template);
                                }
                            }
                        }
                        if (!nodeY.renderParent) {
                            xml += writeTagTemplate(nodeY, nodeY.depth + nodeY.depthIndent, nodeY.parent, tagName);
                        }
                    }
                    if (nodeY.spaceSpan > 0) {
                        addRenderAfter(nodeY.id, getSpaceXml(Utils.setIndent(nodeY.depth + nodeY.depthIndent), 'wrap_content', 'wrap_content', nodeY.spaceSpan), 0);
                    }
                    if (xml != '') {
                        if (partial[parentId] == null) {
                            partial[parentId] = [];
                        }
                        if (nodeY.renderAfterId == null) {
                            partial[parentId].push(xml);
                        }
                        else {
                            addRenderAfter(nodeY.renderAfterId, xml);
                        }
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
    for (const id in RENDER_AFTER) {
        output = output.replace(`{:${id}}`, RENDER_AFTER[id].join(''));
    }
    setResourceStyle();
    if (SETTINGS.defaultLayout == LAYOUT_ANDROID.RELATIVE) {
        output = writeRelativeLayout(output);
    }
    setLinearMargin();
    if (SETTINGS.showAttributes) {
        output = writeNodeAttributes(output);
    }
    output = output.replace(/{[:@#]{1}[0-9]+}/g, '');
    return output;
}
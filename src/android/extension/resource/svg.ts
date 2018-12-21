import { BUILD_ANDROID } from '../../lib/enumeration';

import ANIMATEDVECTOR_TMPL from '../../template/resource/animated-vector';
import LAYERLIST_TMPL from '../../template/resource/layer-list';
import VECTOR_TMPL from '../../template/resource/vector';

import Resource from '../../resource';
import View from '../../view';

import { getXmlNs } from '../../lib/util';

import $Svg = androme.lib.base.Svg;
import $SvgAnimate = androme.lib.base.SvgAnimate;
import $SvgAnimateTransform = androme.lib.base.SvgAnimateTransform;
import $SvgBuild = androme.lib.base.SvgBuild;
import $SvgElement = androme.lib.base.SvgElement;
import $SvgGroup = androme.lib.base.SvgGroup;
import $SvgGroupViewBox = androme.lib.base.SvgGroupViewBox;
import $SvgImage = androme.lib.base.SvgImage;
import $SvgPath = androme.lib.base.SvgPath;

import $color = androme.lib.color;
import $dom = androme.lib.dom;
import $svg = androme.lib.svg;
import $util = androme.lib.util;
import $xml = androme.lib.xml;

type AnimateGroup = {
    element: SVGGraphicsElement;
    animate: $SvgAnimate[];
    pathData?: string;
};

type AnimateData = {
    name: string;
    ordering: string;
    objectAnimators: ExternalData[]
};

type PropertyValue = {
    propertyName: string;
    keyframes: KeyFrame[];
};

type KeyFrame = {
    fraction: string;
    value: string;
};

const INTERPOLATOR_ANDROID = {
    ACCELERATE_DECELERATE: '@android:anim/accelerate_decelerate_interpolator',
    ACCELERATE:	'@android:anim/accelerate_interpolator',
    ANTICIPATE:	'@android:anim/anticipate_interpolator',
    ANTICIPATE_OVERSHOOT: '@android:anim/anticipate_overshoot_interpolator',
    BOUNCE:	'@android:anim/bounce_interpolator',
    CYCLE: '@android:anim/cycle_interpolator',
    DECELERATE:	'@android:anim/decelerate_interpolator',
    LINEAR: '@android:anim/linear_interpolator',
    OVERSHOOT: '@android:anim/overshoot_interpolator'
};

function getSvgOffset(element: SVGGraphicsElement) {
    let parent = element.parentElement;
    let x = 0;
    let y = 0;
    while (parent instanceof SVGSVGElement && parent.parentElement instanceof SVGSVGElement) {
        const attributes = $svg.createTransformData(parent);
        x += parent.x.baseVal.value + attributes.translateX;
        y += parent.y.baseVal.value + attributes.translateY;
        parent = parent.parentElement;
    }
    return { x, y };
}

export default class ResourceSvg<T extends View> extends androme.lib.base.Extension<T> {
    public readonly options = {
        vectorAnimateOrdering: 'together',
        vectorAnimateInterpolator: INTERPOLATOR_ANDROID.LINEAR,
        vectorAnimateAlwaysUseKeyframes: true
    };

    public readonly eventOnly = true;

    public beforeInit() {
        this.application.controllerHandler.localSettings.unsupported.tagName.delete('svg');
    }

    public afterResources() {
        for (const node of this.application.processing.cache) {
            if (node.svgElement) {
                const svg = new $Svg(<SVGSVGElement> node.element);
                const namespace = new Set<string>();
                const animateGroup = new Map<string, AnimateGroup>();
                const templateName = `${node.tagName.toLowerCase()}_${node.controlId}`;
                const images: $SvgImage[] = [];
                let drawable = '';
                let vectorName = '';
                const createGroup = (group: $SvgGroup | $SvgElement) => {
                    const name = `group_${group.name}`;
                    const data: ExternalData = {
                        name,
                        '2': []
                    };
                    let x = group instanceof $SvgGroupViewBox ? group.x : 0;
                    let y = group instanceof $SvgGroupViewBox ? group.y : 0;
                    if (group.transformable) {
                        const transform = $svg.createTransformData(group.element);
                        if (transform.operations.length) {
                            x += transform.translateX;
                            y += transform.translateY;
                            if (transform.scaleX !== 1) {
                                data.scaleX = transform.scaleX.toString();
                            }
                            if (transform.scaleY !== 1) {
                                data.scaleY = transform.scaleY.toString();
                            }
                            if (transform.rotateAngle !== 0) {
                                data.rotation = transform.rotateAngle.toString();
                            }
                            let pivotX = transform.rotateOriginX || 0;
                            let pivotY = transform.rotateOriginY || 0;
                            if (transform.origin) {
                                pivotX += transform.origin.x;
                                pivotY += transform.origin.y;
                            }
                            if (pivotX !== 0) {
                                data.pivotX = pivotX.toString();
                            }
                            if (pivotY !== 0) {
                                data.pivotY = pivotY.toString();
                            }
                        }
                    }
                    if (x !== 0) {
                        data.translateX = x.toString();
                    }
                    if (y !== 0) {
                        data.translateY = y.toString();
                    }
                    if (group.animate.length) {
                        animateGroup.set(name, { element: group.element, animate: group.animate });
                    }
                    return data;
                };
                const createPath = (svgElement: $SvgElement, svgPath: $SvgPath) => {
                    const name = svgElement.name;
                    const clipPaths: ExternalData[] = [];
                    if (svgPath.clipPath !== '') {
                        const clipPath = svg.defs.clipPath.get(svgPath.clipPath);
                        if (clipPath) {
                            clipPath.each(child => {
                                if (child.path) {
                                    clipPaths.push({ name: child.name, d: child.path.d });
                                    if (child.animate.length) {
                                        animateGroup.set(child.name, {
                                            element: child.element,
                                            animate: child.animate,
                                            pathData: child.path.d
                                        });
                                    }
                                }
                            });
                        }
                    }
                    const result = Object.assign({}, svgPath, { name, clipPaths });
                    ['fill', 'stroke'].forEach(attr => {
                        if ($util.isString(result[attr])) {
                            if (result[attr].charAt(0) === '@') {
                                const gradient = svg.defs.gradient.get(result[attr]);
                                if (gradient) {
                                    switch (svgElement.element.tagName) {
                                        case 'path':
                                            if (!/[zZ]\s*$/.test(result.d)) {
                                                break;
                                            }
                                        case 'rect':
                                        case 'polygon':
                                        case 'polyline':
                                        case 'circle':
                                        case 'ellipse':
                                            const gradients = Resource.createBackgroundGradient(node, [gradient], result);
                                            result[attr] = [{ gradients }];
                                            namespace.add('aapt');
                                            return;
                                    }
                                }
                                else {
                                    result[attr] = result.color;
                                }
                            }
                            const colorName = Resource.addColor(result[attr]);
                            if (colorName !== '') {
                                result[attr] = `@color/${colorName}`;
                            }
                        }
                    });
                    if (result.fillRule) {
                        switch (result.fillRule) {
                            case 'evenodd':
                                result.fillRule = 'evenOdd';
                                break;
                            default:
                                result.fillRule = 'nonZero';
                                break;
                        }
                    }
                    if (svgElement.animate.length) {
                        animateGroup.set(name, {
                            element: svgElement.element,
                            animate: svgElement.animate,
                            pathData: result.d
                        });
                    }
                    return result;
                };
                if (svg.length) {
                    const opacity = svg.animate.filter(item => item.attributeName === 'opacity');
                    if (opacity.length) {
                        animateGroup.set(svg.name, { element: svg.element, animate: opacity });
                    }
                    let groups: StringMap[] = [];
                    let groupData: ExternalData | undefined;
                    for (let i = 0; i < svg.children.length; i++) {
                        const group = svg.children[i];
                        if (i > 0) {
                            groupData = createGroup(group);
                        }
                        for (const item of group.children) {
                            if (item instanceof $SvgImage) {
                                item.setExternal();
                                images.push(item);
                            }
                            else if (item.visible && item.path) {
                                let newGroup = false;
                                if (i === 0) {
                                    if (item.transformable && !item.path.transformed) {
                                        groupData = createGroup(item);
                                        groups.push(groupData);
                                        newGroup = true;
                                    }
                                    if (groupData === undefined) {
                                        groupData = createGroup(group);
                                        groups.push(groupData);
                                    }
                                }
                                if (groupData) {
                                    groupData['2'].push(createPath(item, item.path));
                                }
                                if (newGroup) {
                                    groupData = undefined;
                                }
                            }
                        }
                        if (i > 0 && groupData) {
                            groups.push(groupData);
                        }
                    }
                    groups = groups.filter(group => group['2'].length > 0);
                    if (groups.length) {
                        let xml = $xml.createTemplate($xml.parseTemplate(VECTOR_TMPL), {
                            namespace: namespace.size ? getXmlNs(...Array.from(namespace)) : '',
                            name: svg.name,
                            width: $util.formatPX(svg.width),
                            height: $util.formatPX(svg.height),
                            viewportWidth: svg.viewBoxWidth > 0 ? svg.viewBoxWidth.toString() : false,
                            viewportHeight: svg.viewBoxHeight > 0 ? svg.viewBoxHeight.toString() : false,
                            alpha: svg.opacity < 1 ? svg.opacity.toString() : false,
                            '1': groups
                        });
                        vectorName = Resource.getStoredName('drawables', xml);
                        if (vectorName === '') {
                            vectorName = templateName + (images.length ? '_vector' : '');
                            Resource.STORED.drawables.set(vectorName, xml);
                        }
                        if (animateGroup.size) {
                            const animateData: ExternalData = {
                                vectorName,
                                '1': []
                            };
                            for (const [name, group] of animateGroup.entries()) {
                                const animate: AnimateData = {
                                    name,
                                    ordering: $dom.getDataSet(group.element, 'android').ordering || this.options.vectorAnimateOrdering,
                                    objectAnimators: []
                                };
                                const animatorMap = new Map<string, PropertyValue[]>();
                                for (const item of group.animate) {
                                    const dataset = $dom.getDataSet(item.element, 'android');
                                    const startOffset = item.begin !== -1 ? item.begin : 0;
                                    let propertyName: string[] | undefined;
                                    let values: string[] | Null<number>[][] | undefined;
                                    let duration: number | undefined;
                                    let repeatCount = 0;
                                    if (item.duration !== -1) {
                                        duration = item.duration;
                                        if (item.repeatCount !== undefined && item.repeatDuration !== undefined) {
                                            if (item.repeatCount === -1 && item.repeatDuration === -1) {
                                                repeatCount = -1;
                                            }
                                            else if (item.repeatCount !== -1 && item.repeatDuration !== -1) {
                                                if (item.repeatCount * duration <= item.repeatDuration) {
                                                    repeatCount = item.repeatCount;
                                                }
                                                else {
                                                    repeatCount = Math.round(item.repeatDuration / duration);
                                                }
                                            }
                                            else if (item.repeatDuration !== -1) {
                                                repeatCount = Math.round(item.repeatDuration / duration);
                                            }
                                            else {
                                                repeatCount = item.repeatCount;
                                            }
                                        }
                                        else if (item.repeatCount !== undefined) {
                                            repeatCount = item.repeatCount;
                                        }
                                        else if (item.repeatDuration !== undefined) {
                                            repeatCount = Math.round(item.repeatDuration / duration);
                                        }
                                    }
                                    else if (item.repeatDuration !== undefined) {
                                        duration = item.repeatDuration;
                                    }
                                    const options: ExternalData = {
                                        startOffset: startOffset !== 0 ? startOffset.toString() : '',
                                        duration: duration !== undefined ? duration.toString() : '',
                                        repeatCount: repeatCount.toString(),
                                        interpolator: dataset.interpolator ? INTERPOLATOR_ANDROID[dataset.interpolator] || dataset.interpolator : this.options.vectorAnimateInterpolator,
                                        repeatMode: '',
                                        fillAfter: '',
                                        fillBefore: '',
                                        fillEnabled: ''
                                    };
                                    if (item instanceof $SvgAnimateTransform) {
                                        switch (item.attributeName) {
                                            case 'transform': {
                                                switch (item.type) {
                                                    case SVGTransform.SVG_TRANSFORM_ROTATE: {
                                                        values = $SvgAnimateTransform.toRotateList(item.values);
                                                        propertyName = ['rotation', 'pivotX', 'pivotY'];
                                                        break;
                                                    }
                                                    case SVGTransform.SVG_TRANSFORM_SCALE: {
                                                        values = $SvgAnimateTransform.toScaleList(item.values);
                                                        propertyName = ['scaleX', 'scaleY'];
                                                        break;
                                                    }
                                                    case SVGTransform.SVG_TRANSFORM_TRANSLATE: {
                                                        values = $SvgAnimateTransform.toTranslateList(item.values);
                                                        propertyName = ['translateX', 'translateY'];
                                                        break;
                                                    }
                                                }
                                                options.valueType = 'floatType';
                                                break;
                                            }
                                        }
                                    }
                                    else {
                                        switch (item.attributeName) {
                                            case 'stroke':
                                            case 'fill':
                                                break;
                                            case 'opacity':
                                            case 'stroke-opacity':
                                            case 'fill-opacity':
                                                options.valueType = 'floatType';
                                                break;
                                            case 'stroke-width':
                                                options.valueType = 'intType';
                                                break;
                                            case 'd':
                                            case 'x':
                                            case 'x1':
                                            case 'x2':
                                            case 'cx':
                                            case 'y':
                                            case 'y1':
                                            case 'y2':
                                            case 'cy':
                                            case 'r':
                                            case 'rx':
                                            case 'ry':
                                            case 'width':
                                            case 'height':
                                            case 'points':
                                                options.valueType = 'pathType';
                                                break;
                                            default:
                                                continue;
                                        }
                                        switch (options.valueType) {
                                            case 'intType': {
                                                values = item.values.map(value => $util.convertInt(value).toString());
                                                switch (item.attributeName) {
                                                    case 'stroke-width':
                                                        propertyName = ['strokeWidth'];
                                                        break;
                                                }
                                                break;
                                            }
                                            case 'floatType': {
                                                values = item.values.map(value => $util.convertFloat(value).toString());
                                                switch (item.attributeName) {
                                                    case 'opacity':
                                                        propertyName = ['alpha'];
                                                        break;
                                                    case 'stroke-opacity':
                                                        propertyName = ['strokeAlpha'];
                                                        break;
                                                    case 'fill-opacity':
                                                        propertyName = ['fillAlpha'];
                                                        break;
                                                }
                                                break;
                                            }
                                            case 'pathType': {
                                                if (group.pathData) {
                                                    pathType: {
                                                        values = item.values.slice();
                                                        if (item.attributeName === 'points') {
                                                            for (let i = 0; i < values.length; i++) {
                                                                const value = values[i];
                                                                if (value !== '') {
                                                                    const points = $SvgBuild.fromCoordinateList($SvgBuild.toCoordinateList(value));
                                                                    if (points.length) {
                                                                        values[i] = item.parentElement.tagName === 'polygon' ? $SvgPath.getPolygon(points) : $SvgPath.getPolyline(points);
                                                                    }
                                                                    else {
                                                                        break pathType;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        else if (item.attributeName !== 'd') {
                                                            for (let i = 0; i < values.length; i++) {
                                                                const value = values[i];
                                                                if (value !== '') {
                                                                    const pathPoints = $SvgBuild.toPathCommandList(group.pathData);
                                                                    if (pathPoints.length <= 1) {
                                                                        break pathType;
                                                                    }
                                                                    let x: number | undefined;
                                                                    let y: number | undefined;
                                                                    let rx: number | undefined;
                                                                    let ry: number | undefined;
                                                                    let width: number | undefined;
                                                                    let height: number | undefined;
                                                                    switch (item.attributeName) {
                                                                        case 'x':
                                                                        case 'x1':
                                                                        case 'x2':
                                                                        case 'cx':
                                                                            x = parseFloat(value);
                                                                            if (isNaN(x)) {
                                                                                break pathType;
                                                                            }
                                                                            break;
                                                                        case 'y':
                                                                        case 'y1':
                                                                        case 'y2':
                                                                        case 'cy':
                                                                            y = parseFloat(value);
                                                                            if (isNaN(y)) {
                                                                                break pathType;
                                                                            }
                                                                            break;
                                                                        case 'r':
                                                                            rx = parseFloat(value);
                                                                            if (isNaN(rx)) {
                                                                                break pathType;
                                                                            }
                                                                            ry = rx;
                                                                            break;
                                                                        case 'rx':
                                                                            rx = parseFloat(value);
                                                                            if (isNaN(rx)) {
                                                                                break pathType;
                                                                            }
                                                                            break;
                                                                        case 'ry':
                                                                            ry = parseFloat(value);
                                                                            if (isNaN(ry)) {
                                                                                break pathType;
                                                                            }
                                                                        case 'width':
                                                                            width = parseFloat(value);
                                                                            if (isNaN(width) || width < 0) {
                                                                                break pathType;
                                                                            }
                                                                            break;
                                                                        case 'height':
                                                                            height = parseFloat(value);
                                                                            if (isNaN(height) || height < 0) {
                                                                                break pathType;
                                                                            }
                                                                            break;
                                                                    }
                                                                    if (x !== undefined || y !== undefined) {
                                                                        const commandStart = pathPoints[0];
                                                                        const commandEnd = pathPoints[pathPoints.length - 1];
                                                                        const [firstPoint, lastPoint] = [commandStart.points[0], commandEnd.points[commandEnd.points.length - 1]];
                                                                        let recalibrate = false;
                                                                        if (x !== undefined) {
                                                                            switch (item.attributeName) {
                                                                                case 'x':
                                                                                    x -= firstPoint.x;
                                                                                    recalibrate = true;
                                                                                    break;
                                                                                case 'x1':
                                                                                case 'cx':
                                                                                    firstPoint.x = x;
                                                                                    commandStart.coordinates[0] = x;
                                                                                    break;
                                                                                case 'x2':
                                                                                    lastPoint.x = x;
                                                                                    commandEnd.coordinates[0] = x;
                                                                                    break;
                                                                            }
                                                                        }
                                                                        if (y !== undefined) {
                                                                            switch (item.attributeName) {
                                                                                case 'y':
                                                                                    y -= firstPoint.y;
                                                                                    recalibrate = true;
                                                                                    break;
                                                                                case 'y1':
                                                                                case 'cy':
                                                                                    firstPoint.y = y;
                                                                                    commandStart.coordinates[1] = y;
                                                                                    break;
                                                                                case 'y2':
                                                                                    lastPoint.y = y;
                                                                                    commandEnd.coordinates[1] = y;
                                                                                    break;
                                                                            }
                                                                        }
                                                                        if (recalibrate) {
                                                                            for (const path of pathPoints) {
                                                                                if (!path.relative) {
                                                                                    for (let j = 0, k = 0; j < path.coordinates.length; j += 2, k++) {
                                                                                        const pt = path.points[k];
                                                                                        if (x !== undefined) {
                                                                                            path.coordinates[j] += x;
                                                                                            pt.x += x;
                                                                                        }
                                                                                        if (y !== undefined) {
                                                                                            path.coordinates[j + 1] += y;
                                                                                            pt.y += y;
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                    else if (rx !== undefined || ry !== undefined) {
                                                                        for (const path of pathPoints) {
                                                                            if (path.command.toUpperCase() === 'A') {
                                                                                if (rx !== undefined) {
                                                                                    path.radiusX = rx;
                                                                                    path.coordinates[0] = rx * 2 * (path.coordinates[0] < 0 ? -1 : 1);
                                                                                }
                                                                                if (ry !== undefined) {
                                                                                    path.radiusY = ry;
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                    else if (width !== undefined || height !== undefined) {
                                                                        for (const path of pathPoints) {
                                                                            switch (path.command) {
                                                                                case 'h':
                                                                                    if (width !== undefined) {
                                                                                        path.coordinates[0] = width * (path.coordinates[0] < 0 ? -1 : 1);
                                                                                    }
                                                                                    break;
                                                                                case 'v':
                                                                                    if (height !== undefined) {
                                                                                        path.coordinates[1] = height;
                                                                                    }
                                                                                    break;
                                                                            }
                                                                        }
                                                                    }
                                                                    else {
                                                                        values[i] = values[i - 1] || group.pathData;
                                                                        continue;
                                                                    }
                                                                    values[i] = $SvgBuild.fromPathCommandList(pathPoints);
                                                                }
                                                            }
                                                        }
                                                        propertyName = ['pathData'];
                                                    }
                                                }
                                                break;
                                            }
                                            default: {
                                                values = item.values.slice();
                                                switch (item.attributeName) {
                                                    case 'fill':
                                                        propertyName = ['fillColor'];
                                                    case 'stroke':
                                                        propertyName = ['strokeColor'];
                                                        break;
                                                }
                                                if (propertyName) {
                                                    for (let i = 0; i < values.length; i++) {
                                                        const color = $color.parseRGBA(values[i]);
                                                        if (color) {
                                                            values[i] = `@color/${Resource.addColor(color)}`;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (propertyName && values) {
                                        const keyName = JSON.stringify(options);
                                        for (let i = 0; i < propertyName.length; i++) {
                                            if (node.localSettings.targetAPI >= BUILD_ANDROID.MARSHMALLOW && item.keyTimes.length > 1 && (this.options.vectorAnimateAlwaysUseKeyframes || item.keyTimes.join('-') !== '0-1')) {
                                                const propertyValues: PropertyValue[] = animatorMap.get(keyName) || [];
                                                const keyframes: KeyFrame[] = [];
                                                for (let j = 0; j < item.keyTimes.length; j++) {
                                                    let value: string | undefined;
                                                    if (Array.isArray(values[j])) {
                                                        const fromTo = values[j][i];
                                                        if (fromTo !== undefined) {
                                                            value = fromTo !== null ? fromTo.toString() : '';
                                                        }
                                                    }
                                                    else {
                                                        value = values[j].toString();
                                                    }
                                                    if (value !== undefined) {
                                                        keyframes.push({
                                                            fraction: value !== '' ? item.keyTimes[j].toString() : '',
                                                            value
                                                        });
                                                    }
                                                }
                                                propertyValues.push({ propertyName: propertyName[i], keyframes });
                                                if (!animatorMap.has(keyName)) {
                                                    animatorMap.set(keyName, propertyValues);
                                                    options.propertyValues = propertyValues;
                                                    animate.objectAnimators.push(options);
                                                }
                                            }
                                            else {
                                                options.propertyName = propertyName[i];
                                                if (Array.isArray(values[0])) {
                                                    if (values.length > 1) {
                                                        const from = values[0][i];
                                                        if (from !== null) {
                                                            options.valueFrom = from.toString();
                                                        }
                                                    }
                                                    const to = values[values.length - 1][i];
                                                    if (to !== null) {
                                                        options.valueTo = to.toString();
                                                    }
                                                }
                                                else {
                                                    if (values.length > 1) {
                                                        options.valueFrom = values[0].toString();
                                                    }
                                                    options.valueTo = values[values.length - 1].toString();
                                                }
                                                options.propertyValues = false;
                                                animate.objectAnimators.push(options);
                                            }
                                        }
                                    }
                                }
                                if (animate.objectAnimators.length) {
                                    animateData['1'].push(animate);
                                }
                            }
                            if (animateData['1'].length) {
                                xml = $xml.createTemplate($xml.parseTemplate(ANIMATEDVECTOR_TMPL), animateData);
                                vectorName = Resource.getStoredName('drawables', xml);
                                if (vectorName === '') {
                                    vectorName = `${templateName}_animated${images.length ? '_vector' : ''}`;
                                    Resource.STORED.drawables.set(vectorName, xml);
                                }
                            }
                        }
                    }
                }
                if (images.length) {
                    const rotate: ExternalData = [];
                    const normal: ExternalData = [];
                    for (const item of images) {
                        const scaleX = svg.width / svg.viewBoxWidth;
                        const scaleY = svg.height / svg.viewBoxHeight;
                        let x = (item.x || 0) * scaleX;
                        let y = (item.y || 0) * scaleY;
                        item.width *= scaleX;
                        item.height *= scaleY;
                        const offsetParent = getSvgOffset(item.element);
                        x += offsetParent.x;
                        y += offsetParent.y;
                        const data: ExternalData = {
                            width: item.width > 0 ? $util.formatPX(item.width) : '',
                            height: item.height > 0 ? $util.formatPX(item.height) : '',
                            left: x !== 0 ? $util.formatPX(x) : '',
                            top: y !== 0 ? $util.formatPX(y) : '',
                            src: Resource.addImage({ mdpi: item.uri })
                        };
                        const transform = $svg.createTransformData(item.element);
                        if (transform.rotateAngle !== 0) {
                            data.fromDegrees = transform.rotateAngle.toString();
                            data.visible = item.visible ? 'true' : 'false';
                            rotate.push(data);
                        }
                        else {
                            normal.push(data);
                        }
                    }
                    const xml = $xml.createTemplate($xml.parseTemplate(LAYERLIST_TMPL), {
                        '1': false,
                        '2': false,
                        '3': [{ vectorName }],
                        '4': rotate,
                        '5': normal,
                        '6': false,
                        '7': false
                    });
                    drawable = Resource.getStoredName('drawables', xml);
                    if (drawable === '') {
                        drawable = templateName;
                        Resource.STORED.drawables.set(drawable, xml);
                    }
                }
                else {
                    drawable = vectorName;
                }
                if (drawable !== '') {
                    node.android('src', `@drawable/${drawable}`);
                }
                if (!node.hasWidth) {
                    node.android('layout_width', 'wrap_content');
                }
                if (!node.hasHeight) {
                    node.android('layout_height', 'wrap_content');
                }
            }
        }
    }

    public afterFinalize() {
        this.application.controllerHandler.localSettings.unsupported.tagName.add('svg');
    }
}
import { parseRGBA } from '../lib/color';
import { cssAttribute } from '../lib/dom';
import { applyMatrixX, applyMatrixY, getRadiusY } from '../lib/svg';
import { flatMap, isNumber } from '../lib/util';

const NAME_GRAPHICS: ObjectMap<number> = {};

export default class SvgBuild implements androme.lib.base.SvgBuild {
    public static setName(element: SVGGraphicsElement) {
        let result = '';
        let tagName: string | undefined;
        if (element.id) {
            if (NAME_GRAPHICS[element.id] === undefined) {
                result = element.id;
            }
            tagName = element.id;
        }
        else {
            tagName = element.tagName;
        }
        if (NAME_GRAPHICS[tagName] === undefined) {
            NAME_GRAPHICS[tagName] = 0;
        }
        return result !== '' ? result : `${tagName}_${++NAME_GRAPHICS[tagName]}`;
    }

    public static applyTransforms(transform: SVGTransformList, points: Point[], origin?: Point) {
        const result: Point[] = [];
        for (const pt of points) {
            result.push({ x: pt.x, y: pt.y });
        }
        for (let i = transform.numberOfItems - 1; i >= 0; i--) {
            const item = transform.getItem(i);
            let x1 = 0;
            let y1 = 0;
            let x2 = 0;
            let y2 = 0;
            let x3 = 0;
            let y3 = 0;
            if (origin) {
                switch (item.type) {
                    case SVGTransform.SVG_TRANSFORM_SCALE:
                        x1 += origin.x;
                        y2 += origin.y;
                        break;
                    case SVGTransform.SVG_TRANSFORM_SKEWX:
                        y1 -= origin.y;
                        break;
                    case SVGTransform.SVG_TRANSFORM_SKEWY:
                        x2 -= origin.x;
                        break;
                    case SVGTransform.SVG_TRANSFORM_ROTATE:
                        x2 -= origin.x;
                        y1 -= origin.y;
                        x3 = origin.x + getRadiusY(item.angle, origin.x);
                        y3 = origin.y + getRadiusY(item.angle, origin.y);
                        break;
                }
            }
            for (const pt of result) {
                const x = pt.x;
                const y = pt.y;
                pt.x = applyMatrixX(item.matrix, x + x1, y + y1) + x3;
                pt.y = applyMatrixY(item.matrix, x + x2, y + y2) + y3;
            }
        }
        return result;
    }

    public static toPointList(points: SVGPointList) {
        const result: Point[] = [];
        for (let j = 0; j < points.numberOfItems; j++) {
            const pt = points.getItem(j);
            result.push({ x: pt.x, y: pt.y });
        }
        return result;
    }

    public static toFractionList(value: string, delimiter = ';') {
        let previousFraction = -1;
        const result = flatMap(value.split(delimiter), segment => {
            const fraction = parseFloat(segment);
            if (!isNaN(fraction) && fraction <= 1 && (previousFraction === -1 || fraction > previousFraction)) {
                previousFraction = fraction;
                return fraction;
            }
            return -1;
        });
        return result.length > 1 && result.some(percent => percent !== -1) && result[0] === 0 ? result : [];
    }

    public static toClipPathList(element: SVGClipPathElement) {
        const result: androme.lib.base.SvgPath[] = [];
        for (const item of Array.from(element.children)) {
            if (item instanceof SVGGraphicsElement) {
                const path = new androme.lib.base.SvgPath(item);
                if (path.d !== '') {
                    result.push(path);
                }
            }
        }
        return result;
    }

    public static toCoordinateList(value: string) {
        const result: number[] = [];
        const pattern = /-?[\d.]+/g;
        let digit: RegExpExecArray | null;
        while ((digit = pattern.exec(value)) !== null) {
            const digitValue = parseFloat(digit[0]);
            if (!isNaN(digitValue)) {
                result.push(digitValue);
            }
        }
        return result;
    }

    public static toPathCommandList(value: string) {
        const result: SvgPathCommand[] = [];
        const patternCommand = /([A-Za-z])([^A-Za-z]+)?/g;
        let command: RegExpExecArray | null;
        value = value.trim();
        while ((command = patternCommand.exec(value)) !== null) {
            if (result.length === 0 && command[1].toUpperCase() !== 'M') {
                break;
            }
            command[2] = (command[2] || '').trim();
            const coordinates = this.toCoordinateList(command[2]);
            const previous = result[result.length - 1] as SvgPathCommand | undefined;
            const previousCommand = previous ? previous.command.toUpperCase() : '';
            const previousPoint = previous ? previous.points[previous.points.length - 1] : undefined;
            let radiusX: number | undefined;
            let radiusY: number | undefined;
            let xAxisRotation: number | undefined;
            let largeArcFlag: number | undefined;
            let sweepFlag: number | undefined;
            switch (command[1].toUpperCase()) {
                case 'M':
                case 'L':
                    if (coordinates.length >= 2) {
                        coordinates.length = 2;
                        break;
                    }
                    else {
                        continue;
                    }
                case 'H':
                    if (previousPoint && coordinates.length) {
                        coordinates[1] = command[1] === 'h' ? 0 : previousPoint.y;
                        coordinates.length = 2;
                        break;
                    }
                    else {
                        continue;
                    }
                case 'V':
                    if (previousPoint && coordinates.length) {
                        const y = coordinates[0];
                        coordinates[0] = command[1] === 'v' ? 0 : previousPoint.x;
                        coordinates[1] = y;
                        coordinates.length = 2;
                        break;
                    }
                    else {
                        continue;
                    }
                case 'Z':
                    if (result.length) {
                        coordinates.push(...result[0].coordinates);
                        command[1] = 'Z';
                        break;
                    }
                    else {
                        continue;
                    }
                case 'C':
                    if (coordinates.length >= 6) {
                        coordinates.length = 6;
                        break;
                    }
                    else {
                        continue;
                    }
                case 'S':
                    if (coordinates.length >= 4 && (previousCommand === 'C' || previousCommand === 'S')) {
                        coordinates.length = 4;
                        break;
                    }
                    else {
                        continue;
                    }
                case 'Q':
                    if (coordinates.length >= 4) {
                        coordinates.length = 4;
                        break;
                    }
                    else {
                        continue;
                    }
                case 'T':
                    if (coordinates.length >= 2 && (previousCommand === 'Q' || previousCommand === 'T')) {
                        coordinates.length = 2;
                        break;
                    }
                    else {
                        continue;
                    }
                case 'A':
                    if (coordinates.length >= 7) {
                        [radiusX, radiusY, xAxisRotation, largeArcFlag, sweepFlag] = coordinates.splice(0, 5);
                        coordinates.length = 2;
                        break;
                    }
                    else {
                        continue;
                    }
                default:
                    continue;
            }
            if (coordinates.length > 1) {
                const points: Point[] = [];
                const relative = /[a-z]/.test(command[1]);
                for (let i = 0; i < coordinates.length; i += 2) {
                    let x = coordinates[i];
                    let y = coordinates[i + 1];
                    if (relative && previousPoint) {
                        x += previousPoint.x;
                        y += previousPoint.y;
                    }
                    points.push({ x, y });
                }
                result.push({
                    command: command[1],
                    relative,
                    coordinates,
                    points,
                    radiusX,
                    radiusY,
                    xAxisRotation,
                    largeArcFlag,
                    sweepFlag
                });
            }
        }
        return result;
    }

    public static toColorStopList(element: SVGGradientElement) {
        const result: ColorStop[] = [];
        for (const stop of Array.from(element.getElementsByTagName('stop'))) {
            const color = parseRGBA(cssAttribute(stop, 'stop-color'), cssAttribute(stop, 'stop-opacity'));
            if (color && color.visible) {
                result.push({
                    color: color.valueRGBA,
                    offset: cssAttribute(stop, 'offset'),
                    opacity: color.alpha
                });
            }
        }
        return result;
    }

    public static toAnimateList(element: SVGGraphicsElement) {
        const result: SvgAnimate[] = [];
        for (let i = 0; i < element.children.length; i++) {
            const item = element.children[i];
            if (item instanceof SVGAnimateElement) {
                const animate = <SvgAnimateTransform> {
                    parentElement: element,
                    element: item,
                    attributeName: '',
                    from: '',
                    to: '',
                    by: '',
                    values: [],
                    keyTimes: [],
                    duration: 0,
                    durationMS: 0,
                    repeatCount: 1,
                    calcMode: 'linear',
                    additive: false,
                    accumulate: false,
                    freeze: false
                };
                const attributeName = item.attributes.getNamedItem('attributeName');
                if (attributeName) {
                    animate.attributeName = attributeName.value.trim();
                }
                const values = item.attributes.getNamedItem('values');
                if (values) {
                    animate.values.push(...flatMap(values.value.split(';'), value => value.trim()));
                    if (animate.values.length > 1) {
                        animate.from = animate.values[0];
                        animate.to = animate.values[animate.values.length - 1];
                        const keyTimes = item.attributes.getNamedItem('keyTimes');
                        if (keyTimes) {
                            const times = this.toFractionList(keyTimes.value);
                            if (times.length === animate.values.length) {
                                animate.keyTimes.push(...times);
                            }
                        }
                    }
                }
                else {
                    const to = item.attributes.getNamedItem('to');
                    if (to) {
                        const from = item.attributes.getNamedItem('from');
                        if (from) {
                            animate.from = from.value.trim();
                        }
                        animate.to = to.value.trim();
                        animate.values.push(animate.from, animate.to);
                        animate.keyTimes.push(0, 1);
                        const by = item.attributes.getNamedItem('by');
                        if (by) {
                            animate.by = by.value.trim();
                        }
                    }
                }
                const dur = item.attributes.getNamedItem('dur');
                if (dur) {
                    if (/\d+ms$/.test(dur.value)) {
                        animate.durationMS = parseInt(dur.value);
                    }
                    else if (/\d+s$/.test(dur.value)) {
                        animate.duration = parseInt(dur.value);
                    }
                    else if (/\d+min$/.test(dur.value)) {
                        animate.duration = parseInt(dur.value) * 60;
                    }
                    else if (/\d+(.\d+)?h$/.test(dur.value)) {
                        animate.duration = parseFloat(dur.value) * 60 * 60;
                    }
                    else {
                        const match = /^(?:(\d?\d):)?(?:(\d?\d):)?(\d?\d)\.?(\d?\d?\d)?$/.exec(dur.value);
                        if (match) {
                            if (match[1]) {
                                animate.duration += parseInt(match[1]) * 60 * 60;
                            }
                            if (match[2]) {
                                animate.duration += parseInt(match[2]) * 60;
                            }
                            if (match[3]) {
                                animate.duration += parseInt(match[3]);
                            }
                            if (match[4]) {
                                animate.durationMS = parseInt(match[4]) * (match[4].length < 3 ? Math.pow(10, 3 - match[4].length) : 1);
                            }
                        }
                    }
                }
                const repeatCount = item.attributes.getNamedItem('repeatCount');
                if (repeatCount) {
                    if (repeatCount.value === 'indefinite') {
                        animate.repeatCount = -1;
                    }
                    else {
                        const value = parseInt(repeatCount.value);
                        if (!isNaN(value)) {
                            animate.repeatCount = value;
                        }
                    }
                }
                const calcMode = item.attributes.getNamedItem('calcMode');
                if (calcMode) {
                    switch (calcMode.value) {
                        case 'discrete':
                        case 'linear':
                        case 'paced':
                        case 'spline':
                            animate.calcMode = calcMode.value;
                            break;
                    }
                }
                const additive = item.attributes.getNamedItem('additive');
                if (additive) {
                    animate.additive = additive.value === 'sum';
                }
                const accumulate = item.attributes.getNamedItem('accumulate');
                if (accumulate) {
                    animate.accumulate = accumulate.value === 'sum';
                }
                const fill = item.attributes.getNamedItem('fill');
                if (fill) {
                    animate.freeze = fill.value === 'freeze';
                }
                if (item instanceof SVGAnimateTransformElement) {
                    const type = item.attributes.getNamedItem('type');
                    if (type) {
                        switch (type.value) {
                            case 'translate':
                                animate.type = SVGTransform.SVG_TRANSFORM_TRANSLATE;
                                break;
                            case 'scale':
                                animate.type = SVGTransform.SVG_TRANSFORM_SCALE;
                                break;
                            case 'rotate':
                                animate.type = SVGTransform.SVG_TRANSFORM_ROTATE;
                                break;
                            case 'skewX':
                                animate.type = SVGTransform.SVG_TRANSFORM_SKEWX;
                                break;
                            case 'skewY':
                                animate.type = SVGTransform.SVG_TRANSFORM_SKEWY;
                                break;
                        }
                    }
                    const path = item.attributes.getNamedItem('path');
                    if (path) {
                        animate.path = path.value.trim();
                    }
                    const rotate = item.attributes.getNamedItem('rotate');
                    if (rotate && (rotate.value === 'auto' || rotate.value === 'auto-reverse' || isNumber(rotate.value))) {
                        animate.rotate = rotate.value.trim();
                    }
                    if (animate.keyTimes.length) {
                        const keyPoints = item.attributes.getNamedItem('keyPoints');
                        if (keyPoints) {
                            const points = this.toFractionList(keyPoints.value);
                            if (points.length === animate.keyTimes.length) {
                                animate.keyPoints = points;
                            }
                        }
                    }
                }
                result.push(animate);
            }
        }
        return result;
    }

    public static fromCoordinateList(coordinates: number[]) {
        const result: Point[] = [];
        for (let i = 0; i < coordinates.length; i += 2) {
            result.push({ x: coordinates[i], y: coordinates[i + 1] });
        }
        return result.length % 2 === 0 ? result : [];
    }

    public static fromPathCommandList(commands: SvgPathCommand[]) {
        let result = '';
        for (const item of commands) {
            result += (result !== '' ? ' ' : '') + item.command;
            switch (item.command.toUpperCase()) {
                case 'M':
                case 'L':
                case 'C':
                case 'S':
                case 'Q':
                case 'T':
                    result += item.coordinates.join(',');
                    break;
                case 'H':
                    result += item.coordinates[0];
                    break;
                case 'V':
                    result += item.coordinates[1];
                    break;
                case 'A':
                    result += `${item.radiusX},${item.radiusY},${item.xAxisRotation},${item.largeArcFlag},${item.sweepFlag},${item.coordinates.join(',')}`;
                    break;
            }
        }
        return result;
    }

}
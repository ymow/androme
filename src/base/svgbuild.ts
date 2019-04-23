import { parseColor } from '../lib/color';
import { cssAttribute } from '../lib/dom';
import { applyMatrixX, applyMatrixY, getRadiusY } from '../lib/svg';

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

    public static createColorStops(element: SVGGradientElement) {
        const result: ColorStop[] = [];
        for (const stop of Array.from(element.getElementsByTagName('stop'))) {
            const color = parseColor(cssAttribute(stop, 'stop-color'), cssAttribute(stop, 'stop-opacity'));
            if (color && color.visible) {
                result.push({
                    color: color.valueAsRGBA,
                    offset: cssAttribute(stop, 'offset'),
                    opacity: color.alpha
                });
            }
        }
        return result;
    }

    public static fromCoordinateList(values: number[]) {
        const result: Point[] = [];
        for (let i = 0; i < values.length; i += 2) {
            result.push({ x: values[i], y: values[i + 1] });
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
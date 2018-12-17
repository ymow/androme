import { cssAttribute, getStyle } from './dom';
import { parseRGBA } from './color';
import { convertInt, convertPX, isPercent, isUnit } from './util';

export function createColorStop(element: SVGGradientElement) {
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

export function createTransformSingle(element: SVGGraphicsElement) {
    const data: SvgTransformAttributes = {
        operations: [],
        translateX: 0,
        translateY: 0,
        scaleX: 1,
        scaleY: 1,
        rotateAngle: 0,
        skewX: 0,
        skewY: 0,
        origin: getTransformOrigin(element)
    };
    for (let i = 0; i < element.transform.baseVal.numberOfItems; i++) {
        const item = element.transform.baseVal.getItem(i);
        if (!data.operations.includes(item.type)) {
            switch (item.type) {
                case SVGTransform.SVG_TRANSFORM_TRANSLATE:
                    if (item.matrix.e !== 0 || item.matrix.f !== 0) {
                        data.translateX = item.matrix.e;
                        data.translateY = item.matrix.f;
                        data.operations.push(item.type);
                    }
                    break;
                case SVGTransform.SVG_TRANSFORM_SCALE:
                    if (item.matrix.a !== 1 || item.matrix.d !== 1) {
                        data.scaleX = item.matrix.a;
                        data.scaleY = item.matrix.d;
                        data.operations.push(item.type);
                    }
                    break;
                case SVGTransform.SVG_TRANSFORM_ROTATE:
                    if (item.angle !== 0) {
                        data.rotateAngle = item.angle;
                        const namedItem = element.attributes.getNamedItem('transform');
                        if (namedItem && namedItem.nodeValue) {
                            const match = /rotate\((\d+), (\d+), (\d+)\)/.exec(namedItem.nodeValue);
                            if (match) {
                                data.rotateOriginX = parseInt(match[2]);
                                data.rotateOriginY = parseInt(match[3]);
                            }
                        }
                        data.matrixRotate = item.matrix;
                        data.operations.push(item.type);
                    }
                    break;
                case SVGTransform.SVG_TRANSFORM_SKEWX:
                    if (item.angle !== 0) {
                        data.skewX += item.angle;
                        data.matrixSkewX = item.matrix;
                        data.operations.push(item.type);
                    }
                    break;
                case SVGTransform.SVG_TRANSFORM_SKEWY:
                    if (item.angle !== 0) {
                        data.skewY += item.angle;
                        data.matrixSkewY = item.matrix;
                        data.operations.push(item.type);
                    }
                    break;
            }
        }
    }
    return data;
}

export function getTransformOrigin(element: SVGGraphicsElement, dpi = 0) {
    const value = cssAttribute(element, 'transform-origin');
    if (value !== '') {
        let width: number;
        let height: number;
        const parent = element.parentElement;
        if (parent instanceof SVGSVGElement) {
            width = parent.viewBox.baseVal.width;
            height = parent.viewBox.baseVal.height;
        }
        else if (parent instanceof SVGGElement && parent.viewportElement instanceof SVGSVGElement) {
            width = parent.viewportElement.viewBox.baseVal.width;
            height = parent.viewportElement.viewBox.baseVal.height;
        }
        else {
            return undefined;
        }
        let positions = value.split(' ');
        if (positions.length === 1) {
            positions.push('center');
        }
        positions = positions.slice(0, 2);
        const origin: Point = { x: null as any, y: null as any };
        if (positions.includes('left')) {
            origin.x = 0;
        }
        else if (positions.includes('right')) {
            origin.x = width;
        }
        if (positions.includes('top')) {
            origin.y = 0;
        }
        else if (positions.includes('bottom')) {
            origin.y = height;
        }
        ['x', 'y'].forEach(attr => {
            if (origin[attr] === null) {
                for (let i = 0; i < positions.length; i++) {
                    let position = positions[i];
                    if (position !== '') {
                        if (position === 'center') {
                            position = '50%';
                        }
                        if (isUnit(position)) {
                            origin[attr] = parseInt(position.endsWith('px') ? position : convertPX(position, dpi, convertInt(getStyle(element).fontSize as string)));
                        }
                        else if (isPercent(position)) {
                            origin[attr] = (attr === 'x' ? width : height) * (parseInt(position) / 100);
                        }
                        if (origin[attr] !== null) {
                            positions[i] = '';
                            break;
                        }
                    }
                }
            }
        });
        if (origin.x !== 0 || origin.y !== 0) {
            return origin;
        }
    }
    return undefined;
}

export function applyMatrixX(matrix: DOMMatrix, x: number, y: number) {
    return matrix.a * x + matrix.c * y + matrix.e;
}

export function applyMatrixY(matrix: DOMMatrix, x: number, y: number) {
    return matrix.b * x + matrix.d * y + matrix.f;
}

export function getRadiusX(angle: number, radius: number) {
    return radius * Math.sin(angle * Math.PI / 180);
}

export function getRadiusY(angle: number, radius: number) {
    return radius * Math.cos(angle * Math.PI / 180) * -1;
}

export function isSvgVisible(element: SVGGraphicsElement) {
    return cssAttribute(element, 'display') !== 'none' && !['hidden', 'collpase'].includes(cssAttribute(element, 'visibility'));
}
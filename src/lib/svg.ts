import { cssAttribute, getStyle, getBackgroundPosition, newRectDimensions } from './dom';
import { parseRGBA } from './color';

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

export function createTransform(element: SVGGraphicsElement) {
    const data: SvgTransformAttributes = {
        operations: [],
        translateX: 0,
        translateY: 0,
        scaleX: 1,
        scaleY: 1,
        rotateAngle: 0,
        rotateOriginX: 0,
        rotateOriginY: 0,
        skewX: 0,
        skewY: 0
    };
    for (let i = 0; i < element.transform.baseVal.numberOfItems; i++) {
        const item = element.transform.baseVal.getItem(i);
        if (!data.operations.includes(item.type)) {
            switch (item.type) {
                case SVGTransform.SVG_TRANSFORM_TRANSLATE:
                    data.translateX = item.matrix.e;
                    data.translateY = item.matrix.f;
                    break;
                case SVGTransform.SVG_TRANSFORM_SCALE:
                    data.scaleX = item.matrix.a;
                    data.scaleY = item.matrix.d;
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
                    }
                    break;
                case SVGTransform.SVG_TRANSFORM_SKEWX:
                    if (item.angle !== 0) {
                        data.skewX += item.angle;
                        data.matrixSkewX = item.matrix;
                    }
                    break;
                case SVGTransform.SVG_TRANSFORM_SKEWY:
                    if (item.angle !== 0) {
                        data.skewY += item.angle;
                        data.matrixSkewY = item.matrix;
                    }
                    break;
            }
            data.operations.push(item.type);
        }
    }
    return data;
}

export function createTransformOrigin(element: SVGGraphicsElement, dpi: number, fontSize: number) {
    const style = getStyle(element);
    if (style.transformOrigin) {
        switch (style.transformOrigin) {
            case '0px 0px':
            case '0% 0%':
            case 'left top':
                break;
            default:
                return getBackgroundPosition(style.transformOrigin, element.getBoundingClientRect(), dpi, fontSize, true);
        }
    }
    return newRectDimensions();
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
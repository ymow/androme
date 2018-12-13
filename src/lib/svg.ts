import { cssAttribute, getStyle, getBackgroundPosition } from './dom';
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
        length: element.transform.baseVal.numberOfItems,
        translateX: 0,
        translateY: 0,
        scaleX: 1,
        scaleY: 1,
        rotateAngle: 0,
        skewX: 0,
        skewY: 0
    };
    for (let i = 0; i < element.transform.baseVal.numberOfItems; i++) {
        const item = element.transform.baseVal.getItem(i);
        switch (item.type) {
            case SVGTransform.SVG_TRANSFORM_TRANSLATE:
                data.translateX += item.matrix.e;
                data.translateY += item.matrix.f;
                break;
            case SVGTransform.SVG_TRANSFORM_SCALE:
                data.scaleX *= item.matrix.a;
                data.scaleY *= item.matrix.d;
                break;
            case SVGTransform.SVG_TRANSFORM_ROTATE:
                data.rotateAngle += item.angle;
                let x = 0;
                let y = 0;
                if (element instanceof SVGLineElement) {
                    x = element.x1.baseVal.value;
                    y = element.y1.baseVal.value;
                }
                else if (element instanceof SVGRectElement || element instanceof SVGImageElement) {
                    x = element.x.baseVal.value;
                    y = element.y.baseVal.value;
                }
                else if ((element instanceof SVGPolygonElement || element instanceof SVGPolylineElement) && element.points.numberOfItems > 0) {
                    x = element.points[0].x1;
                    y = element.points[0].y1;
                }
                else if (element instanceof SVGCircleElement || element instanceof SVGEllipseElement) {
                    x = element.cx.baseVal.value;
                    y = element.cy.baseVal.value;
                }
                else if (element instanceof SVGPathElement) {
                    const match = /\s*[Mm]\s*(-?[\d.]+)\s*,?\s*(-?[\d.]+)/.exec(cssAttribute(element, 'd'));
                    if (match) {
                        x = parseFloat(match[1]);
                        y = parseFloat(match[2]);
                    }
                    else {
                        continue;
                    }
                }
                else {
                    continue;
                }
                if (item.matrix.e !== 0) {
                    data.rotateX = Math.round(data.translateX + (item.matrix.a * x) + (item.matrix.c * y) + item.matrix.e);
                    data.translateX = 0;
                }
                if (item.matrix.f !== 0) {
                    data.rotateY = Math.round(data.translateY + (item.matrix.b * x) + (item.matrix.d * y) + item.matrix.f);
                    data.translateY = 0;
                }
                break;
            case SVGTransform.SVG_TRANSFORM_SKEWX:
                data.skewX += item.angle;
                break;
            case SVGTransform.SVG_TRANSFORM_SKEWY:
                data.skewY += item.angle;
                break;
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
    return undefined;
}

export function getOffsetX(angle: number, radius: number) {
    return radius * Math.sin(angle * Math.PI / 180);
}

export function getOffsetY(angle: number, radius: number) {
    return radius * Math.cos(angle * Math.PI / 180) * -1;
}

export function isSvgVisible(element: SVGGraphicsElement) {
    return cssAttribute(element, 'display') !== 'none' && !['hidden', 'collpase'].includes(cssAttribute(element, 'visibility'));
}
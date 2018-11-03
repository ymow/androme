import { cssAttribute, getStyle, parseBackgroundPosition } from './dom';
import { parseRGBA } from './color';

export function getColorStop(gradient: SVGGradientElement) {
    const result: ColorStop[] = [];
    for (const stop of Array.from(gradient.getElementsByTagName('stop'))) {
        const color = parseRGBA(cssAttribute(stop, 'stop-color'), cssAttribute(stop, 'stop-opacity'));
        if (color) {
            result.push({
                color,
                offset: cssAttribute(stop, 'offset'),
                opacity: color.alpha
            });
        }
    }
    return result;
}

export function isVisible(element: SVGGraphicsElement) {
    return cssAttribute(element, 'display') !== 'none' && !['hidden', 'collpase'].includes(cssAttribute(element, 'visibility'));
}

export function createTransform(element: SVGGraphicsElement) {
    const data: SvgTransformAttributes = {
        translateX: 0,
        translateY: 0,
        scaleX: 1,
        scaleY: 1,
        rotateAngle: 0,
        rotateX: 0,
        rotateY: 0,
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
                if (item.matrix.e > 0) {
                    data.rotateX = Math.round((item.matrix.e - item.matrix.f) / 2);
                    data.rotateY = item.matrix.e - data.rotateX;
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
    const style = getStyle(element);
    if (style.transformOrigin && style.transformOrigin !== '0px 0px' && style.transformOrigin !== 'left top') {
        data.origin = parseBackgroundPosition(style.transformOrigin, element.getBoundingClientRect() || '', style.fontSize, true);
    }
    return data;
}
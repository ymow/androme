import * as $enum from '../lib/enumeration';
import * as $const from '../lib/constant';

declare global {
    namespace androme.lib {
        namespace enumeration {
            export import USER_AGENT = $enum.USER_AGENT;
            export import APP_FRAMEWORK = $enum.APP_FRAMEWORK;
            export import APP_SECTION = $enum.APP_SECTION;
            export import NODE_ALIGNMENT = $enum.NODE_ALIGNMENT;
            export import NODE_RESOURCE = $enum.NODE_RESOURCE;
            export import NODE_PROCEDURE = $enum.NODE_PROCEDURE;
            export import NODE_STANDARD = $enum.NODE_STANDARD;
            export import BOX_STANDARD = $enum.BOX_STANDARD;
            export import CSS_STANDARD = $enum.CSS_STANDARD;
        }
        namespace constant {
            export import MAP_ELEMENT = $const.MAP_ELEMENT;
            export import BLOCK_ELEMENT = $const.BLOCK_ELEMENT;
            export import INLINE_ELEMENT = $const.INLINE_ELEMENT;
            export import EXT_NAME = $const.EXT_NAME;
            export import DOM_REGEX = $const.DOM_REGEX;
        }
        namespace util {
            export function formatString(value: string, ...params: string[]): string;
            export function camelToLowerCase(value: string): string;
            export function convertCamelCase(value: string, char?: string): string;
            export function convertWord(value: string): string;
            export function capitalize(value: string, upper?: boolean): string;
            export function convertInt(value: any): number;
            export function convertFloat(value: any): number;
            export function convertPercent(value: number, precision?: number): string;
            export function convertPX(value: any, fontSize?: Null<string>): string;
            export function convertAlpha(value: number): string;
            export function convertRoman(value: number): string;
            export function convertEnum(value: number, base: {}, derived: {}): string;
            export function formatPX(value: any): string;
            export function hasBit(value: number, type: number): boolean;
            export function isNumber(value: string | number): value is number;
            export function isString(value: any): value is string;
            export function isArray<T>(value: any): value is Array<T>;
            export function isUnit(value: string): boolean;
            export function isPercent(value: string): boolean;
            export function includes(source: string | undefined, value: string, delimiter?: string): boolean;
            export function optional(obj: {} | undefined, value: string, type?: string): any;
            export function resolvePath(value: string): string;
            export function trimNull(value: string | undefined): string;
            export function trimString(value: string | undefined, char: string): string;
            export function trimStart(value: string | undefined, char: string): string;
            export function trimEnd(value: string | undefined, char: string): string;
            export function repeat(many: number, value?: string): string;
            export function indexOf(value: string, ...terms: string[]): number;
            export function lastIndexOf(value: string, char?: string): string;
            export function sameValue(obj1: {}, obj2: {}, ...attrs: string[]): boolean;
            export function searchObject(obj: StringMap, value: string | StringMap): any[][];
            export function hasValue(value: any): boolean;
            export function withinRange(a: number, b: number, offset?: number): boolean;
            export function withinFraction(lower: number, upper: number): boolean;
            export function overwriteDefault(options: {}, namespace: string, attr: string, value: string): void;
            export function partition<T>(list: T[], predicate: (value: T) => boolean): [T[], T[]];
            export function sortAsc<T>(list: T[], ...attrs: string[]): T[];
            export function sortDesc<T>(list: T[], ...attrs: string[]): T[];
        }
        namespace dom {
            export function isUserAgent(value: number): boolean;
            export function getBoxRect(): BoxRect;
            export function getClientRect(): BoxDimensions;
            export function getBoxModel(): BoxModel;
            export function convertClientUnit(value: string, dimension: number, fontSize?: Null<string>, percent?: boolean): number;
            export function getRangeClientRect(element: Element): [BoxDimensions, boolean];
            export function assignBounds(bounds: BoxDimensions | DOMRect): BoxDimensions;
            export function getStyle(element: Null<Element>, cache?: boolean): CSSStyleDeclaration;
            export function getBoxSpacing(element: Element, complete?: boolean, merge?: boolean): BoxModel;
            export function cssResolveUrl(value: string): string;
            export function cssInherit(element: Element, attr: string, exclude?: string[], tagNames?: string[]): string;
            export function cssParent(element: Element, attr: string, ...styles: string[]): boolean;
            export function cssFromParent(element: Element, attr: string): boolean;
            export function parseBackgroundPosition(value: string, dimension: BoxDimensions, fontSize?: Null<string>, leftPerspective?: boolean, percent?: boolean): BoxPosition;
            export function getFirstElementChild(elements: Element[]): Element | undefined;
            export function getLastElementChild(elements: Element[]): Element | undefined;
            export function hasFreeFormText(element: Element, maxDepth?: number, whiteSpace?: boolean): boolean;
            export function cssAttribute(element: Element, attr: string): string;
            export function isPlainText(element: Element | undefined, whiteSpace?: boolean): boolean;
            export function hasLineBreak(element: Element | undefined): boolean;
            export function isLineBreak(element: Element | undefined, excluded?: boolean): boolean;
            export function getElementsBetweenSiblings(firstElement: Element | undefined, secondElement: Element, cacheNode?: boolean, whiteSpace?: boolean): Element[];
            export function isStyleElement(element: Element | undefined): element is HTMLElement;
            export function isElementVisible(element: Element, hideOffScreen: boolean): boolean;
            export function findNestedExtension(element: Element, name: string): HTMLElement | undefined;
            export function setElementCache(element: Element, attr: string, data: any): void;
            export function getElementCache(element: Element, attr: string): any;
            export function deleteElementCache(element: Element, ...attrs: string[]): void;
            export function getNodeFromElement<T>(element: Null<Element>): T | undefined;
        }
        namespace xml {
            export function formatPlaceholder(id: string | number, symbol?: string): string;
            export function replacePlaceholder(value: string, id: string | number, content: string, before?: boolean): string;
            export function removePlaceholderAll(value: string): string;
            export function replaceIndent(value: string, depth: number): string;
            export function replaceTab(value: string, settings?: {}, preserve?: boolean): string;
            export function replaceEntity(value: string): string;
            export function replaceCharacter(value: string): string;
            export function parseTemplate(template: string): StringMap;
            export function createTemplate(template: StringMap, data: TemplateData, index?: string, include?: {}, exclude?: {}): string;
            export function getTemplateBranch(data: {}, ...levels: string[]): {};
        }
        namespace svg {
            export function getColorStop(gradient: SVGGradientElement): ColorStop[];
            export function isVisible(element: SVGGraphicsElement): boolean;
            export function createTransform(element: SVGGraphicsElement): SvgTransformAttributes;
        }
        namespace color {
            export function getColorByName(value: string): Color | undefined;
            export function getColorNearest(value: string): Color | undefined;
            export function convertHex(value: string, opacity?: number): string;
            export function convertRGBA(value: string): RGBA | undefined;
            export function parseRGBA(value: string, opacity?: string): ColorHexAlpha | undefined;
            export function reduceRGBA(value: string, percent: number): string;
        }
    }
}

export {};
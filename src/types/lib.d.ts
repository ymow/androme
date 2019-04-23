import * as $const from '../lib/constant';
import * as $enum from '../lib/enumeration';

declare global {
    namespace androme.lib {
        namespace constant {
            export import ELEMENT_BLOCK = $const.ELEMENT_BLOCK;
            export import ELEMENT_INLINE = $const.ELEMENT_INLINE;
            export import EXT_NAME = $const.EXT_NAME;
            export import REGEX_PATTERN = $const.REGEX_PATTERN;
        }

        namespace enumeration {
            export import APP_FRAMEWORK = $enum.APP_FRAMEWORK;
            export import APP_SECTION = $enum.APP_SECTION;
            export import BOX_STANDARD = $enum.BOX_STANDARD;
            export import CSS_STANDARD = $enum.CSS_STANDARD;
            export import NODE_ALIGNMENT = $enum.NODE_ALIGNMENT;
            export import NODE_PROCEDURE = $enum.NODE_PROCEDURE;
            export import NODE_RESOURCE = $enum.NODE_RESOURCE;
            export import USER_AGENT = $enum.USER_AGENT;
        }

        namespace color {
            export function findColorName(value: string): ColorResult | undefined;
            export function findColorShade(value: string): ColorResult | undefined;
            export function parseColor(value: string, opacity?: string, transparency?: boolean): ColorData | undefined;
            export function reduceColor(value: string, percent: number): ColorData | undefined;
            export function convertHex(...values: string[] | number[]): string;
            export function convertRGBA(value: string): RGBA | undefined;
            export function formatRGBA(rgba: RGBA): string;
        }

        namespace dom {
            export function isUserAgent(value: number): boolean;
            export function checkStyleAttribute(element: Element, attr: string, value: string, style?: CSSStyleDeclaration, fontSize?: number): string;
            export function getDataSet(element: Element, prefix: string): StringMap;
            export function newBoxRect(): BoxRect;
            export function newRectDimension(): RectDimension;
            export function newBoxModel(): BoxModel;
            export function createElement(parent: Element | null, block?: boolean): HTMLElement;
            export function removeElementsByClassName(className: string): void;
            export function convertClientUnit(value: string, dimension: number, fontSize?: string | null, percent?: boolean): number;
            export function getRangeClientRect(element: Element): TextDimension;
            export function assignBounds(bounds: RectDimension | DOMRect): RectDimension;
            export function getStyle(element: Element | null, cache?: boolean): CSSStyleDeclaration;
            export function getBoxSpacing(element: Element): BoxModel;
            export function convertAngle(value: string, unit?: string): number;
            export function cssResolveUrl(value: string): string;
            export function cssParent(element: Element, attr: string, ...styles: string[]): boolean;
            export function cssFromParent(element: Element, attr: string): boolean;
            export function cssInline(element: Element, attr: string): string;
            export function cssAttribute(element: Element, attr: string, computed?: boolean): string;
            export function cssInheritAttribute(element: Element | null, attr: string): string;
            export function cssInheritStyle(element: Element | null, attr: string, exclude?: string[], tagNames?: string[]): string;
            export function getNamedItem(element: Element | null, attr: string): string;
            export function getBackgroundPosition(value: string, dimension: RectDimension, fontSize?: number, leftPerspective?: boolean, percent?: boolean): RectPosition;
            export function getFirstChildElement(elements: Element[]): Element | null;
            export function getLastChildElement(elements: Element[]): Element | null;
            export function hasFreeFormText(element: Element, whiteSpace?: boolean): boolean;
            export function isPlainText(element: Element, whiteSpace?: boolean): boolean;
            export function hasLineBreak(element: Element, lineBreak?: boolean, trimString?: boolean): boolean;
            export function isLineBreak(element: Element, excluded?: boolean): boolean;
            export function getElementsBetween(elementStart: Element | null, elementEnd: Element, whiteSpace?: boolean, asNode?: boolean): Element[];
            export function getPreviousElementSibling(element: Element): Element | null;
            export function getNextElementSibling(element: Element): Element | null;
            export function hasComputedStyle(element: UndefNull<Element>): element is HTMLElement;
            export function hasVisibleDimensions(element: Element): boolean;
            export function setElementCache(element: Element, attr: string, data: any): void;
            export function getElementCache(element: Element, attr: string): any;
            export function deleteElementCache(element: Element, ...attrs: string[]): void;
            export function getElementAsNode<T>(element: Element): T | undefined;
        }

        namespace svg {
            export function isSvgShape(element: Element): element is SVGGraphicsElement;
            export function isSvgImage(element: Element): element is SVGImageElement;
            export function createTransformData(element: SVGGraphicsElement): SvgTransformData;
            export function getTransformOrigin(element: SVGGraphicsElement): Point | undefined;
            export function applyMatrixX(matrix: DOMMatrix, x: number, y: number): number;
            export function applyMatrixY(matrix: DOMMatrix, x: number, y: number): number;
            export function getRadiusX(angle: number, radius: number): number;
            export function getRadiusY(angle: number, radius: number): number;
            export function isVisible(element: SVGGraphicsElement): boolean;
        }

        namespace util {
            export function formatString(value: string, ...params: string[]): string;
            export function capitalize(value: string, upper?: boolean): string;
            export function convertUnderscore(value: string): string;
            export function convertCamelCase(value: string, char?: string): string;
            export function convertWord(value: string): string;
            export function convertInt(value: string): number;
            export function convertFloat(value: string): number;
            export function convertPX(value: string, fontSize?: number): string;
            export function convertPercent(value: number, precision?: number): string;
            export function convertAlpha(value: number): string;
            export function convertRoman(value: number): string;
            export function convertEnum(value: number, base: {}, derived: {}): string;
            export function formatPX(value: string | number): string;
            export function formatPercent(value: string | number): string;
            export function hasBit(value: number, type: number): boolean;
            export function isNumber(value: string | number): value is number;
            export function isString(value: any): value is string;
            export function isArray<T>(value: any): value is Array<T>;
            export function isUnit(value: string): boolean;
            export function isPercent(value: string): boolean;
            export function includes(source: string | undefined, value: string, delimiter?: string): boolean;
            export function optional(obj: UndefNull<object>, value: string, type?: string): any;
            export function optionalAsObject(obj: UndefNull<object>, value: string): object;
            export function optionalAsString(obj: UndefNull<object>, value: string): string;
            export function optionalAsNumber(obj: UndefNull<object>, value: string): number;
            export function optionalAsBoolean(obj: UndefNull<object>, value: string): boolean;
            export function resolvePath(value: string): string;
            export function trimNull(value: string | undefined): string;
            export function trimString(value: string | undefined, char: string): string;
            export function trimStart(value: string | undefined, char: string): string;
            export function trimEnd(value: string | undefined, char: string): string;
            export function repeat(many: number, value?: string): string;
            export function indexOf(value: string, ...terms: string[]): number;
            export function lastIndexOf(value: string, char?: string): string;
            export function minArray(list: number[]): number;
            export function maxArray(list: number[]): number;
            export function hasSameValue(obj1: {}, obj2: {}, ...attrs: string[]): boolean;
            export function searchObject(obj: StringMap, value: string | StringMap): any[][];
            export function hasValue(value: any): boolean;
            export function withinRange(a: number, b: number, offset?: number): boolean;
            export function withinFraction(lower: number, upper: number): boolean;
            export function assignWhenNull(destination: {}, source: {}): void;
            export function defaultWhenNull(options: {}, ...attrs: string[]): void;
            export function partition<T>(list: T[], predicate: IteratorPredicate<T, boolean>): [T[], T[]];
            export function flatArray<T>(list: any[]): T[];
            export function filterArray<T>(list: T[], predicate: IteratorPredicate<T, boolean>): T[];
            export function flatMap<T, U>(list: T[], predicate: IteratorPredicate<T, U>): U[];
            export function sortAsc<T>(list: T[], ...attrs: string[]): T[];
            export function sortDesc<T>(list: T[], ...attrs: string[]): T[];
        }

        namespace xml {
            export function formatPlaceholder(id: string | number, symbol?: string): string;
            export function replacePlaceholder(value: string, id: string | number, content: string, before?: boolean): string;
            export function replaceIndent(value: string, depth: number, pattern: RegExp): string;
            export function replaceTab(value: string, spaces?: number, preserve?: boolean): string;
            export function replaceEntity(value: string): string;
            export function replaceCharacter(value: string): string;
            export function parseTemplate(value: string): StringMap;
            export function createTemplate(value: StringMap, data: ExternalData, index?: string): string;
            export function getTemplateSection(data: ExternalData, ...levels: string[]): object;
        }
    }
}

export {};
declare global {
    namespace androme {
        export function setFramework(module: any, cached?: boolean): void;
        export function parseDocument(...elements: Undefined<string | Element>[]): FunctionMap<void>;
        export function installExtension(ext: {}): boolean;
        export function installExtensionAsync(ext: {}): boolean;
        export function removeExtension(name: {} | string): boolean;
        export function configureExtension(name: {} | string, options: {}): boolean;
        export function getExtension(name: string): {} | null;
        export function ext(module: any): {} | boolean | null;
        export function ready(): boolean;
        export function close(): void;
        export function reset(): void;
        export function saveAllToDisk(): void;
        export function toString(): string;
        export const settings: Settings;
    }
}

export {};
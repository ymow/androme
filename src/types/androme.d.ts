declare global {
    namespace androme {
        export function setFramework(value: {}, cached?: boolean): void;
        export function parseDocument(...elements: Undefined<string | Element>[]): FunctionMap<void>;
        export function installExtension(value: {} | string): boolean;
        export function installExtensionAsync(value: {} | string): boolean;
        export function removeExtension(value: {} | string): boolean;
        export function configureExtension(value: {} | string, options: {}): boolean;
        export function ext(value: {} | string): {} | boolean | null;
        export function getExtension(value: string): {} | null;
        export function ready(): boolean;
        export function close(): void;
        export function reset(): void;
        export function saveAllToDisk(): void;
        export function toString(): string;
        export const settings: UserSettings;
        export const system: FunctionMap<any>;
    }
}

export {};
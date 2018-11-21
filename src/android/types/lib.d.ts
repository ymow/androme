import { SettingsAndroid, ViewAttribute } from './module';

import * as $const from '../lib/constant';
import * as $enum from '../lib/enumeration';

declare global {
    namespace android {
        namespace lib {
            namespace enumeration {
                export import BUILD_ANDROID = $enum.BUILD_ANDROID;
                export import DENSITY_ANDROID = $enum.DENSITY_ANDROID;
            }

            namespace constant {
                export import EXT_ANDROID = $const.EXT_ANDROID;
                export import CONTAINER_ANDROID = $const.CONTAINER_ANDROID;
                export import SUPPORT_ANDROID = $const.SUPPORT_ANDROID;
                export import BOX_ANDROID = $const.BOX_ANDROID;
                export import AXIS_ANDROID = $const.AXIS_ANDROID;
                export import LAYOUT_ANDROID = $const.LAYOUT_ANDROID;
                export import XMLNS_ANDROID = $const.XMLNS_ANDROID;
                export import WEBVIEW_ANDROID = $const.WEBVIEW_ANDROID;
                export import RESERVED_JAVA = $const.RESERVED_JAVA;
                export import PREFIX_ANDROID = $const.PREFIX_ANDROID;
            }

            namespace util {
                export function resetId(): void;
                export function generateId(section: string, name: string, start: number): string;
                export function stripId(value: string): string;
                export function createAttribute(options?: ExternalData): ViewAttribute;
                export function validateString(value: string): string;
                export function convertUnit(value: string, dpi?: number, font?: boolean): string;
                export function replaceUnit(value: string, settings?: SettingsAndroid, font?: boolean): string;
                export function replaceTab(value: string, settings: Settings, preserve?: boolean): string;
                export function calculateBias(start: number, end: number, accuracy: number): number;
                export function replaceRTL(value: string, settings: EnvironmentSettings): string;
                export function getXmlNs(...values: string[]): string;
            }
        }
    }
}

export {};
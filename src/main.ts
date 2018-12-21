import Application from './base/application';
import Container from './base/container';
import Controller from './base/controller';
import Extension from './base/extension';
import ExtensionManager from './base/extensionmanager';
import File from './base/file';
import Layout from './base/layout';
import Node from './base/node';
import NodeGroup from './base/nodegroup';
import NodeList from './base/nodelist';
import Resource from './base/resource';
import Svg from './base/svg';
import SvgAnimate from './base/svganimate';
import SvgAnimateMotion from './base/svganimatemotion';
import SvgAnimateTransform from './base/svganimatetransform';
import SvgAnimation from './base/svganimation';
import SvgBuild from './base/svgbuild';
import SvgElement from './base/svgelement';
import SvgGroup from './base/svggroup';
import SvgGroupViewBox from './base/svggroupviewbox';
import SvgImage from './base/svgimage';
import SvgPath from './base/svgpath';
import SvgUse from './base/svguse';

import Accessibility from './extension/accessibility';
import CssGrid from './extension/cssgrid';
import Flexbox from './extension/flexbox';
import External from './extension/external';
import Grid from './extension/grid';
import List from './extension/list';
import Relative from './extension/relative';
import Sprite from './extension/sprite';
import Substitute from './extension/substitute';
import Table from './extension/table';
import VerticalAlign from './extension/verticalalign';
import WhiteSpace from './extension/whitespace';

import * as color from './lib/color';
import * as constant from './lib/constant';
import * as dom from './lib/dom';
import * as enumeration from './lib/enumeration';
import * as svg from './lib/svg';
import * as util from './lib/util';
import * as xml from './lib/xml';

type T = Node;

let main: androme.lib.base.Application<T>;
let framework: AppFramework<T>;
let settings: UserSettings = {} as any;
let system: FunctionMap<any> = {};

const extensionsAsync = new Set<Extension<T>>();
const optionsAsync = new Map<string, ExternalData>();

export function setFramework(value: AppFramework<T>, cached = false) {
    if (framework !== value) {
        const appBase = cached ? value.cached() : value.create();
        if (main || Object.keys(settings).length === 0) {
            settings = appBase.userSettings;
        }
        else {
            settings = Object.assign(appBase.userSettings, settings);
        }
        main = appBase.application;
        main.userSettings = settings;
        if (Array.isArray(settings.builtInExtensions)) {
            const register = new Set<androme.lib.base.Extension<T>>();
            for (let namespace of settings.builtInExtensions) {
                namespace = namespace.trim();
                if (main.builtInExtensions[namespace]) {
                    register.add(main.builtInExtensions[namespace]);
                }
                else {
                    for (const ext in main.builtInExtensions) {
                        if (ext.startsWith(`${namespace}.`)) {
                            register.add(main.builtInExtensions[ext]);
                        }
                    }
                }
            }
            register.forEach(item => main.extensionManager.include(item));
        }
        framework = value;
        system = value.system;
    }
    reset();
}

export function parseDocument(...elements: Undefined<string | Element>[]): FunctionMap<void> {
    if (main && !main.closed) {
        if (settings.handleExtensionsAsync) {
            extensionsAsync.forEach(item => main.extensionManager.include(item));
            for (const [name, options] of optionsAsync.entries()) {
                configure(name, options);
            }
            extensionsAsync.clear();
            optionsAsync.clear();
        }
        return main.parseDocument(...elements);
    }
    return {
        then: (callback: () => void) => {
            if (!main) {
                alert('ERROR: Framework not installed.');
            }
            else if (main.closed) {
                if (confirm('ERROR: Document is closed. Reset and rerun?')) {
                    main.reset();
                    parseDocument.call(null, ...arguments).then(callback);
                }
            }
        }
    };
}

export function include(value: Extension<T> | string) {
    if (main) {
        if (value instanceof Extension) {
            return main.extensionManager.include(value);
        }
        else if (util.isString(value)) {
            value = value.trim();
            const ext = main.builtInExtensions[value] || retrieve(value);
            if (ext) {
                return main.extensionManager.include(ext);
            }
        }
    }
    return false;
}

export function includeAsync(value: Extension<T> | string) {
    if (include(value)) {
        return true;
    }
    else if (value instanceof Extension) {
        extensionsAsync.add(value);
        if (settings.handleExtensionsAsync) {
            return true;
        }
    }
    return false;
}

export function exclude(value: Extension<T> | string) {
    if (main) {
        if (value instanceof Extension) {
            if (extensionsAsync.has(value)) {
                extensionsAsync.delete(value);
                main.extensionManager.exclude(value);
                return true;
            }
            else {
                return main.extensionManager.exclude(value);
            }
        }
        else if (util.isString(value)) {
            value = value.trim();
            const ext = main.extensionManager.retrieve(value);
            if (ext) {
                return main.extensionManager.exclude(ext);
            }
        }
    }
    return false;
}

export function configure(value: Extension<T> | string, options: {}) {
    if (typeof options === 'object') {
        if (value instanceof Extension) {
            Object.assign(value.options, options);
            return true;
        }
        else if (util.isString(value)) {
            if (main) {
                value = value.trim();
                const ext = main.extensionManager.retrieve(value) || Array.from(extensionsAsync).find(item => item.name === value);
                if (ext) {
                    Object.assign(ext.options, options);
                    return true;
                }
                else {
                    optionsAsync.set(value, options);
                    if (settings.handleExtensionsAsync) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

export function ext(value: Extension<T> | string, options?: ExternalData) {
    if (value instanceof Extension) {
        return include(value);
    }
    else if (util.isString(value)) {
        value = value.trim();
        if (typeof options === 'object') {
            return configure(value, options);
        }
        else {
            return retrieve(value);
        }
    }
    return false;
}

export function retrieve(value: string) {
    return main && main.extensionManager.retrieve(value);
}

export function ready() {
    return main && !main.initialized && !main.closed;
}

export function close() {
    if (main && !main.initialized && main.size) {
        main.finalize();
    }
}

export function reset() {
    if (main) {
        main.reset();
    }
}

export function saveAllToDisk() {
    if (main && !main.initialized && main.size) {
        if (!main.closed) {
            main.finalize();
        }
        main.saveAllToDisk();
    }
}

export function toString() {
    return main ? main.toString() : '';
}

const lib = {
    base: {
        Application,
        Container,
        Controller,
        Extension,
        ExtensionManager,
        File,
        Layout,
        Node,
        NodeGroup,
        NodeList,
        Resource,
        Svg,
        SvgAnimate,
        SvgAnimateMotion,
        SvgAnimateTransform,
        SvgAnimation,
        SvgBuild,
        SvgElement,
        SvgGroup,
        SvgGroupViewBox,
        SvgImage,
        SvgPath,
        SvgUse
    },
    extensions: {
        Accessibility,
        CssGrid,
        External,
        Flexbox,
        Grid,
        List,
        Relative,
        Sprite,
        Substitute,
        Table,
        VerticalAlign,
        WhiteSpace
    },
    color,
    constant,
    dom,
    enumeration,
    svg,
    util,
    xml,
};

export { lib, system, settings };
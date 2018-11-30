import Application from './base/application';
import Container from './base/container';
import Controller from './base/controller';
import Extension from './base/extension';
import File from './base/file';
import Layout from './base/layout';
import Node from './base/node';
import NodeGroup from './base/nodegroup';
import NodeList from './base/nodelist';
import Resource from './base/resource';
import Svg from './base/svg';
import SvgElement from './base/svgelement';
import SvgGroup from './base/svggroup';
import SvgImage from './base/svgimage';
import SvgPath from './base/svgpath';

import Accessibility from './extension/accessibility';
import CssGrid from './extension/cssgrid';
import Flexbox from './extension/flexbox';
import External from './extension/external';
import Grid from './extension/grid';
import List from './extension/list';
import Origin from './extension/origin';
import Percent from './extension/percent';
import Relative from './extension/relative';
import Sprite from './extension/sprite';
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
        const appBase: AppBase<T> = cached ? value.cached() : value.create();
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
            register.forEach(item => main.installExtension(item));
        }
        framework = value;
        system = value.system;
    }
    reset();
}

export function parseDocument(...elements: Undefined<string | Element>[]): FunctionMap<void> {
    if (main && !main.closed) {
        if (settings.handleExtensionsAsync) {
            extensionsAsync.forEach(item => main.installExtension(item));
            for (const [name, options] of optionsAsync.entries()) {
                configureExtension(name, options);
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
                    parseDocument.apply(null, arguments).then(callback);
                }
            }
        }
    };
}

export function installExtension(value: Extension<T> | string) {
    if (main) {
        if (value instanceof Extension) {
            return main.installExtension(value);
        }
        else if (util.isString(value)) {
            value = value.trim();
            const ext = main.builtInExtensions[value] || getExtension(value);
            if (ext) {
                return main.installExtension(ext);
            }
        }
    }
    return false;
}

export function installExtensionAsync(value: Extension<T> | string) {
    if (installExtension(value)) {
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

export function removeExtension(value: Extension<T> | string) {
    if (main) {
        if (value instanceof Extension) {
            if (extensionsAsync.has(value)) {
                extensionsAsync.delete(value);
                main.removeExtension(value);
                return true;
            }
            else {
                return main.removeExtension(value);
            }
        }
        else if (util.isString(value)) {
            value = value.trim();
            const ext = main.getExtension(value);
            if (ext) {
                return main.removeExtension(ext);
            }
        }
    }
    return false;
}

export function configureExtension(value: Extension<T> | string, options: {}) {
    if (typeof options === 'object') {
        if (value instanceof Extension) {
            Object.assign(value.options, options);
            return true;
        }
        else if (util.isString(value)) {
            if (main) {
                value = value.trim();
                const ext = main.getExtension(value) || Array.from(extensionsAsync).find(item => item.name === value);
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
        return installExtension(value);
    }
    else if (util.isString(value)) {
        value = value.trim();
        if (typeof options === 'object') {
            return configureExtension(value, options);
        }
        else {
            return getExtension(value);
        }
    }
    return false;
}

export function getExtension(value: string) {
    return main && main.getExtension(value);
}

export function ready() {
    return main && !main.initialized && !main.closed;
}

export function close() {
    if (main && !main.initialized && main.size > 0) {
        main.finalize();
    }
}

export function reset() {
    if (main) {
        main.reset();
    }
}

export function saveAllToDisk() {
    if (main && !main.initialized && main.size > 0) {
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
        File,
        Layout,
        Node,
        NodeGroup,
        NodeList,
        Resource,
        Svg,
        SvgElement,
        SvgGroup,
        SvgImage,
        SvgPath
    },
    extensions: {
        Accessibility,
        CssGrid,
        External,
        Flexbox,
        Grid,
        List,
        Origin,
        Percent,
        Relative,
        Sprite,
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
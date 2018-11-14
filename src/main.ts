import Application from './base/application';
import Container from './base/container';
import Controller from './base/controller';
import Extension from './base/extension';
import File from './base/file';
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
import Custom from './extension/custom';
import External from './extension/external';
import Grid from './extension/grid';
import List from './extension/list';
import Origin from './extension/origin';
import Percent from './extension/percent';
import Sprite from './extension/sprite';
import Table from './extension/table';

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
let settings: Settings = {} as any;
let system: FunctionMap<any> = {};

const extensionsAsync = new Set<Extension<T>>();
const optionsAsync = new Map<string, ExternalData>();

export function setFramework(module: AppFramework<T>, cached = false) {
    if (framework !== module) {
        const appBase: AppBase<T> = cached ? module.cached() : module.create();
        if (main || Object.keys(settings).length === 0) {
            settings = appBase.settings;
        }
        else {
            settings = Object.assign(appBase.settings, settings);
        }
        main = appBase.application;
        main.settings = settings;
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
        framework = module;
        system = module.system;
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

export function installExtension(ext: Extension<T> | string) {
    if (main) {
        if (ext instanceof Extension) {
            return main.installExtension(ext);
        }
        else {
            const module = main.builtInExtensions[ext] || getExtension(ext);
            if (module) {
                return main.installExtension(module);
            }
        }
    }
    return false;
}

export function installExtensionAsync(ext: Extension<T>) {
    if (installExtension(ext)) {
        return true;
    }
    else if (ext instanceof Extension) {
        extensionsAsync.add(ext);
        if (settings.handleExtensionsAsync) {
            return true;
        }
    }
    return false;
}

export function removeExtension(module: Extension<T> | string) {
    if (main) {
        if (module instanceof Extension) {
            if (extensionsAsync.has(module)) {
                extensionsAsync.delete(module);
                main.removeExtension(module);
                return true;
            }
            else {
                return main.removeExtension(module);
            }
        }
        else if (util.isString(module)) {
            const ext = main.getExtension(module);
            if (ext) {
                return main.removeExtension(ext);
            }
        }
    }
    return false;
}

export function configureExtension(module: Extension<T> | string, options: {}) {
    if (typeof options === 'object') {
        if (module instanceof Extension) {
            Object.assign(module.options, options);
            return true;
        }
        else if (util.isString(module)) {
            if (main) {
                const ext = main.getExtension(module) || Array.from(extensionsAsync).find(item => item.name === module);
                if (ext) {
                    Object.assign(ext.options, options);
                    return true;
                }
                else {
                    optionsAsync.set(module, options);
                    if (settings.handleExtensionsAsync) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

export function getExtension(name: string) {
    return main && main.getExtension(name);
}

export function ext(module: Extension<T> | string, options?: ExternalData) {
    if (module instanceof Extension) {
        return installExtension(module);
    }
    else if (util.isString(module)) {
        if (typeof options === 'object') {
            return configureExtension(module, options);
        }
        else {
            return getExtension(module);
        }
    }
    return false;
}

export function ready() {
    return main && !main.loading && !main.closed;
}

export function close() {
    if (main && !main.loading && main.size > 0) {
        main.finalize();
    }
}

export function reset() {
    if (main) {
        main.reset();
    }
}

export function saveAllToDisk() {
    if (main && !main.loading && main.size > 0) {
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
        Custom,
        External,
        Grid,
        List,
        Origin,
        Percent,
        Sprite,
        Table
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
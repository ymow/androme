import { SettingsAndroid } from './types/local';

import { EXT_ANDROID, XMLNS_ANDROID } from './lib/constant';
import SETTINGS from './settings';
import { API_ANDROID } from './customizations';

import View from './view';
import ViewController from './viewcontroller';
import ResourceHandler from './resourcehandler';
import FileHandler from './filehandler';

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

import ResourceDimens from './extension/resource/dimens';
import ResourceStyles from './extension/resource/styles';
import ResourceSvg from './extension/resource/svg';

import * as enumeration from './lib/enumeration';
import * as constant from './lib/constant';
import * as util from './lib/util';

type T = View;

function autoClose() {
    const main = viewController.application;
    if (main.settings.autoCloseOnWrite && !main.loading && !main.closed) {
        main.finalize();
        return true;
    }
    return false;
}

let initialized = false;

let application: androme.lib.base.Application<T>;
let viewController: ViewController<T>;
let resourceHandler: ResourceHandler<T>;
let fileHandler: FileHandler<T>;

let settings: SettingsAndroid;
const framework: number = androme.lib.enumeration.APP_FRAMEWORK.ANDROID;

const lib = {
    base: {
        View,
        File: FileHandler,
        Resource: ResourceHandler,
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
        Table,
        resource: {
            Dimens: ResourceDimens,
            Styles: ResourceStyles,
            Svg: ResourceSvg
        }
    },
    enumeration,
    constant,
    util
};

const appBase: AppFramework<T> = {
    lib,
    system: {
        customize(build: number, widget: string, options: {}) {
            if (API_ANDROID[build]) {
                const customizations = API_ANDROID[build].customizations;
                if (customizations[widget] === undefined) {
                    customizations[widget] = {};
                }
                Object.assign(customizations[widget], options);
            }
        },
        addXmlNs(name: string, uri: string) {
            XMLNS_ANDROID[name] = uri;
        },
        writeLayoutAllXml(saveToDisk = false) {
            if (initialized) {
                const main = viewController.application;
                if (main.closed || autoClose()) {
                    return fileHandler.layoutAllToXml(main.viewData, saveToDisk);
                }
            }
            return '';
        },
        writeResourceAllXml(saveToDisk = false) {
            if (initialized) {
                const main = viewController.application;
                if (main.closed || autoClose()) {
                    return fileHandler.resourceAllToXml(saveToDisk);
                }
            }
            return '';
        },
        writeResourceStringXml(saveToDisk = false) {
            if (initialized) {
                const main = viewController.application;
                if (main.closed || autoClose()) {
                    return fileHandler.resourceStringToXml(saveToDisk);
                }
            }
            return '';
        },
        writeResourceArrayXml(saveToDisk = false) {
            if (initialized) {
                const main = viewController.application;
                if (main.closed || autoClose()) {
                    return fileHandler.resourceStringArrayToXml(saveToDisk);
                }
            }
            return '';
        },
        writeResourceFontXml(saveToDisk = false) {
            if (initialized) {
                const main = viewController.application;
                if (main.closed || autoClose()) {
                    return fileHandler.resourceFontToXml(saveToDisk);
                }
            }
            return '';
        },
        writeResourceColorXml(saveToDisk = false) {
            if (initialized) {
                const main = viewController.application;
                if (main.closed || autoClose()) {
                    return fileHandler.resourceColorToXml(saveToDisk);
                }
            }
            return '';
        },
        writeResourceStyleXml(saveToDisk = false) {
            if (initialized) {
                const main = viewController.application;
                if (main.closed || autoClose()) {
                    return fileHandler.resourceStyleToXml(saveToDisk);
                }
            }
            return '';
        },
        writeResourceDimenXml(saveToDisk = false) {
            if (initialized) {
                const main = viewController.application;
                if (main.closed || autoClose()) {
                    return fileHandler.resourceDimenToXml(saveToDisk);
                }
            }
            return '';
        },
        writeResourceDrawableXml(saveToDisk = false) {
            if (initialized) {
                const main = viewController.application;
                if (main.closed || autoClose()) {
                    return fileHandler.resourceDrawableToXml(saveToDisk);
                }
            }
            return '';
        }
    },
    create() {
        const EXT_NAME = androme.lib.constant.EXT_NAME;
        settings = Object.assign({}, SETTINGS);
        fileHandler = new FileHandler<T>(settings);
        application = new androme.lib.base.Application(framework);
        viewController = new ViewController<T>();
        resourceHandler = new ResourceHandler<T>(fileHandler);
        application.registerController(viewController);
        application.registerResource(resourceHandler);
        application.nodeObject = View;
        application.builtInExtensions = {
            [EXT_NAME.EXTERNAL]: new External(EXT_NAME.EXTERNAL, framework),
            [EXT_NAME.ORIGIN]: new Origin(EXT_NAME.ORIGIN, framework),
            [EXT_NAME.CUSTOM]: new Custom(EXT_NAME.CUSTOM, framework),
            [EXT_NAME.ACCESSIBILITY]: new Accessibility(EXT_NAME.ACCESSIBILITY, framework),
            [EXT_NAME.SPRITE]: new Sprite(EXT_NAME.SPRITE, framework),
            [EXT_NAME.CSS_GRID]: new CssGrid(EXT_NAME.CSS_GRID, framework),
            [EXT_NAME.LIST]: new List(EXT_NAME.LIST, framework, ['UL', 'OL', 'DL', 'DIV']),
            [EXT_NAME.TABLE]: new Table(EXT_NAME.TABLE, framework, ['TABLE']),
            [EXT_NAME.GRID]: new Grid(EXT_NAME.GRID, framework, ['FORM', 'UL', 'OL', 'DL', 'DIV', 'TABLE', 'NAV', 'SECTION', 'ASIDE', 'MAIN', 'HEADER', 'FOOTER', 'P', 'ARTICLE', 'FIELDSET', 'SPAN']),
            [EXT_NAME.PERCENT]: new Percent(EXT_NAME.PERCENT, framework),
            [EXT_ANDROID.RESOURCE_DIMENS]: new ResourceDimens(EXT_ANDROID.RESOURCE_DIMENS, framework),
            [EXT_ANDROID.RESOURCE_STYLES]: new ResourceStyles(EXT_ANDROID.RESOURCE_STYLES, framework),
            [EXT_ANDROID.RESOURCE_SVG]: new ResourceSvg(EXT_ANDROID.RESOURCE_SVG, framework)
        };
        initialized = true;
        return {
            application,
            framework,
            settings
        };
    },
    cached() {
        if (initialized) {
            return {
                application,
                framework,
                settings
            };
        }
        return appBase.create();
    }
};

export default appBase;
import { SettingsAndroid } from './types/module';

import { EXT_ANDROID, XMLNS_ANDROID } from './lib/constant';
import { API_ANDROID } from './customizations';
import SETTINGS from './settings';

import Controller from './controller';
import File from './file';
import Resource from './resource';
import View from './view';

import Accessibility from './extension/accessibility';
import CssGrid from './extension/cssgrid';
import External from './extension/external';
import Flexbox from './extension/flexbox';
import Grid from './extension/grid';
import List from './extension/list';
import Origin from './extension/origin';
import Percent from './extension/percent';
import Sprite from './extension/sprite';
import Table from './extension/table';

import ConstraintGuideline from './extension/constraint/guideline';

import ElementCustom from './extension/element/custom';

import ResourceBackground from './extension/resource/background';
import ResourceDimens from './extension/resource/dimens';
import ResourceFonts from './extension/resource/fonts';
import ResourceIncludes from './extension/resource/includes';
import ResourceStrings from './extension/resource/strings';
import ResourceStyles from './extension/resource/styles';
import ResourceSvg from './extension/resource/svg';

import * as constant from './lib/constant';
import * as enumeration from './lib/enumeration';
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
let viewController: Controller<T>;
let resourceHandler: Resource<T>;
let fileHandler: File<T>;
let settings: SettingsAndroid;

const framework: number = androme.lib.enumeration.APP_FRAMEWORK.ANDROID;

const lib = {
    base: {
        Controller,
        File,
        Resource,
        View
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
        Sprite,
        Table,
        constraint: {
            Guideline: ConstraintGuideline
        },
        element: {
            Custom: ElementCustom
        },
        resource: {
            Background: ResourceBackground,
            Dimens: ResourceDimens,
            Fonts: ResourceFonts,
            Includes: ResourceIncludes,
            Strings: ResourceStrings,
            Styles: ResourceStyles,
            Svg: ResourceSvg
        }
    },
    constant,
    enumeration,
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
        fileHandler = new File<T>(settings);
        application = new androme.lib.base.Application(framework);
        viewController = new Controller<T>();
        resourceHandler = new Resource<T>(fileHandler);
        application.registerController(viewController);
        application.registerResource(resourceHandler);
        application.nodeObject = View;
        Object.assign(application.builtInExtensions, {
            [EXT_NAME.EXTERNAL]: new External(EXT_NAME.EXTERNAL, framework),
            [EXT_NAME.ORIGIN]: new Origin(EXT_NAME.ORIGIN, framework),
            [EXT_NAME.SPRITE]: new Sprite(EXT_NAME.SPRITE, framework),
            [EXT_NAME.CSS_GRID]: new CssGrid(EXT_NAME.CSS_GRID, framework),
            [EXT_NAME.FLEXBOX]: new Flexbox(EXT_NAME.FLEXBOX, framework),
            [EXT_NAME.TABLE]: new Table(EXT_NAME.TABLE, framework, ['TABLE']),
            [EXT_NAME.LIST]: new List(EXT_NAME.LIST, framework, ['UL', 'OL', 'DL', 'DIV']),
            [EXT_NAME.GRID]: new Grid(EXT_NAME.GRID, framework, ['FORM', 'UL', 'OL', 'DL', 'DIV', 'TABLE', 'NAV', 'SECTION', 'ASIDE', 'MAIN', 'HEADER', 'FOOTER', 'P', 'ARTICLE', 'FIELDSET', 'SPAN']),
            [EXT_NAME.PERCENT]: new Percent(EXT_NAME.PERCENT, framework),
            [EXT_NAME.ACCESSIBILITY]: new Accessibility(EXT_NAME.ACCESSIBILITY, framework),
            [EXT_ANDROID.CONSTRAINT_GUIDELINE]: new ConstraintGuideline(EXT_ANDROID.CONSTRAINT_GUIDELINE, framework),
            [EXT_ANDROID.ELEMENT_CUSTOM]: new ElementCustom(EXT_ANDROID.ELEMENT_CUSTOM, framework),
            [EXT_ANDROID.RESOURCE_INCLUDES]: new ResourceIncludes(EXT_ANDROID.RESOURCE_INCLUDES, framework),
            [EXT_ANDROID.RESOURCE_BACKGROUND]: new ResourceBackground(EXT_ANDROID.RESOURCE_BACKGROUND, framework),
            [EXT_ANDROID.RESOURCE_SVG]: new ResourceSvg(EXT_ANDROID.RESOURCE_SVG, framework),
            [EXT_ANDROID.RESOURCE_STRINGS]: new ResourceStrings(EXT_ANDROID.RESOURCE_STRINGS, framework),
            [EXT_ANDROID.RESOURCE_FONTS]: new ResourceFonts(EXT_ANDROID.RESOURCE_FONTS, framework),
            [EXT_ANDROID.RESOURCE_DIMENS]: new ResourceDimens(EXT_ANDROID.RESOURCE_DIMENS, framework),
            [EXT_ANDROID.RESOURCE_STYLES]: new ResourceStyles(EXT_ANDROID.RESOURCE_STYLES, framework)
        });
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
import { UserSettingsAndroid } from './types/module';

import { EXT_ANDROID, XMLNS_ANDROID } from './lib/constant';
import SETTINGS from './settings';

import Controller from './controller';
import ExtensionManager from './extensionmanager';
import File from './file';
import Resource from './resource';
import View from './view';

import Accessibility from './extension/accessibility';
import CssGrid from './extension/cssgrid';
import External from './extension/external';
import Flexbox from './extension/flexbox';
import Grid from './extension/grid';
import List from './extension/list';
import Relative from './extension/relative';
import Sprite from './extension/sprite';
import Substitute from './extension/substitute';
import Table from './extension/table';
import VerticalAlign from './extension/verticalalign';
import WhiteSpace from './extension/whitespace';

import ConstraintGuideline from './extension/constraint/guideline';

import DelegateFixed from './extension/delegate/fixed';
import DelegateMaxWidthHeight from './extension/delegate/max-width-height';
import DelegatePercent from './extension/delegate/percent';
import DelegateRadioGroup from './extension/delegate/radiogroup';
import DelegateScrollBar from './extension/delegate/scrollbar';

import ResourceBackground from './extension/resource/background';
import ResourceDimens from './extension/resource/dimens';
import ResourceFonts from './extension/resource/fonts';
import ResourceIncludes from './extension/resource/includes';
import ResourceStrings from './extension/resource/strings';
import ResourceStyles from './extension/resource/styles';
import ResourceSvg from './extension/resource/svg';

import * as constant from './lib/constant';
import * as customization from './lib/customization';
import * as enumeration from './lib/enumeration';
import * as util from './lib/util';

type T = View;
type Application = androme.lib.base.Application<T>;

function autoClose() {
    if (application && application.userSettings.autoCloseOnWrite && !application.initialized && !application.closed) {
        application.finalize();
        return true;
    }
    return false;
}

function checkApplication(main?: Application): main is Application {
    return initialized && !!main && (main.closed || autoClose());
}

let initialized = false;

let application: Application;
let fileHandler: File<T>;
let userSettings: UserSettingsAndroid;

const framework = androme.lib.enumeration.APP_FRAMEWORK.ANDROID;

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
        Relative,
        Sprite,
        Table,
        VerticalAlign,
        WhiteSpace,
        constraint: {
            Guideline: ConstraintGuideline
        },
        delegate: {
            Fixed: DelegateFixed,
            MaxWidthHeight: DelegateMaxWidthHeight,
            Percent: DelegatePercent,
            RadioGroup: DelegateRadioGroup,
            ScrollBar: DelegateScrollBar
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
    customization,
    enumeration,
    util
};

const appBase: AppFramework<T> = {
    lib,
    system: {
        customize(build: number, widget: string, options: {}) {
            if (customization.API_ANDROID[build]) {
                const assign = customization.API_ANDROID[build].assign;
                if (assign[widget] === undefined) {
                    assign[widget] = {};
                }
                Object.assign(assign[widget], options);
            }
        },
        addXmlNs(name: string, uri: string) {
            XMLNS_ANDROID[name] = uri;
        },
        writeLayoutAllXml(saveToDisk = false) {
            if (fileHandler && checkApplication(application)) {
                return fileHandler.layoutAllToXml(application.sessionData, saveToDisk);
            }
            return '';
        },
        writeResourceAllXml(saveToDisk = false) {
            if (fileHandler && checkApplication(application)) {
                return fileHandler.resourceAllToXml(saveToDisk);
            }
            return '';
        },
        writeResourceStringXml(saveToDisk = false) {
            if (fileHandler && checkApplication(application)) {
                return fileHandler.resourceStringToXml(saveToDisk);
            }
            return '';
        },
        writeResourceArrayXml(saveToDisk = false) {
            if (fileHandler && checkApplication(application)) {
                return fileHandler.resourceStringArrayToXml(saveToDisk);
            }
            return '';
        },
        writeResourceFontXml(saveToDisk = false) {
            if (fileHandler && checkApplication(application)) {
                return fileHandler.resourceFontToXml(saveToDisk);
            }
            return '';
        },
        writeResourceColorXml(saveToDisk = false) {
            if (fileHandler && checkApplication(application)) {
                return fileHandler.resourceColorToXml(saveToDisk);
            }
            return '';
        },
        writeResourceStyleXml(saveToDisk = false) {
            if (fileHandler && checkApplication(application)) {
                return fileHandler.resourceStyleToXml(saveToDisk);
            }
            return '';
        },
        writeResourceDimenXml(saveToDisk = false) {
            if (fileHandler && checkApplication(application)) {
                return fileHandler.resourceDimenToXml(saveToDisk);
            }
            return '';
        },
        writeResourceDrawableXml(saveToDisk = false) {
            if (fileHandler && checkApplication(application)) {
                return fileHandler.resourceDrawableToXml(saveToDisk);
            }
            return '';
        }
    },
    create() {
        const EN = androme.lib.constant.EXT_NAME;
        const EA = EXT_ANDROID;
        application = new androme.lib.base.Application(framework, Controller, Resource, ExtensionManager, View);
        fileHandler = new File(application.resourceHandler);
        userSettings = Object.assign({}, SETTINGS);
        Object.assign(application.builtInExtensions, {
            [EN.EXTERNAL]: new External(EN.EXTERNAL, framework),
            [EN.SUBSTITUTE]: new Substitute(EN.SUBSTITUTE, framework),
            [EN.SPRITE]: new Sprite(EN.SPRITE, framework),
            [EN.CSS_GRID]: new CssGrid(EN.CSS_GRID, framework),
            [EN.FLEXBOX]: new Flexbox(EN.FLEXBOX, framework),
            [EN.TABLE]: new Table(EN.TABLE, framework, ['TABLE']),
            [EN.LIST]: new List(EN.LIST, framework, ['UL', 'OL', 'DL', 'DIV']),
            [EN.GRID]: new Grid(EN.GRID, framework, ['FORM', 'UL', 'OL', 'DL', 'DIV', 'TABLE', 'NAV', 'SECTION', 'ASIDE', 'MAIN', 'HEADER', 'FOOTER', 'P', 'ARTICLE', 'FIELDSET', 'SPAN']),
            [EN.RELATIVE]: new Relative(EN.RELATIVE, framework),
            [EN.VERTICAL_ALIGN]: new VerticalAlign(EN.VERTICAL_ALIGN, framework),
            [EN.WHITESPACE]: new WhiteSpace(EN.WHITESPACE, framework),
            [EN.ACCESSIBILITY]: new Accessibility(EN.ACCESSIBILITY, framework),
            [EA.CONSTRAINT_GUIDELINE]: new ConstraintGuideline(EA.CONSTRAINT_GUIDELINE, framework),
            [EA.DELEGATE_FIXED]: new DelegateFixed(EA.DELEGATE_FIXED, framework),
            [EA.DELEGATE_MAXWIDTHHEIGHT]: new DelegateMaxWidthHeight(EA.DELEGATE_MAXWIDTHHEIGHT, framework),
            [EA.DELEGATE_PERCENT]: new DelegatePercent(EA.DELEGATE_PERCENT, framework),
            [EA.DELEGATE_RADIOGROUP]: new DelegateRadioGroup(EA.DELEGATE_RADIOGROUP, framework),
            [EA.DELEGATE_SCROLLBAR]: new DelegateScrollBar(EA.DELEGATE_SCROLLBAR, framework),
            [EA.RESOURCE_INCLUDES]: new ResourceIncludes(EA.RESOURCE_INCLUDES, framework),
            [EA.RESOURCE_BACKGROUND]: new ResourceBackground(EA.RESOURCE_BACKGROUND, framework),
            [EA.RESOURCE_SVG]: new ResourceSvg(EA.RESOURCE_SVG, framework),
            [EA.RESOURCE_STRINGS]: new ResourceStrings(EA.RESOURCE_STRINGS, framework),
            [EA.RESOURCE_FONTS]: new ResourceFonts(EA.RESOURCE_FONTS, framework),
            [EA.RESOURCE_DIMENS]: new ResourceDimens(EA.RESOURCE_DIMENS, framework),
            [EA.RESOURCE_STYLES]: new ResourceStyles(EA.RESOURCE_STYLES, framework)
        });
        initialized = true;
        return {
            application,
            framework,
            userSettings
        };
    },
    cached() {
        if (initialized) {
            return {
                application,
                framework,
                userSettings
            };
        }
        return appBase.create();
    }
};

export default appBase;
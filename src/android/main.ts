
import { AppFramework } from '../base/lib/types';
import { ObjectMap } from '../lib/types';
import { IExtension } from '../extension/lib/types';
import View from './view';
import ViewController from './viewcontroller';
import ResourceAndroid from './resource';
import FileAndroid from './file';
import Settings from './settings';
import API_ANDROID from './customizations';
import { XMLNS_ANDROID } from './constants';

import { EXT_NAME } from '../extension/lib/constants';
import { WIDGET_NAME } from './extension/lib/constants';

import External from '../extension/external';
import Origin from '../extension/origin';
import Custom from './extension/custom';
import Accessibility from './extension/accessibility';
import List from './extension/list';
import Grid from './extension/grid';
import Table from './extension/table';
import Button from './extension/widget/floatingactionbutton';
import Menu from './extension/widget/menu';
import Coordinator from './extension/widget/coodinator';
import Toolbar from './extension/widget/toolbar';
import BottomNavigation from './extension/widget/bottomnavigation';
import Drawer from './extension/widget/drawer';

function autoClose() {
    const main = Controller.application;
    if (main.settings.autoCloseOnWrite && !main.loading && !main.closed) {
        main.finalize();
        return true;
    }
    return false;
}

type T = View;

let initialized = false;

let Controller: ViewController<T>;
let File: FileAndroid<T>;
let Resource: ResourceAndroid<T>;
let settings: ObjectMap<any>;
let builtInExtensions: ObjectMap<IExtension>;

const appBase: AppFramework<T> = {
    create() {
        Controller = new ViewController<T>();
        File = new FileAndroid<T>(Settings);
        Resource = new ResourceAndroid<T>(File);
        builtInExtensions = {
            [EXT_NAME.EXTERNAL]: new External(EXT_NAME.EXTERNAL),
            [EXT_NAME.ORIGIN]: new Origin(EXT_NAME.ORIGIN),
            [EXT_NAME.CUSTOM]: new Custom(EXT_NAME.CUSTOM),
            [EXT_NAME.ACCESSIBILITY]: new Accessibility(EXT_NAME.ACCESSIBILITY),
            [EXT_NAME.LIST]: new List(EXT_NAME.LIST, ['UL', 'OL', 'DL', 'DIV']),
            [EXT_NAME.TABLE]: new Table(EXT_NAME.TABLE, ['TABLE']),
            [EXT_NAME.GRID]: new Grid(EXT_NAME.GRID, ['FORM', 'UL', 'OL', 'DL', 'DIV', 'TABLE', 'NAV', 'SECTION', 'ASIDE', 'MAIN', 'HEADER', 'FOOTER', 'P', 'ARTICLE', 'FIELDSET', 'SPAN']),
            [WIDGET_NAME.FAB]: new Button(WIDGET_NAME.FAB, ['BUTTON', 'INPUT', 'IMG']),
            [WIDGET_NAME.MENU]: new Menu(WIDGET_NAME.MENU, ['NAV']),
            [WIDGET_NAME.COORDINATOR]: new Coordinator(WIDGET_NAME.COORDINATOR),
            [WIDGET_NAME.TOOLBAR]: new Toolbar(WIDGET_NAME.TOOLBAR),
            [WIDGET_NAME.BOTTOM_NAVIGATION]: new BottomNavigation(WIDGET_NAME.BOTTOM_NAVIGATION),
            [WIDGET_NAME.DRAWER]: new Drawer(WIDGET_NAME.DRAWER)
        };
        settings = Object.assign({}, Settings);
        initialized = true;
        return {
            settings,
            Node: View,
            Controller,
            Resource,
            builtInExtensions
        };
    },
    cached() {
        if (initialized) {
            return {
                settings,
                Node: View,
                Controller,
                Resource,
                builtInExtensions
            };
        }
        return appBase.create();
    },
    system: {
        writeLayoutAllXml(saveToDisk = false) {
            if (initialized) {
                const main = Controller.application;
                if (main.closed || autoClose()) {
                    return Resource.file.layoutAllToXml(main.viewData, saveToDisk);
                }
            }
            return '';
        },
        writeResourceAllXml(saveToDisk = false) {
            if (initialized) {
                const main = Controller.application;
                if (main.closed || autoClose()) {
                    return Resource.file.resourceAllToXml(saveToDisk);
                }
            }
            return '';
        },
        writeResourceStringXml(saveToDisk = false) {
            if (initialized) {
                const main = Controller.application;
                if (main.closed || autoClose()) {
                    return Resource.file.resourceStringToXml(saveToDisk);
                }
            }
            return '';
        },
        writeResourceArrayXml(saveToDisk = false) {
            if (initialized) {
                const main = Controller.application;
                if (main.closed || autoClose()) {
                    return Resource.file.resourceStringArrayToXml(saveToDisk);
                }
            }
            return '';
        },
        writeResourceFontXml(saveToDisk = false) {
            if (initialized) {
                const main = Controller.application;
                if (main.closed || autoClose()) {
                    return Resource.file.resourceFontToXml(saveToDisk);
                }
            }
            return '';
        },
        writeResourceColorXml(saveToDisk = false) {
            if (initialized) {
                const main = Controller.application;
                if (main.closed || autoClose()) {
                    return Resource.file.resourceColorToXml(saveToDisk);
                }
            }
            return '';
        },
        writeResourceStyleXml(saveToDisk = false) {
            if (initialized) {
                const main = Controller.application;
                if (main.closed || autoClose()) {
                    return Resource.file.resourceStyleToXml(saveToDisk);
                }
            }
            return '';
        },
        writeResourceDimenXml(saveToDisk = false) {
            if (initialized) {
                const main = Controller.application;
                if (main.closed || autoClose()) {
                    return Resource.file.resourceDimenToXml(saveToDisk);
                }
            }
            return '';
        },
        writeResourceDrawableXml(saveToDisk = false) {
            if (initialized) {
                const main = Controller.application;
                if (main.closed || autoClose()) {
                    return Resource.file.resourceDrawableToXml(saveToDisk);
                }
            }
            return '';
        },
        addXmlNs(name: string, uri: string) {
            XMLNS_ANDROID[name] = uri;
        },
        customize(build: number, widget: string, options: {}) {
            if (API_ANDROID[build] != null) {
                const customizations = API_ANDROID[build].customizations;
                if (customizations[widget] == null) {
                    customizations[widget] = {};
                }
                Object.assign(customizations[widget], options);
            }
        }
    }
};

export default appBase;
import { BUILD_ANDROID } from './lib/enumeration';

import View from './view';

type T = View;

type Customizations = {
    [index: number]: {
        android: ObjectMap<boolean | SelfWrapped<T, boolean>>;
        app: ObjectMap<boolean | SelfWrapped<T, boolean>>;
        customizations: {
            [namespace: string]: ObjectMap<StringMap>;
        };
    };
};

const API_ANDROID: Customizations = {
    [BUILD_ANDROID.PIE]: {
        android: {},
        app: {},
        customizations: {}
    },
    [BUILD_ANDROID.OREO_1]: {
        android: {},
        app: {},
        customizations: {}
    },
    [BUILD_ANDROID.OREO]: {
        android: {},
        app: {},
        customizations: {}
    },
    [BUILD_ANDROID.NOUGAT_1]: {
        android: {
            'fontWeight': false,
            'layout_marginHorizontal': false,
            'layout_marginVertical': false,
            'paddingHorizontal': false,
            'paddingVertical': false
        },
        app: {},
        customizations: {}
    },
    [BUILD_ANDROID.NOUGAT]: {
        android: {},
        app: {},
        customizations: {}
    },
    [BUILD_ANDROID.MARSHMALLOW]: {
        android: {},
        app: {},
        customizations: {}
    },
    [BUILD_ANDROID.LOLLIPOP_1]: {
        android: {},
        app: {},
        customizations: {}
    },
    [BUILD_ANDROID.LOLLIPOP]: {
        android: {},
        app: {},
        customizations: {}
    },
    [BUILD_ANDROID.KITKAT_1]: {
        android: {
            'layout_columnWeight': false,
            'src': (node: T, result: {}) => {
                if (node.svgElement) {
                    result['obj'] = 'app';
                    result['attr'] = 'srcCompat';
                }
                return true;
            }
        },
        app: {},
        customizations: {}
    },
    [BUILD_ANDROID.KITKAT]: {
        android: {},
        app: {},
        customizations: {}
    },
    [BUILD_ANDROID.JELLYBEAN_2]: {
        android: {},
        app: {},
        customizations: {}
    },
    [BUILD_ANDROID.JELLYBEAN_1]: {
        android: {},
        app: {},
        customizations: {}
    },
    [BUILD_ANDROID.JELLYBEAN]: {
        android: {
            'labelFor': false
        },
        app: {},
        customizations: {}
    },
    [BUILD_ANDROID.ICE_CREAM_SANDWICH_1]: {
        android: {},
        app: {},
        customizations: {}
    },
    [BUILD_ANDROID.ICE_CREAM_SANDWICH]: {
        android: {},
        app: {},
        customizations: {}
    },
    [BUILD_ANDROID.ALL]: {
        android: {},
        app: {},
        customizations: {
            SUB: {
                android: {
                    layout_marginTop: '6px'
                }
            },
            SUP: {
                android: {
                    layout_marginTop: '-4px'
                }
            },
            Button: {
                android: {
                    textAllCaps: 'false'
                }
            }
        }
    }
};

export default API_ANDROID;
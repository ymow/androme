export const EXT_ANDROID = {
    ELEMENT_CUSTOM: 'android.element.custom',
    CONSTRAINT_GUIDELINE: 'android.constraint.guideline',
    RESOURCE_INCLUDES: 'android.resource.includes',
    RESOURCE_BACKGROUND: 'android.resource.background',
    RESOURCE_SVG: 'android.resource.svg',
    RESOURCE_STRINGS: 'android.resource.strings',
    RESOURCE_FONTS: 'android.resource.fonts',
    RESOURCE_DIMENS: 'android.resource.dimens',
    RESOURCE_STYLES: 'android.resource.styles'
};

export const NODE_ANDROID = {
    CHECKBOX: 'CheckBox',
    RADIO: 'RadioButton',
    EDIT: 'EditText',
    SELECT: 'Spinner',
    RANGE: 'SeekBar',
    SVG: 'ImageView',
    TEXT: 'TextView',
    IMAGE: 'ImageView',
    BUTTON: 'Button',
    INLINE: 'FrameLayout',
    LINE: 'View',
    SPACE: 'Space',
    BLOCK: 'LinearLayout',
    WEB_VIEW: 'WebView',
    FRAME: 'FrameLayout',
    LINEAR: 'LinearLayout',
    RADIO_GROUP: 'RadioGroup',
    GRID: 'GridLayout',
    RELATIVE: 'RelativeLayout',
    CONSTRAINT: 'android.support.constraint.ConstraintLayout',
    SCROLL_HORIZONTAL: 'HorizontalScrollView',
    SCROLL_VERTICAL: 'android.support.v4.widget.NestedScrollView',
    GUIDELINE: 'android.support.constraint.Guideline'
};

export const VIEW_SUPPORT = {
    DRAWER: 'android.support.v4.widget.DrawerLayout',
    NAVIGATION_VIEW: 'android.support.design.widget.NavigationView',
    COORDINATOR: 'android.support.design.widget.CoordinatorLayout',
    APPBAR: 'android.support.design.widget.AppBarLayout',
    COLLAPSING_TOOLBAR: 'android.support.design.widget.CollapsingToolbarLayout',
    TOOLBAR: 'android.support.v7.widget.Toolbar',
    FLOATING_ACTION_BUTTON: 'android.support.design.widget.FloatingActionButton',
    BOTTOM_NAVIGATION: 'android.support.design.widget.BottomNavigationView'
};

export const BOX_ANDROID = {
    MARGIN: 'layout_margin',
    MARGIN_VERTICAL: 'layout_marginVertical',
    MARGIN_HORIZONTAL: 'layout_marginHorizontal',
    MARGIN_TOP: 'layout_marginTop',
    MARGIN_RIGHT: 'layout_marginRight',
    MARGIN_BOTTOM: 'layout_marginBottom',
    MARGIN_LEFT: 'layout_marginLeft',
    PADDING: 'padding',
    PADDING_VERTICAL: 'paddingVertical',
    PADDING_HORIZONTAL: 'paddingHorizontal',
    PADDING_TOP: 'paddingTop',
    PADDING_RIGHT: 'paddingRight',
    PADDING_BOTTOM: 'paddingBottom',
    PADDING_LEFT: 'paddingLeft'
};

export const AXIS_ANDROID = {
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical'
};

export const LAYOUT_ANDROID = {
    relativeParent: {
        left: 'layout_alignParentLeft',
        top: 'layout_alignParentTop',
        right: 'layout_alignParentRight',
        bottom: 'layout_alignParentBottom',
        centerHorizontal: 'layout_centerHorizontal',
        centerVertical: 'layout_centerVertical',
    },
    relative: {
        left: 'layout_alignLeft',
        top: 'layout_alignTop',
        right: 'layout_alignRight',
        bottom: 'layout_alignBottom',
        baseline: 'layout_alignBaseline',
        leftRight: 'layout_toRightOf',
        rightLeft: 'layout_toLeftOf',
        topBottom: 'layout_below',
        bottomTop: 'layout_above',
    },
    constraint: {
        left: 'layout_constraintLeft_toLeftOf',
        top: 'layout_constraintTop_toTopOf',
        right: 'layout_constraintRight_toRightOf',
        bottom: 'layout_constraintBottom_toBottomOf',
        leftRight: 'layout_constraintLeft_toRightOf',
        rightLeft: 'layout_constraintRight_toLeftOf',
        baseline: 'layout_constraintBaseline_toBaselineOf',
        topBottom: 'layout_constraintTop_toBottomOf',
        bottomTop: 'layout_constraintBottom_toTopOf'
    }
};

export const XMLNS_ANDROID = {
    'android': 'http://schemas.android.com/apk/res/android',
    'app': 'http://schemas.android.com/apk/res-auto',
    'aapt': 'http://schemas.android.com/aapt',
    'tools': 'http://schemas.android.com/tools'
};

export const WEBVIEW_ANDROID = [
    'STRONG',
    'B',
    'EM',
    'CITE',
    'DFN',
    'I',
    'BIG',
    'SMALL',
    'FONT',
    'BLOCKQUOTE',
    'TT',
    'A',
    'U',
    'SUP',
    'SUB',
    'STRIKE',
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'DEL',
    'LABEL',
    'PLAINTEXT'
];

export const RESERVED_JAVA = [
    'abstract',
    'assert',
    'boolean',
    'break',
    'byte',
    'case',
    'catch',
    'char',
    'class',
    'const',
    'continue',
    'default',
    'double',
    'do',
    'else',
    'enum',
    'extends',
    'false',
    'final',
    'finally',
    'float',
    'for',
    'goto',
    'if',
    'implements',
    'import',
    'instanceof',
    'int',
    'interface',
    'long',
    'native',
    'new',
    'null',
    'package',
    'private',
    'protected',
    'public',
    'return',
    'short',
    'static',
    'strictfp',
    'super',
    'switch',
    'synchronized',
    'this',
    'throw',
    'throws',
    'transient',
    'true',
    'try',
    'void',
    'volatile',
    'while'
];

export const DRAWABLE_PREFIX = {
    MENU: 'ic_menu_',
    DIALOG: 'ic_dialog_'
};
/* androme 2.2.1
   https://github.com/anpham6/androme */

var android = (function () {
    'use strict';

    var BUILD_ANDROID;
    (function (BUILD_ANDROID) {
        BUILD_ANDROID[BUILD_ANDROID["PIE"] = 28] = "PIE";
        BUILD_ANDROID[BUILD_ANDROID["OREO_1"] = 27] = "OREO_1";
        BUILD_ANDROID[BUILD_ANDROID["OREO"] = 26] = "OREO";
        BUILD_ANDROID[BUILD_ANDROID["NOUGAT_1"] = 25] = "NOUGAT_1";
        BUILD_ANDROID[BUILD_ANDROID["NOUGAT"] = 24] = "NOUGAT";
        BUILD_ANDROID[BUILD_ANDROID["MARSHMALLOW"] = 23] = "MARSHMALLOW";
        BUILD_ANDROID[BUILD_ANDROID["LOLLIPOP_1"] = 22] = "LOLLIPOP_1";
        BUILD_ANDROID[BUILD_ANDROID["LOLLIPOP"] = 21] = "LOLLIPOP";
        BUILD_ANDROID[BUILD_ANDROID["KITKAT_1"] = 20] = "KITKAT_1";
        BUILD_ANDROID[BUILD_ANDROID["KITKAT"] = 19] = "KITKAT";
        BUILD_ANDROID[BUILD_ANDROID["JELLYBEAN_2"] = 18] = "JELLYBEAN_2";
        BUILD_ANDROID[BUILD_ANDROID["JELLYBEAN_1"] = 17] = "JELLYBEAN_1";
        BUILD_ANDROID[BUILD_ANDROID["JELLYBEAN"] = 16] = "JELLYBEAN";
        BUILD_ANDROID[BUILD_ANDROID["ICE_CREAM_SANDWICH_1"] = 15] = "ICE_CREAM_SANDWICH_1";
        BUILD_ANDROID[BUILD_ANDROID["ICE_CREAM_SANDWICH"] = 14] = "ICE_CREAM_SANDWICH";
        BUILD_ANDROID[BUILD_ANDROID["ALL"] = 0] = "ALL";
        BUILD_ANDROID[BUILD_ANDROID["LATEST"] = 28] = "LATEST";
    })(BUILD_ANDROID || (BUILD_ANDROID = {}));
    var DENSITY_ANDROID;
    (function (DENSITY_ANDROID) {
        DENSITY_ANDROID[DENSITY_ANDROID["LDPI"] = 120] = "LDPI";
        DENSITY_ANDROID[DENSITY_ANDROID["MDPI"] = 160] = "MDPI";
        DENSITY_ANDROID[DENSITY_ANDROID["HDPI"] = 240] = "HDPI";
        DENSITY_ANDROID[DENSITY_ANDROID["XHDPI"] = 320] = "XHDPI";
        DENSITY_ANDROID[DENSITY_ANDROID["XXHDPI"] = 480] = "XXHDPI";
        DENSITY_ANDROID[DENSITY_ANDROID["XXXHDPI"] = 640] = "XXXHDPI";
    })(DENSITY_ANDROID || (DENSITY_ANDROID = {}));

    var enumeration = /*#__PURE__*/Object.freeze({
        get BUILD_ANDROID () { return BUILD_ANDROID; },
        get DENSITY_ANDROID () { return DENSITY_ANDROID; }
    });

    const NODE_ANDROID = {
        CHECKBOX: 'CheckBox',
        RADIO: 'RadioButton',
        EDIT: 'EditText',
        SELECT: 'Spinner',
        RANGE: 'SeekBar',
        SVG: 'ImageView',
        TEXT: 'TextView',
        IMAGE: 'ImageView',
        BUTTON: 'Button',
        LINE: 'View',
        SPACE: 'Space',
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
    const VIEW_SUPPORT = {
        DRAWER: 'android.support.v4.widget.DrawerLayout',
        NAVIGATION_VIEW: 'android.support.design.widget.NavigationView',
        COORDINATOR: 'android.support.design.widget.CoordinatorLayout',
        APPBAR: 'android.support.design.widget.AppBarLayout',
        COLLAPSING_TOOLBAR: 'android.support.design.widget.CollapsingToolbarLayout',
        TOOLBAR: 'android.support.v7.widget.Toolbar',
        FLOATING_ACTION_BUTTON: 'android.support.design.widget.FloatingActionButton',
        BOTTOM_NAVIGATION: 'android.support.design.widget.BottomNavigationView'
    };
    const BOX_ANDROID = {
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
    const AXIS_ANDROID = {
        HORIZONTAL: 'horizontal',
        VERTICAL: 'vertical'
    };
    const XMLNS_ANDROID = {
        'android': 'http://schemas.android.com/apk/res/android',
        'app': 'http://schemas.android.com/apk/res-auto',
        'aapt': 'http://schemas.android.com/aapt',
        'tools': 'http://schemas.android.com/tools'
    };
    const FONT_ANDROID = {
        'sans-serif': BUILD_ANDROID.ICE_CREAM_SANDWICH,
        'sans-serif-thin': BUILD_ANDROID.JELLYBEAN,
        'sans-serif-light': BUILD_ANDROID.JELLYBEAN,
        'sans-serif-condensed': BUILD_ANDROID.JELLYBEAN,
        'sans-serif-condensed-light': BUILD_ANDROID.JELLYBEAN,
        'sans-serif-medium': BUILD_ANDROID.LOLLIPOP,
        'sans-serif-black': BUILD_ANDROID.LOLLIPOP,
        'sans-serif-smallcaps': BUILD_ANDROID.LOLLIPOP,
        'serif-monospace': BUILD_ANDROID.LOLLIPOP,
        'serif': BUILD_ANDROID.LOLLIPOP,
        'casual': BUILD_ANDROID.LOLLIPOP,
        'cursive': BUILD_ANDROID.LOLLIPOP,
        'monospace': BUILD_ANDROID.LOLLIPOP,
        'sans-serif-condensed-medium': BUILD_ANDROID.OREO
    };
    const FONTALIAS_ANDROID = {
        'arial': 'sans-serif',
        'helvetica': 'sans-serif',
        'tahoma': 'sans-serif',
        'verdana': 'sans-serif',
        'times': 'serif',
        'times new roman': 'serif',
        'palatino': 'serif',
        'georgia': 'serif',
        'baskerville': 'serif',
        'goudy': 'serif',
        'fantasy': 'serif',
        'itc stone serif': 'serif',
        'sans-serif-monospace': 'monospace',
        'monaco': 'monospace',
        'courier': 'serif-monospace',
        'courier new': 'serif-monospace'
    };
    const FONTREPLACE_ANDROID = {
        'ms shell dlg \\32': 'sans-serif',
        'system-ui': 'sans-serif',
        '-apple-system': 'sans-serif'
    };
    const FONTWEIGHT_ANDROID = {
        '100': 'thin',
        '200': 'extra_light',
        '300': 'light',
        '400': 'normal',
        '500': 'medium',
        '600': 'semi_bold',
        '700': 'bold',
        '800': 'extra_bold',
        '900': 'black'
    };
    const WEBVIEW_ANDROID = [
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
    const RESERVED_JAVA = [
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
    const DRAWABLE_PREFIX = {
        MENU: 'ic_menu_',
        DIALOG: 'ic_dialog_'
    };
    if (androme.lib.dom.isUserAgent(androme.lib.enumeration.USER_AGENT.EDGE)) {
        FONTREPLACE_ANDROID['consolas'] = 'monospace';
    }

    var constant = /*#__PURE__*/Object.freeze({
        NODE_ANDROID: NODE_ANDROID,
        VIEW_SUPPORT: VIEW_SUPPORT,
        BOX_ANDROID: BOX_ANDROID,
        AXIS_ANDROID: AXIS_ANDROID,
        XMLNS_ANDROID: XMLNS_ANDROID,
        FONT_ANDROID: FONT_ANDROID,
        FONTALIAS_ANDROID: FONTALIAS_ANDROID,
        FONTREPLACE_ANDROID: FONTREPLACE_ANDROID,
        FONTWEIGHT_ANDROID: FONTWEIGHT_ANDROID,
        WEBVIEW_ANDROID: WEBVIEW_ANDROID,
        RESERVED_JAVA: RESERVED_JAVA,
        DRAWABLE_PREFIX: DRAWABLE_PREFIX
    });

    const settings = {
        builtInExtensions: [
            'androme.external',
            'androme.origin',
            'androme.custom',
            'androme.accessibility',
            'androme.sprite',
            'androme.list',
            'androme.table',
            'androme.grid',
            'androme.percent'
        ],
        targetAPI: BUILD_ANDROID.OREO,
        density: DENSITY_ANDROID.MDPI,
        supportRTL: true,
        renderInlineText: true,
        ellipsisOnTextOverflow: true,
        preloadImages: true,
        dimensResourceValue: true,
        numberResourceValue: false,
        fontAliasResourceValue: true,
        vectorColorResourceValue: true,
        alwaysReevaluateResources: true,
        autoSizeBackgroundImage: true,
        autoSizePaddingAndBorderWidth: true,
        whitespaceHorizontalOffset: 3.5,
        whitespaceVerticalOffset: 16,
        constraintChainDisabled: false,
        constraintChainPackedHorizontalOffset: 3.5,
        constraintChainPackedVerticalOffset: 16,
        constraintCirclePositionAbsolute: false,
        constraintPercentAccuracy: 4,
        supportNegativeLeftTop: true,
        floatOverlapDisabled: false,
        hideOffScreenElements: true,
        collapseUnattributedElements: true,
        customizationsOverwritePrivilege: true,
        showAttributes: true,
        insertSpaces: 4,
        convertPixels: 'dp',
        handleExtensionsAsync: true,
        autoCloseOnWrite: true,
        outputDirectory: 'app/src/main',
        outputMainFileName: 'activity_main.xml',
        outputArchiveFileType: 'zip',
        outputMaxProcessingTime: 30
    };

    function substitute(result, value, api, minApi = 0) {
        if (!api || api >= minApi) {
            result['attr'] = value;
        }
        return true;
    }
    const API_ANDROID = {
        [BUILD_ANDROID.PIE]: {
            android: {},
            app: {},
            customizations: {}
        },
        [BUILD_ANDROID.OREO_1]: {
            android: {
                'accessibilityHeading': false,
                'accessibilityPaneTitle': false,
                'appComponentFactory': false,
                'buttonCornerRadius': false,
                'cantSaveState': false,
                'dialogCornerRadius': false,
                'fallbackLineSpacing': false,
                'firstBaselineToTopHeight': false,
                'fontVariationSettings': false,
                'lastBaselineToBottomHeight': false,
                'lineHeight': false,
                'maxLongVersionCode': false,
                'outlineAmbientShadowColor': false,
                'outlineSpotShadowColor': false,
                'screenReaderFocusable': false,
                'textFontWeight': false,
                'ttcIndex': false,
                'versionCodeMajor': false,
                'versionMajor': false,
                'widgetFeatures': false,
                'windowLayoutInDisplayCutoutMode': false
            },
            app: {},
            customizations: {}
        },
        [BUILD_ANDROID.OREO]: {
            android: {
                'classLoader': false,
                'navigationBarDividerColor': false,
                'showWhenLocked': false,
                'turnScreenOn': false,
                'windowLightNavigationBar': false
            },
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
            android: {
                'colorSecondary': false,
                'contextDescription': false,
                'contextUri': false,
                'roundIcon': false,
                'shortcutDisabledMessage': false,
                'shortcutId': false,
                'shortcutLongLabel': false,
                'shortcutShortLabel': false,
                'showMetadataInPreview': false,
            },
            app: {},
            customizations: {}
        },
        [BUILD_ANDROID.MARSHMALLOW]: {
            android: {
                'backupInForeground': false,
                'bitmap': false,
                'buttonGravity': false,
                'canControlMagnification': false,
                'canPerformGestures': false,
                'canRecord': false,
                'collapseIcon': false,
                'contentInsetEndWithActions': false,
                'contentInsetStartWithNavigation': false,
                'contextPopupMenuStyle': false,
                'countDown': false,
                'defaultHeight': false,
                'defaultToDeviceProtectedStorage': false,
                'defaultWidth': false,
                'directBootAware': false,
                'enableVrMode': false,
                'endX': false,
                'endY': false,
                'externalService': false,
                'fillType': false,
                'forceHasOverlappingRendering': false,
                'hotSpotX': false,
                'hotSpotY': false,
                'languageTag': false,
                'level': false,
                'listMenuViewStyle': false,
                'maxButtonHeight': false,
                'networkSecurityConfig': false,
                'numberPickerStyle': false,
                'offset': false,
                'pointerIcon': false,
                'popupEnterTransition': false,
                'popupExitTransition': false,
                'preferenceFragmentStyle': false,
                'resizeableActivity': false,
                'startX': false,
                'startY': false,
                'subMenuArrow': false,
                'supportsLocalInteraction': false,
                'supportsPictureInPicture': false,
                'textAppearancePopupMenuHeader': false,
                'tickMark': false,
                'tickMarkTint': false,
                'tickMarkTintMode': false,
                'titleMargin': false,
                'titleMarginBottom': false,
                'titleMarginEnd': false,
                'titleMarginStart': false,
                'titleMarginTop': false,
                'tunerCount': false,
                'use32bitAbi': false,
                'version': false,
                'windowBackgroundFallback': false
            },
            app: {},
            customizations: {}
        },
        [BUILD_ANDROID.LOLLIPOP_1]: {
            android: {
                'allowUndo': false,
                'autoVerify': false,
                'breakStrategy': false,
                'colorBackgroundFloating': false,
                'contextClickable': false,
                'drawableTint': false,
                'drawableTintMode': false,
                'end': (result) => substitute(result, 'right'),
                'extractNativeLibs': false,
                'fingerprintAuthDrawable': false,
                'fraction': false,
                'fullBackupContent': false,
                'hyphenationFrequency': false,
                'lockTaskMode': false,
                'logoDescription': false,
                'numbersInnerTextColor': false,
                'scrollIndicators': false,
                'showForAllUsers': false,
                'start': (result) => substitute(result, 'left'),
                'subtitleTextColor': false,
                'supportsAssist': false,
                'supportsLaunchVoiceAssistFromKeyguard': false,
                'thumbPosition': false,
                'titleTextColor': false,
                'trackTint': false,
                'trackTintMode': false,
                'usesCleartextTraffic': false,
                'windowLightStatusBar': false
            },
            app: {},
            customizations: {}
        },
        [BUILD_ANDROID.LOLLIPOP]: {
            android: {
                'accessibilityTraversalAfter': false,
                'accessibilityTraversalBefore': false,
                'collapseContentDescription': false,
                'dialogPreferredPadding': false,
                'resizeClip': false,
                'revisionCode': false,
                'searchHintIcon': false
            },
            app: {},
            customizations: {}
        },
        [BUILD_ANDROID.KITKAT_1]: {
            android: {
                'actionBarPopupTheme': false,
                'actionBarTheme': false,
                'actionModeFindDrawable': false,
                'actionModeShareDrawable': false,
                'actionModeWebSearchDrawable': false,
                'actionOverflowMenuStyle': false,
                'amPmBackgroundColor': false,
                'amPmTextColor': false,
                'ambientShadowAlpha': false,
                'autoRemoveFromRecents': false,
                'backgroundTint': false,
                'backgroundTintMode': false,
                'banner': false,
                'buttonBarNegativeButtonStyle': false,
                'buttonBarNeutralButtonStyle': false,
                'buttonBarPositiveButtonStyle': false,
                'buttonTint': false,
                'buttonTintMode': false,
                'calendarTextColor': false,
                'checkMarkTint': false,
                'checkMarkTintMode': false,
                'closeIcon': false,
                'colorAccent': false,
                'colorButtonNormal': false,
                'colorControlActivated': false,
                'colorControlHighlight': false,
                'colorControlNormal': false,
                'colorEdgeEffect': false,
                'colorPrimary': false,
                'colorPrimaryDark': false,
                'commitIcon': false,
                'contentAgeHint': false,
                'contentInsetEnd': false,
                'contentInsetLeft': false,
                'contentInsetRight': false,
                'contentInsetStart': false,
                'controlX1': false,
                'controlX2': false,
                'controlY1': false,
                'controlY2': false,
                'country': false,
                'datePickerDialogTheme': false,
                'datePickerMode': false,
                'dayOfWeekBackground': false,
                'dayOfWeekTextAppearance': false,
                'documentLaunchMode': false,
                'elegantTextHeight': false,
                'elevation': false,
                'excludeClass': false,
                'excludeId': false,
                'excludeName': false,
                'fastScrollStyle': false,
                'fillAlpha': false,
                'fillColor': false,
                'fontFeatureSettings': false,
                'foregroundTint': false,
                'foregroundTintMode': false,
                'fragmentAllowEnterTransitionOverlap': false,
                'fragmentAllowReturnTransitionOverlap': false,
                'fragmentEnterTransition': false,
                'fragmentExitTransition': false,
                'fragmentReenterTransition': false,
                'fragmentReturnTransition': false,
                'fragmentSharedElementEnterTransition': false,
                'fragmentSharedElementReturnTransition': false,
                'fromId': false,
                'fullBackupOnly': false,
                'goIcon': false,
                'headerAmPmTextAppearance': false,
                'headerDayOfMonthTextAppearance': false,
                'headerMonthTextAppearance': false,
                'headerTimeTextAppearance': false,
                'headerYearTextAppearance': false,
                'hideOnContentScroll': false,
                'indeterminateTint': false,
                'indeterminateTintMode': false,
                'inset': false,
                'isGame': false,
                'launchTaskBehindSourceAnimation': false,
                'launchTaskBehindTargetAnimation': false,
                'layout_columnWeight': false,
                'layout_rowWeight': false,
                'letterSpacing': false,
                'matchOrder': false,
                'maxRecentsv': false,
                'maximumAngle': false,
                'minimumHorizontalAngle': false,
                'minimumVerticalAngle': false,
                'multiArch': false,
                'navigationBarColor': false,
                'navigationContentDescription': false,
                'navigationIcon': false,
                'nestedScrollingEnabled': false,
                'numbersBackgroundColor': false,
                'numbersSelectorColor': false,
                'numbersTextColor': false,
                'outlineProvider': false,
                'overlapAnchor': false,
                'paddingMode': false,
                'pathData': false,
                'patternPathData': false,
                'persistableMode': false,
                'popupElevation': false,
                'popupTheme': false,
                'progressBackgroundTint': false,
                'progressBackgroundTintMode': false,
                'progressTint': false,
                'progressTintMode': false,
                'propertyXName': false,
                'propertyYName': false,
                'queryBackground': false,
                'recognitionService': false,
                'relinquishTaskIdentity': false,
                'reparent': false,
                'reparentWithOverlay': false,
                'restrictionType': false,
                'resumeWhilePausing': false,
                'reversible': false,
                'searchIcon': false,
                'searchViewStyle': false,
                'secondaryProgressTint': false,
                'secondaryProgressTintMode': false,
                'selectableItemBackgroundBorderless': false,
                'sessionService': false,
                'setupActivity': false,
                'showText': false,
                'slideEdge': false,
                'splitTrack': false,
                'spotShadowAlpha': false,
                'src': (result, api, node) => {
                    if (node.svgElement) {
                        result['obj'] = 'app';
                        result['attr'] = 'srcCompat';
                    }
                    return true;
                },
                'stackViewStyle': false,
                'stateListAnimator': false,
                'statusBarColor': false,
                'strokeAlpha': false,
                'strokeColor': false,
                'strokeLineCap': false,
                'strokeLineJoin': false,
                'strokeMiterLimit': false,
                'strokeWidth': false,
                'submitBackground': false,
                'subtitleTextAppearance': false,
                'suggestionRowLayout': false,
                'switchStyle': false,
                'targetName': false,
                'textAppearanceListItemSecondary': false,
                'thumbTint': false,
                'thumbTintMode': false,
                'tileModeX': false,
                'tileModeY': false,
                'timePickerDialogTheme': false,
                'timePickerMode': false,
                'timePickerStyle': false,
                'tintMode': false,
                'titleTextAppearance': false,
                'toId': false,
                'toolbarStyle': false,
                'touchscreenBlocksFocus': false,
                'transitionGroup': false,
                'transitionName': false,
                'transitionVisibilityMode': false,
                'translateX': false,
                'translateY': false,
                'translationZ': false,
                'trimPathEnd': false,
                'trimPathOffset': false,
                'trimPathStart': false,
                'viewportHeight': false,
                'viewportWidth': false,
                'voiceIcon': false,
                'windowActivityTransitions': false,
                'windowAllowEnterTransitionOverlap': false,
                'windowAllowReturnTransitionOverlap': false,
                'windowClipToOutline': false,
                'windowContentTransitionManager': false,
                'windowContentTransitions': false,
                'windowDrawsSystemBarBackgrounds': false,
                'windowElevation': false,
                'windowEnterTransition': false,
                'windowExitTransition': false,
                'windowReenterTransition': false,
                'windowReturnTransition': false,
                'windowSharedElementEnterTransition': false,
                'windowSharedElementExitTransition': false,
                'windowSharedElementReenterTransition': false,
                'windowSharedElementReturnTransition': false,
                'windowSharedElementsUseOverlay': false,
                'windowTransitionBackgroundFadeDuration': false,
                'yearListItemTextAppearance': false,
                'yearListSelectorColor': false
            },
            app: {},
            customizations: {}
        },
        [BUILD_ANDROID.KITKAT]: {
            android: {
                'allowEmbedded': false,
                'windowSwipeToDismiss': false
            },
            app: {},
            customizations: {}
        },
        [BUILD_ANDROID.JELLYBEAN_2]: {
            android: {
                'accessibilityLiveRegion': false,
                'addPrintersActivity': false,
                'advancedPrintOptionsActivity': false,
                'apduServiceBanner': false,
                'autoMirrored': false,
                'category': false,
                'fadingMode': false,
                'fromScene': false,
                'isAsciiCapable': false,
                'keySet': false,
                'requireDeviceUnlock': false,
                'ssp': false,
                'sspPattern': false,
                'sspPrefix': false,
                'startDelay': false,
                'supportsSwitchingToNextInputMethod': false,
                'targetId': false,
                'toScene': false,
                'transition': false,
                'transitionOrdering': false,
                'vendor': false,
                'windowTranslucentNavigation': false,
                'windowTranslucentStatus': false
            },
            app: {},
            customizations: {}
        },
        [BUILD_ANDROID.JELLYBEAN_1]: {
            android: {
                'canRequestEnhancedWebAccessibility': (result, api) => api < BUILD_ANDROID.OREO,
                'canRequestFilterKeyEvents': false,
                'canRequestTouchExplorationMode': false,
                'childIndicatorEnd': false,
                'childIndicatorStart': false,
                'indicatorEnd': false,
                'indicatorStart': false,
                'layoutMode': false,
                'mipMap': false,
                'mirrorForRtl': false,
                'requiredAccountType': false,
                'requiredForAllUsers': false,
                'restrictedAccountType': false,
                'windowOverscan': false
            },
            app: {},
            customizations: {}
        },
        [BUILD_ANDROID.JELLYBEAN]: {
            android: {
                'checkedTextViewStyle': false,
                'format12Hour': false,
                'format24Hour': false,
                'initialKeyguardLayout': false,
                'labelFor': false,
                'layoutDirection': false,
                'layout_alignEnd': (result) => substitute(result, 'layout_alignRight'),
                'layout_alignParentEnd': (result) => substitute(result, 'layout_alignParentRight'),
                'layout_alignParentStart': (result) => substitute(result, 'layout_alignParentLeft'),
                'layout_alignStart': (result) => substitute(result, 'layout_alignLeft'),
                'layout_marginEnd': (result) => substitute(result, 'layout_marginRight'),
                'layout_marginStart': (result) => substitute(result, 'layout_marginLeft'),
                'layout_toEndOf': (result) => substitute(result, 'layout_toRightOf'),
                'layout_toStartOf': (result) => substitute(result, 'layout_toLeftOf'),
                'listPreferredItemPaddingEnd': (result) => substitute(result, 'listPreferredItemPaddingRight'),
                'listPreferredItemPaddingStart': (result) => substitute(result, 'listPreferredItemPaddingLeft'),
                'paddingEnd': (result) => substitute(result, 'paddingRight'),
                'paddingStart': (result) => substitute(result, 'paddingLeft'),
                'permissionFlags': false,
                'permissionGroupFlags': false,
                'presentationTheme': false,
                'showOnLockScreen': false,
                'singleUser': false,
                'subtypeId': false,
                'supportsRtl': false,
                'textAlignment': false,
                'textDirection': false,
                'timeZone': false,
                'widgetCategory': false
            },
            app: {},
            customizations: {}
        },
        [BUILD_ANDROID.ICE_CREAM_SANDWICH_1]: {
            android: {
                'fontFamily': false,
                'importantForAccessibility': false,
                'isolatedProcess': false,
                'keyboardLayout': false,
                'mediaRouteButtonStyle': false,
                'mediaRouteTypes': false,
                'parentActivityName': false
            },
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
                        'layout_marginTop': '6px'
                    }
                },
                SUP: {
                    android: {
                        'layout_marginTop': '-4px'
                    }
                },
                Button: {
                    android: {
                        'textAllCaps': 'false'
                    }
                }
            }
        }
    };
    const DEPRECATED_ANDROID = {
        android: {
            'amPmBackgroundColor': (result, api) => substitute(result, 'headerBackground', api, BUILD_ANDROID.MARSHMALLOW),
            'amPmTextColor': (result, api) => substitute(result, 'headerTextColor', api, BUILD_ANDROID.MARSHMALLOW),
            'animationResolution': (result, api) => api < BUILD_ANDROID.JELLYBEAN,
            'canRequestEnhancedWebAccessibility': (result, api) => api < BUILD_ANDROID.OREO,
            'dayOfWeekBackground': (result, api) => api < BUILD_ANDROID.MARSHMALLOW,
            'dayOfWeekTextAppearance': (result, api) => api < BUILD_ANDROID.MARSHMALLOW,
            'directionDescriptions': (result, api) => api < BUILD_ANDROID.MARSHMALLOW,
            'headerAmPmTextAppearance': (result, api) => substitute(result, 'headerTextColor', api, BUILD_ANDROID.MARSHMALLOW),
            'headerDayOfMonthTextAppearance': (result, api) => substitute(result, 'headerTextColor', api, BUILD_ANDROID.MARSHMALLOW),
            'headerMonthTextAppearance': (result, api) => substitute(result, 'headerTextColor', api, BUILD_ANDROID.MARSHMALLOW),
            'headerTimeTextAppearance': (result, api) => substitute(result, 'headerTextColor', api, BUILD_ANDROID.MARSHMALLOW),
            'headerYearTextAppearance': (result, api) => substitute(result, 'headerTextColor', api, BUILD_ANDROID.MARSHMALLOW),
            'showOnLockScreen': (result, api) => substitute(result, 'showForAllUsers', api, BUILD_ANDROID.MARSHMALLOW),
            'targetDescriptions': (result, api) => api < BUILD_ANDROID.MARSHMALLOW,
            'yearListItemTextAppearance': (result, api) => substitute(result, 'yearListTextColor', api, BUILD_ANDROID.MARSHMALLOW),
            'yearListSelectorColor': (result, api) => api < BUILD_ANDROID.MARSHMALLOW
        }
    };

    const $xml = androme.lib.xml;
    let MAP_ID;
    function resetId() {
        MAP_ID = {
            android: ['parent']
        };
    }
    function generateId(section, name, start) {
        if (MAP_ID === undefined) {
            resetId();
        }
        const prefix = name;
        let i = start;
        if (start === 1) {
            name += `_${i.toString()}`;
        }
        if (MAP_ID[section] === undefined) {
            MAP_ID[section] = [];
        }
        do {
            if (!MAP_ID[section].includes(name)) {
                MAP_ID[section].push(name);
                break;
            }
            else {
                name = `${prefix}_${(++i).toString()}`;
            }
        } while (true);
        return name;
    }
    function stripId(value) {
        return value ? value.replace(/@\+?id\//, '') : '';
    }
    function createViewAttribute(options) {
        return Object.assign({ android: {}, app: {} }, typeof options === 'object' ? options : {});
    }
    function convertUnit(value, dpi = 160, font = false) {
        if (value) {
            value = parseFloat(value);
            if (!isNaN(value)) {
                value /= dpi / 160;
                value = value >= 1 || value === 0 ? Math.floor(value) : value.toFixed(2);
                return value + (font ? 'sp' : 'dp');
            }
        }
        return '0dp';
    }
    function delimitUnit(nodeName, attr, size, { dimensResourceValue = true }) {
        return dimensResourceValue ? `{%${nodeName.toLowerCase()},${attr},${size}}` : size;
    }
    function replaceUnit(value, { density = 160, convertPixels = 'dp' }, font = false) {
        switch (convertPixels) {
            case 'dp':
                return value.replace(/([">])(-)?(\d+(?:\.\d+)?px)(["<])/g, (match, ...capture) => capture[0] + (capture[1] || '') + convertUnit(capture[2], density, font) + capture[3]);
            default:
                return value;
        }
    }
    function replaceTab(value, { insertSpaces = 4 }, preserve = false) {
        return $xml.replaceTab(value, insertSpaces, preserve);
    }
    function calculateBias(start, end, accuracy = 4) {
        if (start === 0) {
            return 0;
        }
        else if (end === 0) {
            return 1;
        }
        else {
            return parseFloat(Math.max(start / (start + end), 0).toFixed(accuracy));
        }
    }
    function replaceRTL(value, { supportRTL = true, targetAPI = BUILD_ANDROID.JELLYBEAN_1 }) {
        if (supportRTL && targetAPI >= BUILD_ANDROID.JELLYBEAN_1) {
            value = value.replace(/left/g, 'start').replace(/right/g, 'end');
            value = value.replace(/Left/g, 'Start').replace(/Right/g, 'End');
        }
        return value;
    }
    function getXmlNs(...value) {
        return value.map(name => XMLNS_ANDROID[name] ? `xmlns:${value}="${XMLNS_ANDROID[name]}"` : '').filter(result => result).join(' ');
    }

    var util = /*#__PURE__*/Object.freeze({
        resetId: resetId,
        generateId: generateId,
        stripId: stripId,
        createViewAttribute: createViewAttribute,
        convertUnit: convertUnit,
        delimitUnit: delimitUnit,
        replaceUnit: replaceUnit,
        replaceTab: replaceTab,
        calculateBias: calculateBias,
        replaceRTL: replaceRTL,
        getXmlNs: getXmlNs
    });

    var $NodeList = androme.lib.base.NodeList;
    var $enum = androme.lib.enumeration;
    var $const = androme.lib.constant;
    var $util = androme.lib.util;
    var $dom = androme.lib.dom;
    var ViewBase = (Base) => {
        return class View extends Base {
            constructor(id = 0, element, afterInit) {
                super(id, element);
                this.constraint = { current: {} };
                this.renderChildren = [];
                this._namespaces = new Set(['android', 'app']);
                this._boxAdjustment = $dom.newBoxModel();
                this._boxReset = $dom.newBoxModel();
                this._android = {};
                this._app = {};
                this._localSettings = {
                    targetAPI: 0,
                    supportRTL: false
                };
                if (afterInit) {
                    afterInit(this);
                }
            }
            static documentBody() {
                if (View._documentBody === undefined) {
                    const body = new View(0, document.body);
                    body.hide();
                    body.setBounds();
                    View._documentBody = body;
                }
                return View._documentBody;
            }
            static getCustomizationValue(api, tagName, obj, attr) {
                for (const build of [API_ANDROID[api], API_ANDROID[0]]) {
                    const value = $util.optional(build, `customizations.${tagName}.${obj}.${attr}`);
                    if ($util.isString(value)) {
                        return value;
                    }
                }
                return '';
            }
            static getControlName(nodeType) {
                return NODE_ANDROID[$enum.NODE_STANDARD[nodeType]];
            }
            static getPaddedHeight(node) {
                return node.paddingTop + node.paddingBottom + node.borderTopWidth + node.borderBottomWidth;
            }
            attr(obj, attr, value = '', overwrite = true) {
                const result = {};
                if (!this.supported(obj, attr, result)) {
                    return '';
                }
                if (Object.keys(result).length > 0) {
                    if ($util.isString(result['obj'])) {
                        obj = result['obj'];
                    }
                    if ($util.isString(result['attr'])) {
                        attr = result['attr'];
                    }
                    if ($util.isString(result['value'])) {
                        value = result['value'];
                    }
                    if (typeof result['overwrite'] === 'boolean') {
                        overwrite = result['overwrite'];
                    }
                }
                return super.attr(obj, attr, value, overwrite);
            }
            android(attr, value = '', overwrite = true) {
                this.attr('android', attr, value, overwrite);
                return this._android[attr] || '';
            }
            app(attr, value = '', overwrite = true) {
                this.attr('app', attr, value, overwrite);
                return this._app[attr] || '';
            }
            apply(options) {
                if (typeof options === 'object') {
                    const local = Object.assign({}, options);
                    super.apply(local);
                    for (const obj in local) {
                        this.formatted(`${obj}="${local[obj]}"`);
                    }
                }
            }
            formatted(value, overwrite = true) {
                const match = value.match(/^(?:([a-z]+):)?(\w+)="((?:@+?[a-z]+\/)?.+)"$/);
                if (match) {
                    this.attr(match[1] || '_', match[2], match[3], overwrite);
                }
            }
            anchor(position, adjacent, orientation, overwrite) {
                if (arguments.length === 1 ||
                    this.constraint.current[position] === undefined ||
                    !this.constraint.current[position].overwrite ||
                    (orientation && !this.constraint[orientation])) {
                    if (overwrite === undefined) {
                        overwrite = adjacent === 'parent' || adjacent === 'true';
                    }
                    this[this.renderParent.controlName === NODE_ANDROID.RELATIVE ? 'android' : 'app'](position, adjacent, overwrite);
                    if (orientation) {
                        this.constraint[orientation] = true;
                    }
                    this.constraint.current[position] = { adjacent, orientation, overwrite };
                }
            }
            alignParent(position) {
                if (this.renderParent.is($enum.NODE_STANDARD.CONSTRAINT, $enum.NODE_STANDARD.RELATIVE)) {
                    position = $util.capitalize(position);
                    if (this.renderParent.controlName === NODE_ANDROID.CONSTRAINT) {
                        const attr = `layout_constraint${position}_to${position}Of`;
                        return this.app(this.localizeString(attr)) === 'parent' || this.app(attr) === 'parent';
                    }
                    else {
                        const attr = `layout_alignParent${position}`;
                        return this.android(this.localizeString(attr)) === 'true' || this.android(attr) === 'true';
                    }
                }
                return false;
            }
            horizontalBias() {
                const parent = this.documentParent;
                if (parent !== this) {
                    const left = Math.max(0, this.linear.left - parent.box.left);
                    const right = Math.max(0, parent.box.right - this.linear.right);
                    return calculateBias(left, right, this.localSettings.constraintPercentAccuracy);
                }
                return 0.5;
            }
            verticalBias() {
                const parent = this.documentParent;
                if (parent !== this) {
                    const top = Math.max(0, this.linear.top - parent.box.top);
                    const bottom = Math.max(0, parent.box.bottom - this.linear.bottom);
                    return calculateBias(top, bottom, this.localSettings.constraintPercentAccuracy);
                }
                return 0.5;
            }
            modifyBox(region, offset, negative = false) {
                const name = typeof region === 'number' ? $util.convertEnum(region, $enum.BOX_STANDARD, BOX_ANDROID) : '';
                if (offset !== 0 && (name !== '' || $util.isString(region))) {
                    const attr = $util.isString(region) ? region : name.replace('layout_', '');
                    if (this._boxReset[attr] !== undefined) {
                        if (offset === null) {
                            this._boxReset[attr] = 1;
                        }
                        else {
                            this._boxAdjustment[attr] += offset;
                            if (!negative) {
                                this._boxAdjustment[attr] = Math.max(0, this._boxAdjustment[attr]);
                            }
                        }
                    }
                }
            }
            valueBox(region) {
                const name = $util.convertEnum(region, $enum.BOX_STANDARD, BOX_ANDROID);
                if (name !== '') {
                    const attr = name.replace('layout_', '');
                    return [this._boxReset[attr] || 0, this._boxAdjustment[attr] || 0];
                }
                return [0, 0];
            }
            supported(obj, attr, result = {}) {
                if (this.localSettings.targetAPI > 0 && this.localSettings.targetAPI < BUILD_ANDROID.LATEST) {
                    const deprecated = DEPRECATED_ANDROID[obj];
                    if (deprecated && typeof deprecated[attr] === 'function') {
                        const valid = deprecated[attr](result, this.localSettings.targetAPI, this);
                        if (!valid || Object.keys(result).length > 0) {
                            return valid;
                        }
                    }
                    for (let i = this.localSettings.targetAPI; i <= BUILD_ANDROID.LATEST; i++) {
                        const version = API_ANDROID[i];
                        if (version && version[obj] && version[obj][attr] !== undefined) {
                            const callback = version[obj][attr];
                            if (typeof callback === 'boolean') {
                                return callback;
                            }
                            else if (typeof callback === 'function') {
                                return callback(result, this.localSettings.targetAPI, this);
                            }
                        }
                    }
                }
                return true;
            }
            combine(...objs) {
                const result = [];
                for (const value of this._namespaces.values()) {
                    const obj = this[`_${value}`];
                    if (objs.length === 0 || objs.includes(value)) {
                        for (const attr in obj) {
                            if (value !== '_') {
                                result.push(`${value}:${attr}="${obj[attr]}"`);
                            }
                            else {
                                result.push(`${attr}="${obj[attr]}"`);
                            }
                        }
                    }
                }
                return result.sort((a, b) => {
                    if (a.startsWith('android:id=')) {
                        return -1;
                    }
                    else if (b.startsWith('android:id=')) {
                        return 1;
                    }
                    else {
                        return a > b ? 1 : -1;
                    }
                });
            }
            localizeString(value) {
                if (!this.hasBit('excludeProcedure', $enum.NODE_PROCEDURE.LOCALIZATION)) {
                    return replaceRTL(value, this.localSettings);
                }
                return value;
            }
            clone(id, children = false) {
                const node = new View(id || this.id, this.element);
                Object.assign(node.localSettings, this.localSettings);
                node.nodeId = this.nodeId;
                node.nodeType = this.nodeType;
                node.baseElement = this.baseElement;
                node.controlName = this.controlName;
                node.alignmentType = this.alignmentType;
                node.depth = this.depth;
                node.rendered = this.rendered;
                node.renderDepth = this.renderDepth;
                node.renderParent = this.renderParent;
                node.renderExtension = this.renderExtension;
                node.documentRoot = this.documentRoot;
                if (children) {
                    node.replace(this.duplicate());
                }
                node.inherit(this, 'initial', 'base', 'style', 'styleMap');
                return node;
            }
            setNodeType(controlName) {
                if (this.nodeType === 0) {
                    for (const android in NODE_ANDROID) {
                        if (NODE_ANDROID[android] === controlName) {
                            for (const standard in $enum.NODE_STANDARD) {
                                if ($enum.NODE_STANDARD[$enum.NODE_STANDARD[standard]] === android) {
                                    this.nodeType = $enum.NODE_STANDARD[standard];
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
                this.controlName = controlName;
                if (this.android('id') !== '') {
                    this.nodeId = stripId(this.android('id'));
                }
                if (!this.nodeId) {
                    const element = this.element;
                    let name = $util.trimNull(element.id || element.name);
                    if (RESERVED_JAVA.includes(name)) {
                        name = `_${name}`;
                    }
                    this.nodeId = $util.convertWord(generateId('android', name || $util.lastIndexOf(this.controlName, '.').toLowerCase(), name ? 0 : 1));
                    this.android('id', this.stringId);
                }
            }
            setLayout() {
                if (this.nodeType >= $enum.NODE_STANDARD.SCROLL_HORIZONTAL) {
                    this.android('layout_width', this.nodeType === $enum.NODE_STANDARD.SCROLL_HORIZONTAL && this.has('width', $enum.CSS_STANDARD.UNIT) ? this.css('width') : 'wrap_content');
                    this.android('layout_height', this.nodeType === $enum.NODE_STANDARD.SCROLL_VERTICAL && this.has('height', $enum.CSS_STANDARD.UNIT) ? this.css('height') : 'wrap_content');
                }
                else if (this.renderParent.nodeType >= $enum.NODE_STANDARD.SCROLL_HORIZONTAL) {
                    if (this.renderParent.is($enum.NODE_STANDARD.SCROLL_HORIZONTAL)) {
                        this.android('layout_width', 'wrap_content', false);
                        this.android('layout_height', 'match_parent', false);
                    }
                    else {
                        this.android('layout_width', 'match_parent', false);
                        this.android('layout_height', 'wrap_content', false);
                    }
                }
                else {
                    const parent = this.documentParent;
                    const renderParent = this.renderParent;
                    const renderChildren = this.renderChildren;
                    const width = (() => {
                        if (this.plainText) {
                            return this.bounds.width;
                        }
                        else if (this.linear && this.linear.width > 0) {
                            return this.linear.width;
                        }
                        else {
                            return this.styleElement ? this.element.clientWidth + this.borderLeftWidth + this.borderRightWidth + this.marginLeft + this.marginRight : 0;
                        }
                    })();
                    const height = (() => {
                        if (this.plainText) {
                            return this.bounds.height;
                        }
                        else if (this.linear && this.linear.height > 0) {
                            return this.linear.height;
                        }
                        else {
                            return this.styleElement ? this.element.clientHeight + this.borderTopWidth + this.borderBottomWidth + this.marginTop + this.marginBottom : 0;
                        }
                    })();
                    const widthParent = (() => {
                        if (parent.initial.box && parent.initial.box.width > 0) {
                            return parent.initial.box.width;
                        }
                        else if (parent.box && parent.box.width > 0) {
                            return parent.box.width;
                        }
                        else {
                            return parent.styleElement ? parent.element.offsetWidth - (parent.paddingLeft + parent.paddingRight + parent.borderLeftWidth + parent.borderRightWidth) : 0;
                        }
                    })();
                    const heightParent = (() => {
                        if (parent.initial.box && parent.initial.box.height > 0) {
                            return parent.initial.box.height;
                        }
                        else if (parent.box && parent.box.height > 0) {
                            return parent.box.height;
                        }
                        else {
                            return parent.styleElement ? parent.element.offsetHeight - (parent.paddingTop + parent.paddingBottom + parent.borderTopWidth + parent.borderBottomWidth) : 0;
                        }
                    })();
                    const styleMap = this.styleMap;
                    const constraint = this.constraint;
                    const tableElement = this.tagName === 'TABLE';
                    if (this.documentBody || (this.documentRoot && !this.flex.enabled && this.is($enum.NODE_STANDARD.FRAME, $enum.NODE_STANDARD.CONSTRAINT, $enum.NODE_STANDARD.RELATIVE))) {
                        if (!this.hasWidth && this.block && !constraint.layoutHorizontal) {
                            this.android('layout_width', 'match_parent', false);
                        }
                        if (!this.hasHeight &&
                            this.cascade().some(node => !node.pageflow) &&
                            !constraint.layoutHeight &&
                            !constraint.layoutVertical) {
                            this.android('layout_height', 'match_parent', false);
                        }
                    }
                    if (this.of($enum.NODE_STANDARD.GRID, $enum.NODE_ALIGNMENT.PERCENT)) {
                        this.android('layout_width', 'match_parent');
                    }
                    else {
                        if (this.android('layout_width') !== '0px') {
                            if (this.toInt('width') > 0 && (!this.inlineStatic || renderParent.is($enum.NODE_STANDARD.GRID) || !this.has('width', 0, { map: 'initial' }))) {
                                if (this.has('width', $enum.CSS_STANDARD.PERCENT)) {
                                    if (styleMap.width === '100%') {
                                        this.android('layout_width', 'match_parent', false);
                                    }
                                    else if (renderParent.of($enum.NODE_STANDARD.GRID, $enum.NODE_ALIGNMENT.PERCENT)) {
                                        this.android('layout_width', '0px');
                                        this.android('layout_columnWeight', (parseInt(styleMap.width) / 100).toFixed(2));
                                    }
                                    else {
                                        const widthPercent = Math.ceil(this.bounds.width) - (!tableElement ? this.paddingLeft + this.paddingRight + this.borderLeftWidth + this.borderRightWidth : 0);
                                        this.android('layout_width', $util.formatPX(widthPercent), false);
                                    }
                                }
                                else {
                                    this.android('layout_width', $util.convertInt(parent.android('layout_width')) > 0 && parent.viewWidth > 0 && this.viewWidth >= parent.viewWidth ? 'match_parent' : styleMap.width, renderParent.tagName !== 'TABLE');
                                }
                            }
                            if (constraint.layoutWidth) {
                                if (constraint.layoutHorizontal) {
                                    this.android('layout_width', parent.hasWidth ? 'match_parent' : 'wrap_content', false);
                                }
                                else {
                                    this.android('layout_width', this.bounds.width >= widthParent ? 'match_parent' : $util.formatPX(this.bounds.width), false);
                                }
                            }
                            if (this.has('minWidth', $enum.CSS_STANDARD.UNIT)) {
                                this.android('layout_width', 'wrap_content', false);
                                this.android('minWidth', styleMap.minWidth, false);
                            }
                            if (!this.documentBody && this.has('maxWidth', $enum.CSS_STANDARD.UNIT) && this.layoutVertical) {
                                const maxWidth = this.css('maxWidth');
                                renderChildren.forEach(node => node.is($enum.NODE_STANDARD.TEXT) && !node.has('maxWidth') && node.android('maxWidth', maxWidth));
                            }
                        }
                        if (this.android('layout_width') === '') {
                            const widthDefined = renderChildren.filter(node => !node.autoMargin && node.has('width', $enum.CSS_STANDARD.UNIT, { map: 'initial' }));
                            const gridParent = renderParent.is($enum.NODE_STANDARD.GRID);
                            const columnWeight = this.android('layout_columnWeight');
                            if (gridParent && columnWeight && columnWeight !== '0') {
                                this.android('layout_width', '0px');
                            }
                            else if ((widthDefined.length > 0 && widthDefined.some(node => node.bounds.width >= this.box.width)) || this.svgElement) {
                                this.android('layout_width', 'wrap_content');
                            }
                            else {
                                if (this.is($enum.NODE_STANDARD.GRID) &&
                                    $util.withinFraction(this.box.right, Math.max.apply(null, renderChildren.filter(node => node.inlineElement || !node.blockStatic).map(node => node.linear.right)))) {
                                    this.android('layout_width', 'wrap_content');
                                }
                                else if ((this.blockStatic && this.hasAlign($enum.NODE_ALIGNMENT.VERTICAL)) ||
                                    (!this.documentRoot && renderChildren.some(node => node.hasAlign($enum.NODE_ALIGNMENT.VERTICAL) && !node.has('width')))) {
                                    this.android('layout_width', 'match_parent');
                                }
                                else {
                                    const wrap = (this.nodeType < $enum.NODE_STANDARD.INLINE ||
                                        this.inlineElement ||
                                        !this.pageflow ||
                                        !this.siblingflow ||
                                        this.display === 'table' ||
                                        parent.flex.enabled ||
                                        (renderParent.inlineElement && !renderParent.hasWidth && !this.inlineElement && this.nodeType > $enum.NODE_STANDARD.BLOCK) ||
                                        gridParent);
                                    if (!wrap || (this.blockStatic && !this.has('maxWidth'))) {
                                        const previousSibling = this.previousSibling();
                                        const nextSibling = this.nextSibling();
                                        if (width >= widthParent ||
                                            (this.linearVertical && !this.floating && !this.autoMargin) ||
                                            (this.is($enum.NODE_STANDARD.FRAME) && renderChildren.some(node => node.blockStatic && (node.autoMarginHorizontal || node.autoMarginLeft))) ||
                                            (!this.htmlElement && this.length > 0 && renderChildren.some(item => item.linear.width >= this.documentParent.box.width) && !renderChildren.some(item => item.plainText && item.multiLine)) ||
                                            (this.htmlElement && this.blockStatic && (this.documentParent.documentBody ||
                                                this.ascend().every(node => node.blockStatic) ||
                                                (this.documentParent.blockStatic && this.nodeType <= $enum.NODE_STANDARD.LINEAR && (!previousSibling || !previousSibling.floating) && (!nextSibling || !nextSibling.floating))))) {
                                            this.android('layout_width', 'match_parent');
                                        }
                                    }
                                }
                                this.android('layout_width', 'wrap_content', false);
                            }
                        }
                    }
                    if (this.android('layout_height') !== '0px') {
                        if (this.toInt('height') > 0 && (!this.inlineStatic || !this.has('height', 0, { map: 'initial' }))) {
                            if (this.has('height', $enum.CSS_STANDARD.PERCENT)) {
                                if (styleMap.height === '100%') {
                                    this.android('layout_height', 'match_parent', false);
                                }
                                else {
                                    let heightPercent = this.bounds.height;
                                    if (!tableElement) {
                                        heightPercent -= this.paddingTop + this.paddingBottom + this.borderTopWidth + this.borderBottomWidth;
                                    }
                                    this.android('layout_height', $util.formatPX(heightPercent), false);
                                }
                            }
                            else {
                                this.android('layout_height', this.css('overflow') === 'hidden' && this.toInt('height') < Math.floor(this.box.height) ? 'wrap_content' : styleMap.height);
                            }
                        }
                        if (constraint.layoutHeight) {
                            if (constraint.layoutVertical) {
                                this.android('layout_height', 'wrap_content', false);
                            }
                            else if (this.documentRoot) {
                                const bottomHeight = Math.max.apply(null, renderChildren.filter(node => node.pageflow).map(node => node.linear.bottom));
                                this.android('layout_height', bottomHeight > 0 ? $util.formatPX(bottomHeight + this.paddingBottom + this.borderBottomWidth) : 'match_parent', false);
                            }
                            else {
                                this.android('layout_height', this.actualHeight < heightParent ? $util.formatPX(this.actualHeight) : 'match_parent', false);
                            }
                        }
                        if (this.has('minHeight', $enum.CSS_STANDARD.UNIT)) {
                            this.android('layout_height', 'wrap_content', false);
                            this.android('minHeight', styleMap.minHeight, false);
                        }
                        if (!this.documentBody && this.has('maxHeight', $enum.CSS_STANDARD.UNIT) && this.layoutHorizontal) {
                            const maxHeight = this.css('maxHeight');
                            renderChildren.forEach(node => node.is($enum.NODE_STANDARD.TEXT) && !node.has('maxHeight') && node.android('maxHeight', maxHeight));
                        }
                    }
                    if (this.android('layout_height') === '') {
                        if (this.svgElement) {
                            this.android('layout_height', 'wrap_content');
                        }
                        else if (height >= heightParent &&
                            parent.hasHeight &&
                            !(this.inlineElement && this.nodeType < $enum.NODE_STANDARD.INLINE) &&
                            !(renderParent.is($enum.NODE_STANDARD.RELATIVE) && renderParent.inlineHeight)) {
                            this.android('layout_height', 'match_parent');
                        }
                        else {
                            if (this.lineHeight > 0 && !this.plainText && !renderParent.linearHorizontal) {
                                const boundsHeight = this.actualHeight + renderParent.paddingTop + renderParent.paddingBottom;
                                if (this.inlineElement && boundsHeight > 0 && this.lineHeight >= boundsHeight) {
                                    this.android('layout_height', $util.formatPX(boundsHeight));
                                    this.modifyBox($enum.BOX_STANDARD.PADDING_TOP, null);
                                    this.modifyBox($enum.BOX_STANDARD.PADDING_BOTTOM, null);
                                }
                                else if (this.block && this.box.height > 0 && $util.withinFraction(this.lineHeight, this.box.height)) {
                                    this.android('layout_height', $util.formatPX(boundsHeight));
                                }
                            }
                            this.android('layout_height', 'wrap_content', false);
                        }
                    }
                }
                switch (this.cssParent('visibility', true)) {
                    case 'hidden':
                    case 'collapse':
                        this.android('visibility', 'invisible');
                        break;
                }
            }
            setAlignment() {
                function mergeGravity(original, ...alignment) {
                    const direction = [...$util.trimNull(original).split('|'), ...alignment].filter(value => value);
                    switch (direction.length) {
                        case 0:
                            return '';
                        case 1:
                            return direction[0];
                        default:
                            let x = '';
                            let y = '';
                            let z = '';
                            for (let i = 0; i < direction.length; i++) {
                                const value = direction[i];
                                switch (value) {
                                    case 'center':
                                        x = 'center_horizontal';
                                        y = 'center_vertical';
                                        break;
                                    case 'left':
                                    case 'start':
                                    case 'right':
                                    case 'end':
                                    case 'center_horizontal':
                                        x = value;
                                        break;
                                    case 'top':
                                    case 'bottom':
                                    case 'center_vertical':
                                        y = value;
                                        break;
                                    default:
                                        z += (z !== '' ? '|' : '') + value;
                                        break;
                                }
                            }
                            const gravity = [x, y].filter(value => value);
                            const merged = gravity.filter(value => value.indexOf('center') !== -1).length === 2 ? 'center' : gravity.join('|');
                            return merged !== '' ? (z !== '' ? `${merged}|${z}` : merged) : z;
                    }
                }
                function setAutoMargin(node) {
                    if (!node.blockWidth) {
                        const alignment = [];
                        const marginLeft = node.css('marginLeft') === 'auto';
                        const marginRight = node.css('marginRight') === 'auto';
                        const marginTop = node.css('marginTop') === 'auto';
                        const marginBottom = node.css('marginBottom') === 'auto';
                        if (marginLeft && marginRight) {
                            alignment.push('center_horizontal');
                        }
                        else if (marginLeft && !marginRight) {
                            alignment.push(right);
                        }
                        else if (!marginLeft && marginRight) {
                            alignment.push(left);
                        }
                        if (marginTop && marginBottom) {
                            alignment.push('center_vertical');
                        }
                        else if (marginTop && !marginBottom) {
                            alignment.push('bottom');
                        }
                        else if (!marginTop && marginBottom) {
                            alignment.push('top');
                        }
                        if (alignment.length > 0) {
                            const gravity = node.blockWidth ? 'gravity' : 'layout_gravity';
                            node.android(gravity, mergeGravity(node.android(gravity), ...alignment));
                            return true;
                        }
                    }
                    return false;
                }
                function convertHorizontal(value) {
                    switch (value) {
                        case 'left':
                        case 'start':
                            return left;
                        case 'right':
                        case 'end':
                            return right;
                        case 'center':
                            return 'center_horizontal';
                        default:
                            return '';
                    }
                }
                function setTextAlign(value) {
                    if (textAlign === '' || value === right) {
                        return value;
                    }
                    return textAlign;
                }
                const renderParent = this.renderParent;
                const textAlignParent = this.cssParent('textAlign');
                const left = this.localizeString('left');
                const right = this.localizeString('right');
                let textAlign = this.styleMap.textAlign || '';
                let verticalAlign = '';
                let floating = '';
                if (!(this.floating || renderParent.of($enum.NODE_STANDARD.RELATIVE, $enum.NODE_ALIGNMENT.MULTILINE))) {
                    switch (this.styleMap.verticalAlign) {
                        case 'top':
                        case 'text-top':
                            verticalAlign = 'top';
                            if (renderParent.linearHorizontal && this.inlineHeight) {
                                this.android('layout_height', 'match_parent');
                            }
                            break;
                        case 'middle':
                            if (this.inline ||
                                this.documentParent.css('display') === 'table-cell' ||
                                (this.inlineStatic && this.documentParent.lineHeight > 0)) {
                                verticalAlign = 'center_vertical';
                            }
                            break;
                        case 'bottom':
                        case 'text-bottom':
                            verticalAlign = 'bottom';
                            break;
                    }
                }
                if (verticalAlign === '' && this.lineHeight > 0 && !this.blockHeight) {
                    verticalAlign = 'center_vertical';
                }
                if (renderParent.linearVertical || (this.documentRoot && this.linearVertical)) {
                    if (this.float === 'right') {
                        this.android('layout_gravity', right);
                    }
                    else {
                        setAutoMargin(this);
                    }
                }
                if (this.hasAlign($enum.NODE_ALIGNMENT.FLOAT)) {
                    if (this.hasAlign($enum.NODE_ALIGNMENT.RIGHT) || this.renderChildren.some(node => node.hasAlign($enum.NODE_ALIGNMENT.RIGHT))) {
                        floating = right;
                    }
                    else if (this.hasAlign($enum.NODE_ALIGNMENT.LEFT) || this.renderChildren.some(node => node.hasAlign($enum.NODE_ALIGNMENT.LEFT))) {
                        floating = left;
                    }
                }
                if (renderParent.tagName === 'TABLE') {
                    this.android('layout_gravity', mergeGravity(this.android('layout_gravity'), 'fill'));
                    if (textAlign === '' && this.tagName === 'TH') {
                        textAlign = 'center';
                    }
                    if (verticalAlign === '') {
                        verticalAlign = 'center_vertical';
                    }
                }
                if (renderParent.is($enum.NODE_STANDARD.FRAME)) {
                    if (!setAutoMargin(this)) {
                        floating = floating || this.float;
                        if (floating !== 'none') {
                            if (renderParent.inlineWidth || (this.singleChild && !renderParent.documentRoot)) {
                                renderParent.android('layout_gravity', mergeGravity(renderParent.android('layout_gravity'), this.localizeString(floating)));
                            }
                            else {
                                if (this.blockWidth) {
                                    textAlign = setTextAlign(floating);
                                }
                                else {
                                    this.android('layout_gravity', mergeGravity(this.android('layout_gravity'), this.localizeString(floating)));
                                }
                            }
                        }
                    }
                }
                else if (floating !== '') {
                    if (this.is($enum.NODE_STANDARD.LINEAR)) {
                        if (this.blockWidth) {
                            textAlign = setTextAlign(floating);
                        }
                        else {
                            this.android('layout_gravity', mergeGravity(this.android('layout_gravity'), floating));
                        }
                    }
                    else if (renderParent.hasAlign($enum.NODE_ALIGNMENT.VERTICAL)) {
                        textAlign = setTextAlign(floating);
                    }
                }
                if (textAlignParent !== '' && this.localizeString(textAlignParent) !== left) {
                    if (renderParent.is($enum.NODE_STANDARD.FRAME) &&
                        this.singleChild &&
                        !this.floating &&
                        !this.autoMargin) {
                        this.android('layout_gravity', mergeGravity(this.android('layout_gravity'), convertHorizontal(textAlignParent)));
                    }
                    if (textAlign === '') {
                        textAlign = textAlignParent;
                    }
                }
                if (verticalAlign !== '' && renderParent.linearHorizontal) {
                    this.android('layout_gravity', mergeGravity(this.android('layout_gravity'), verticalAlign));
                    verticalAlign = '';
                }
                if (this.documentRoot && (this.blockWidth || this.is($enum.NODE_STANDARD.FRAME))) {
                    this.delete('android', 'layout_gravity');
                }
                this.android('gravity', mergeGravity(this.android('gravity'), convertHorizontal(textAlign), verticalAlign));
            }
            setBoxSpacing() {
                if (!this.hasBit('excludeResource', $enum.NODE_RESOURCE.BOX_SPACING)) {
                    ['padding', 'margin'].forEach(region => {
                        ['Top', 'Left', 'Right', 'Bottom'].forEach(direction => {
                            const dimension = region + direction;
                            const value = (this._boxReset[dimension] === 0 ? this[dimension] : 0) + this._boxAdjustment[dimension];
                            if (value !== 0) {
                                this.android(this.localizeString(BOX_ANDROID[`${region.toUpperCase()}_${direction.toUpperCase()}`]), $util.formatPX(value));
                            }
                        });
                    });
                    if (this.supported('android', 'layout_marginHorizontal')) {
                        const localizeLeft = this.localizeString('Left');
                        const localizeRight = this.localizeString('Right');
                        ['layout_margin', 'padding'].forEach((value, index) => {
                            const top = $util.convertInt(this.android(`${value}Top`));
                            const right = $util.convertInt(this.android(value + localizeRight));
                            const bottom = $util.convertInt(this.android(`${value}Bottom`));
                            const left = $util.convertInt(this.android(value + localizeLeft));
                            if (top !== 0 && top === bottom && bottom === left && left === right) {
                                this.delete('android', `${value}*`);
                                this.android(value, $util.formatPX(top));
                            }
                            else {
                                if (!(this.renderParent.is($enum.NODE_STANDARD.GRID) && index === 0)) {
                                    if (top !== 0 && top === bottom) {
                                        this.delete('android', `${value}Top`, `${value}Bottom`);
                                        this.android(`${value}Vertical`, $util.formatPX(top));
                                    }
                                    if (left !== 0 && left === right) {
                                        this.delete('android', value + localizeLeft, value + localizeRight);
                                        this.android(`${value}Horizontal`, $util.formatPX(left));
                                    }
                                }
                            }
                        });
                    }
                }
            }
            applyOptimizations() {
                this.setBlockSpacing();
                this.bindWhiteSpace();
                this.autoSizeBoxModel();
                this.alignLinearLayout();
                this.alignRelativePosition();
            }
            applyCustomizations() {
                for (const build of [API_ANDROID[0], API_ANDROID[this.localSettings.targetAPI]]) {
                    if (build && build.customizations) {
                        for (const nodeName of [this.tagName, this.controlName]) {
                            const customizations = build.customizations[nodeName];
                            if (customizations) {
                                for (const obj in customizations) {
                                    for (const attr in customizations[obj]) {
                                        this.attr(obj, attr, customizations[obj][attr], this.localSettings.customizationsOverwritePrivilege);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            setBlockSpacing() {
                if (this.pageflow) {
                    const renderParent = this.renderParent;
                    if (this.documentParent === renderParent && !renderParent.documentBody && renderParent.blockStatic) {
                        const elements = renderParent.map(item => item.baseElement);
                        [[$dom.getFirstElementChild(elements), 'Top', $enum.BOX_STANDARD.MARGIN_TOP, $enum.BOX_STANDARD.PADDING_TOP],
                            [$dom.getLastElementChild(elements), 'Bottom', $enum.BOX_STANDARD.MARGIN_BOTTOM, $enum.BOX_STANDARD.PADDING_BOTTOM]]
                            .forEach((item, index) => {
                            const node = $dom.getNodeFromElement(item[0]);
                            if (node && !node.lineBreak && (node === this || node === this.renderChildren[index === 0 ? 0 : this.renderChildren.length - 1])) {
                                const marginOffset = renderParent[`margin${item[1]}`];
                                if (marginOffset > 0 && renderParent[`padding${item[1]}`] === 0 && renderParent[`border${item[1]}Width`] === 0) {
                                    node.modifyBox(item[2], null);
                                }
                            }
                        });
                    }
                    if (this.htmlElement && this.blockStatic) {
                        for (let i = 0; i < this.element.children.length; i++) {
                            const element = this.element.children[i];
                            const node = $dom.getNodeFromElement(element);
                            if (node && node.pageflow && node.blockStatic && !node.lineBreak) {
                                const previous = node.previousSibling();
                                if (previous && previous.pageflow && !previous.lineBreak) {
                                    const marginTop = $util.convertInt(node.cssInitial('marginTop', true));
                                    const marginBottom = $util.convertInt(previous.cssInitial('marginBottom', true));
                                    if (marginBottom > 0 && marginTop > 0) {
                                        if (marginTop <= marginBottom) {
                                            node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, null);
                                        }
                                        else {
                                            previous.modifyBox($enum.BOX_STANDARD.MARGIN_BOTTOM, null);
                                        }
                                    }
                                }
                                [element.previousElementSibling, element.nextElementSibling].forEach((item, index) => {
                                    const adjacent = $dom.getNodeFromElement(item);
                                    if (adjacent && adjacent.excluded) {
                                        const offset = Math.min(adjacent.marginTop, adjacent.marginBottom);
                                        if (offset < 0) {
                                            if (index === 0) {
                                                node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, offset, true);
                                            }
                                            else {
                                                node.modifyBox($enum.BOX_STANDARD.MARGIN_BOTTOM, offset, true);
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
            autoSizeBoxModel() {
                if (this.localSettings.autoSizePaddingAndBorderWidth && !this.hasBit('excludeProcedure', $enum.NODE_PROCEDURE.AUTOFIT)) {
                    const renderParent = this.renderParent;
                    let layoutWidth = $util.convertInt(this.android('layout_width'));
                    let layoutHeight = $util.convertInt(this.android('layout_height'));
                    let borderWidth = false;
                    if (this.imageElement) {
                        const top = this.borderTopWidth;
                        const right = this.borderRightWidth;
                        const bottom = this.borderBottomWidth;
                        const left = this.borderLeftWidth;
                        let width = 0;
                        let height = 0;
                        if (top > 0) {
                            this.modifyBox($enum.BOX_STANDARD.PADDING_TOP, top);
                            height += top;
                        }
                        if (right > 0) {
                            this.modifyBox($enum.BOX_STANDARD.PADDING_RIGHT, right);
                            width += right;
                        }
                        if (bottom > 0) {
                            this.modifyBox($enum.BOX_STANDARD.PADDING_BOTTOM, bottom);
                            height += bottom;
                        }
                        if (left > 0) {
                            this.modifyBox($enum.BOX_STANDARD.PADDING_LEFT, left);
                            width += left;
                        }
                        height += this.paddingTop + this.paddingBottom;
                        width += this.paddingLeft + this.paddingRight;
                        if (width > 0) {
                            if (layoutWidth > 0) {
                                this.android('layout_width', $util.formatPX(layoutWidth + width));
                            }
                            else {
                                layoutWidth = $util.convertInt(renderParent.android('layout_width'));
                                if (layoutWidth > 0 && this.singleChild) {
                                    renderParent.android('layout_width', $util.formatPX(layoutWidth + this.marginLeft + width));
                                }
                            }
                        }
                        if (height > 0) {
                            if (layoutHeight > 0) {
                                this.android('layout_height', $util.formatPX(layoutHeight + height));
                            }
                            else {
                                layoutHeight = $util.convertInt(renderParent.android('layout_height'));
                                if (layoutHeight > 0 && this.singleChild) {
                                    renderParent.android('layout_height', $util.formatPX(layoutHeight + this.marginTop + height));
                                }
                            }
                        }
                    }
                    else if (this.is($enum.NODE_STANDARD.BUTTON) && layoutHeight === 0) {
                        if (!this.has('minHeight')) {
                            this.android('layout_height', $util.formatPX(this.bounds.height + (this.css('borderStyle') === 'outset' ? $util.convertInt(this.css('borderWidth')) : 0)));
                        }
                    }
                    else if (this.is($enum.NODE_STANDARD.LINE)) {
                        if (layoutHeight > 0 && this.has('height', 0, { map: 'initial' }) && this.tagName !== 'HR') {
                            this.android('layout_height', $util.formatPX(layoutHeight + this.borderTopWidth + this.borderBottomWidth));
                        }
                    }
                    else if (this.tagName === 'TABLE') {
                        const width = $util.convertInt(this.android('layout_width'));
                        if (width > 0) {
                            if (this.bounds.width > width) {
                                this.android('layout_width', $util.formatPX(this.bounds.width));
                            }
                            if (this.has('width', $enum.CSS_STANDARD.AUTO, { map: 'initial' }) && this.renderChildren.every(node => node.inlineWidth)) {
                                for (const node of this.renderChildren) {
                                    node.android('layout_width', '0px');
                                    node.android('layout_columnWeight', '1');
                                }
                            }
                        }
                        borderWidth = this.css('boxSizing') === 'content-box' || $dom.isUserAgent($enum.USER_AGENT.EDGE | $enum.USER_AGENT.FIREFOX);
                    }
                    else {
                        if (this.styleElement && !this.hasBit('excludeResource', $enum.NODE_RESOURCE.BOX_SPACING)) {
                            if (!(renderParent.tagName === 'TABLE' || this.css('boxSizing') === 'border-box')) {
                                const minWidth = $util.convertInt(this.android('minWidth'));
                                const minHeight = $util.convertInt(this.android('minHeight'));
                                const paddedWidth = this.paddingLeft + this.paddingRight + this.borderLeftWidth + this.borderRightWidth;
                                const paddedHeight = View.getPaddedHeight(this);
                                if (layoutWidth > 0 && paddedWidth > 0 && this.toInt('width', 0, { map: 'initial' }) > 0) {
                                    this.android('layout_width', $util.formatPX(layoutWidth + paddedWidth));
                                }
                                if (layoutHeight > 0 &&
                                    paddedHeight > 0 &&
                                    this.toInt('height', 0, { map: 'initial' }) > 0 && (this.lineHeight === 0 ||
                                    this.lineHeight < this.box.height ||
                                    this.lineHeight === this.toInt('height'))) {
                                    this.android('layout_height', $util.formatPX(layoutHeight + paddedHeight));
                                }
                                if (minWidth > 0 && paddedWidth > 0) {
                                    this.android('minWidth', $util.formatPX(minWidth + paddedWidth));
                                }
                                if (minHeight > 0 && paddedHeight > 0) {
                                    this.android('minHeight', $util.formatPX(minHeight + paddedHeight));
                                }
                            }
                            borderWidth = true;
                        }
                    }
                    if (borderWidth) {
                        this.modifyBox($enum.BOX_STANDARD.PADDING_TOP, this.borderTopWidth);
                        this.modifyBox($enum.BOX_STANDARD.PADDING_RIGHT, this.borderRightWidth);
                        this.modifyBox($enum.BOX_STANDARD.PADDING_BOTTOM, this.borderBottomWidth);
                        this.modifyBox($enum.BOX_STANDARD.PADDING_LEFT, this.borderLeftWidth);
                    }
                }
            }
            bindWhiteSpace() {
                if (!this.hasAlign($enum.NODE_ALIGNMENT.FLOAT) && (this.linearHorizontal ||
                    this.of($enum.NODE_STANDARD.RELATIVE, $enum.NODE_ALIGNMENT.HORIZONTAL, $enum.NODE_ALIGNMENT.MULTILINE) ||
                    this.of($enum.NODE_STANDARD.CONSTRAINT, $enum.NODE_ALIGNMENT.HORIZONTAL))) {
                    const textAlign = this.css('textAlign');
                    const textIndent = this.toInt('textIndent');
                    const valueBox = this.valueBox($enum.BOX_STANDARD.PADDING_LEFT);
                    const relative = this.is($enum.NODE_STANDARD.RELATIVE);
                    let right = this.box.left + (textIndent > 0 ? this.toInt('textIndent') : (textIndent < 0 && valueBox[0] === 1 ? valueBox[0] : 0));
                    this.each((node, index) => {
                        if (!(node.floating ||
                            (relative && node.alignParent('left')) ||
                            (index === 0 && (textAlign !== 'left' || node.plainText)) ||
                            ['SUP', 'SUB'].includes(node.tagName))) {
                            const width = Math.round(node.actualLeft() - right);
                            if (width >= 1) {
                                node.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, width);
                            }
                        }
                        right = node.actualRight();
                    }, true);
                }
                else if (this.linearVertical) {
                    function getPreviousBottom(list) {
                        return list.sort((a, b) => a.linear.bottom < b.linear.bottom ? 1 : -1)[0].linear.bottom;
                    }
                    const children = this.initial.children.some(node => $util.hasValue(node.dataset.include)) ? this.initial.children : this.renderChildren;
                    children.forEach((node) => {
                        const previous = (() => {
                            let current = node;
                            do {
                                current = current.previousSibling(true, false, false);
                            } while (current && !this.initial.children.includes(current));
                            return current;
                        })();
                        const elements = $dom.getElementsBetweenSiblings(previous === null ? null
                            : (previous.groupElement ? $dom.getLastElementChild(previous.map(item => item.baseElement)) : previous.baseElement), node.baseElement)
                            .filter(element => {
                            const item = $dom.getNodeFromElement(element);
                            return item && (item.lineBreak || (item.excluded && item.blockStatic));
                        });
                        if (elements.length > 0) {
                            let bottom;
                            if (!previous) {
                                bottom = this.box.top;
                            }
                            else {
                                bottom = (() => {
                                    if (previous.renderParent.of($enum.NODE_STANDARD.FRAME, $enum.NODE_ALIGNMENT.FLOAT)) {
                                        return getPreviousBottom(previous.renderParent.renderChildren.slice());
                                    }
                                    else if (previous.layoutHorizontal && previous.groupElement && previous.renderChildren.some(item => !item.floating)) {
                                        return getPreviousBottom(previous.renderChildren.filter(item => !item.floating));
                                    }
                                    return previous.linear.bottom;
                                })();
                            }
                            if (elements.length === 1 && elements[0].tagName === 'BR' && previous && previous.inline && node.inline) {
                                return;
                            }
                            const height = Math.round(node.linear.top - bottom);
                            if (height >= 1) {
                                node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, height);
                            }
                        }
                    });
                }
            }
            alignLinearLayout() {
                if (this.linearHorizontal) {
                    const renderParent = this.renderParent;
                    const renderChildren = this.renderChildren;
                    const pageflow = renderChildren.filter(node => !node.floating && (node.styleElement || node.renderChildren.length === 0));
                    if (pageflow.length > 0 &&
                        pageflow.every(node => node.baseline || node.has('verticalAlign', $enum.CSS_STANDARD.UNIT)) && ((pageflow.some(node => node.toInt('verticalAlign') < 0) && pageflow.some(node => node.toInt('verticalAlign') > 0)) ||
                        pageflow.some(node => node.imageElement && node.toInt('verticalAlign') !== 0))) {
                        const tallest = [];
                        const marginTop = Math.max.apply(null, pageflow.map(node => node.toInt('verticalAlign')));
                        let offsetTop = 0;
                        if (marginTop > 0) {
                            pageflow.forEach(node => {
                                const offset = node.toInt('verticalAlign');
                                const offsetHeight = (node.imageElement ? node.bounds.height : 0) + (offset > 0 ? offset : 0);
                                if (offsetHeight >= offsetTop) {
                                    if (offsetHeight > offsetTop) {
                                        tallest.length = 0;
                                    }
                                    tallest.push(node);
                                    offsetTop = offsetHeight;
                                }
                            });
                            tallest.sort(a => a.imageElement ? -1 : 1);
                            pageflow.forEach(node => {
                                if (!tallest.includes(node)) {
                                    const offset = node.toInt('verticalAlign');
                                    if (marginTop > 0) {
                                        let offsetHeight = 0;
                                        if (tallest[0].imageElement) {
                                            if ($dom.isUserAgent($enum.USER_AGENT.EDGE) && node.plainText) {
                                                offsetHeight = node.bounds.height - offsetTop;
                                            }
                                            else {
                                                offsetHeight = node.bounds.height;
                                            }
                                        }
                                        node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, offsetTop - offsetHeight);
                                    }
                                    if (offset !== 0) {
                                        node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, offset * -1, true);
                                        node.css('verticalAlign', '0px');
                                    }
                                }
                            });
                            tallest.forEach(node => node.css('verticalAlign', '0px'));
                        }
                    }
                    if (renderChildren.some(node => node.tagName === 'SUB') && this.inlineHeight) {
                        const offsetHeight = $util.convertInt(View.getCustomizationValue(this.localSettings.targetAPI, 'SUB', 'android', 'layout_marginTop'));
                        if (offsetHeight > 0) {
                            this.android('layout_height', $util.formatPX(this.bounds.height + offsetHeight + View.getPaddedHeight(this)));
                        }
                    }
                    if (!renderChildren.some(node => node.imageElement && node.baseline) &&
                        (this.hasAlign($enum.NODE_ALIGNMENT.FLOAT) || renderChildren.some(node => node.floating || !node.siblingflow))) {
                        this.android('baselineAligned', 'false');
                    }
                    else {
                        const childIndex = renderParent.android('baselineAlignedChildIndex');
                        if (renderParent.renderChildren.some(node => node.baseline && node.textElement) ||
                            (childIndex !== '' && renderParent.renderChildren.findIndex(node => node === this) === parseInt(childIndex)) ||
                            renderChildren.some(node => !node.alignOrigin || !node.baseline) ||
                            (renderChildren.some(node => node.nodeType < $enum.NODE_STANDARD.TEXT) && renderChildren.some(node => node.textElement && node.baseline)) ||
                            (renderParent.is($enum.NODE_STANDARD.GRID) && !renderChildren.some(node => node.textElement && node.baseline))) {
                            const baseline = $NodeList.textBaseline(renderChildren);
                            if (baseline.length > 0) {
                                this.android('baselineAlignedChildIndex', renderChildren.indexOf(baseline[0]).toString());
                            }
                        }
                    }
                    if (this.localSettings.ellipsisOnTextOverflow && this.length > 1 && renderChildren.every(node => node.textElement && !node.floating)) {
                        const node = renderChildren[renderChildren.length - 1];
                        if (node.textElement && !node.multiLine && node.textContent.trim().split(String.fromCharCode(32)).length > 1) {
                            node.android('singleLine', 'true');
                        }
                    }
                }
            }
            alignRelativePosition() {
                const renderParent = this.renderParent;
                if ((this.inline || (this.imageElement && this.display === 'inline-block')) && !this.floating) {
                    const offset = this.toInt('verticalAlign');
                    if (offset !== 0) {
                        this.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, offset * -1, true);
                        if (offset < 0 &&
                            this.display !== 'inline-block' &&
                            renderParent.layoutHorizontal &&
                            renderParent.inlineHeight) {
                            renderParent.android('layout_height', $util.formatPX(renderParent.bounds.height + View.getPaddedHeight(renderParent)));
                        }
                    }
                }
                if (this.position === 'relative' || renderParent.is($enum.NODE_STANDARD.FRAME)) {
                    const top = this.toInt('top');
                    const bottom = this.toInt('bottom');
                    const left = this.toInt('left');
                    if (top !== 0) {
                        if (top < 0 &&
                            this.floating &&
                            !!this.data('RESOURCE', 'backgroundImage') &&
                            renderParent.is($enum.NODE_STANDARD.RELATIVE, $enum.NODE_STANDARD.LINEAR)) {
                            let found = false;
                            renderParent.renderChildren.some((node) => {
                                if (node === this) {
                                    found = true;
                                }
                                else {
                                    if (node.android('layout_below') !== '') {
                                        return true;
                                    }
                                    else if (found) {
                                        node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, Math.abs(top));
                                    }
                                }
                                return false;
                            });
                        }
                        else {
                            this.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, top, true);
                        }
                    }
                    else if (bottom !== 0) {
                        this.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, bottom * -1, true);
                    }
                    if (left !== 0) {
                        if (this.float === 'right' || (this.position === 'relative' && this.autoMarginLeft)) {
                            this.modifyBox($enum.BOX_STANDARD.MARGIN_RIGHT, left * -1, true);
                        }
                        else {
                            this.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, left, true);
                        }
                    }
                }
                if (!this.plainText && !renderParent.linearHorizontal) {
                    const offset = (this.lineHeight + this.toInt('verticalAlign')) - this.actualHeight;
                    if (offset > 0) {
                        this.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, Math.floor(offset / 2));
                        this.modifyBox($enum.BOX_STANDARD.MARGIN_BOTTOM, Math.ceil(offset / 2));
                    }
                }
            }
            get stringId() {
                return this.nodeId ? `@+id/${this.nodeId}` : '';
            }
            set controlName(value) {
                this._controlName = value;
            }
            get controlName() {
                if (this._controlName) {
                    return this._controlName;
                }
                else {
                    const value = $const.MAP_ELEMENT[this.nodeName];
                    if (value !== undefined) {
                        this.nodeType = value;
                        return View.getControlName(value);
                    }
                    return '';
                }
            }
            set documentParent(value) {
                this._documentParent = value;
            }
            get documentParent() {
                if (this._documentParent) {
                    return this._documentParent;
                }
                else if (this.id === 0) {
                    return this;
                }
                else {
                    return this.getParentElementAsNode(false) || View.documentBody();
                }
            }
            set renderParent(value) {
                if (value !== this) {
                    value.appendRendered(this);
                }
                this._renderParent = value;
            }
            get renderParent() {
                return this._renderParent || View.documentBody();
            }
            get anchored() {
                return this.constraint.horizontal && this.constraint.vertical;
            }
            get layoutHorizontal() {
                return (this.linearHorizontal ||
                    this.hasAlign($enum.NODE_ALIGNMENT.HORIZONTAL) ||
                    (this.nodes.filter(node => node.pageflow).length > 1 && ($NodeList.linearX(this.nodes) ||
                        (this.is($enum.NODE_STANDARD.FRAME) && this.nodes.every(node => node.domElement)))));
            }
            get layoutVertical() {
                return (this.linearVertical ||
                    this.hasAlign($enum.NODE_ALIGNMENT.VERTICAL) ||
                    (this.nodes.filter(node => node.pageflow).length > 1 && ($NodeList.linearY(this.nodes)) ||
                        (this.is($enum.NODE_STANDARD.FRAME) && this.nodes.some(node => node.linearVertical))));
            }
            get linearHorizontal() {
                return this._android.orientation === AXIS_ANDROID.HORIZONTAL && this.is($enum.NODE_STANDARD.LINEAR, $enum.NODE_STANDARD.RADIO_GROUP);
            }
            get linearVertical() {
                return this._android.orientation === AXIS_ANDROID.VERTICAL && this.is($enum.NODE_STANDARD.LINEAR, $enum.NODE_STANDARD.RADIO_GROUP);
            }
            get inlineWidth() {
                return this._android.layout_width === 'wrap_content';
            }
            get inlineHeight() {
                return this._android.layout_height === 'wrap_content';
            }
            get blockWidth() {
                return this._android.layout_width === 'match_parent';
            }
            get blockHeight() {
                return this._android.layout_height === 'match_parent';
            }
            set localSettings(value) {
                Object.assign(this._localSettings, value);
            }
            get localSettings() {
                return this._localSettings;
            }
        };
    };

    class View extends ViewBase(androme.lib.base.Node) {
    }

    var BASE_TMPL = '<?xml version="1.0" encoding="utf-8"?>\n{:0}';

    class ViewGroup extends ViewBase(androme.lib.base.NodeGroup) {
        constructor(id, node, parent, children, afterInit) {
            super(id, undefined, afterInit);
            this.parent = parent;
            this.depth = node.depth;
            this.nodeName = `${node.nodeName}_GROUP`;
            this.documentParent = node.documentParent;
            this.replace(children);
            if (children.length > 0) {
                this.init();
            }
        }
    }

    var $NodeList$1 = androme.lib.base.NodeList;
    var $enum$1 = androme.lib.enumeration;
    var $util$1 = androme.lib.util;
    var $dom$1 = androme.lib.dom;
    var $xml$1 = androme.lib.xml;
    const MAP_LAYOUT = {
        relativeParent: {
            top: 'layout_alignParentTop',
            bottom: 'layout_alignParentBottom'
        },
        relative: {
            top: 'layout_alignTop',
            bottom: 'layout_alignBottom',
            baseline: 'layout_alignBaseline',
            bottomTop: 'layout_above',
            topBottom: 'layout_below'
        },
        constraint: {
            top: 'layout_constraintTop_toTopOf',
            bottom: 'layout_constraintBottom_toBottomOf',
            baseline: 'layout_constraintBaseline_toBaselineOf',
            bottomTop: 'layout_constraintBottom_toTopOf',
            topBottom: 'layout_constraintTop_toBottomOf'
        }
    };
    const MAP_CHAIN = {
        leftTop: ['left', 'top'],
        rightBottom: ['right', 'bottom'],
        rightLeftBottomTop: ['rightLeft', 'bottomTop'],
        leftRightTopBottom: ['leftRight', 'topBottom'],
        widthHeight: ['Width', 'Height'],
        horizontalVertical: ['Horizontal', 'Vertical']
    };
    function setAlignParent(node, orientation = '', bias = false) {
        [AXIS_ANDROID.HORIZONTAL, AXIS_ANDROID.VERTICAL].forEach((value, index) => {
            if (!node.constraint[value] && (orientation === '' || value === orientation)) {
                node.app(MAP_LAYOUT.constraint[index === 0 ? 'left' : 'top'], 'parent');
                node.app(MAP_LAYOUT.constraint[index === 0 ? 'right' : 'bottom'], 'parent');
                node.constraint[value] = true;
                if (bias) {
                    node.app(`layout_constraint${value.charAt(0).toUpperCase() + value.substring(1)}_bias`, node[`${value}Bias`]);
                }
            }
        });
    }
    class ViewController extends androme.lib.base.Controller {
        constructor() {
            super(...arguments);
            this.localSettings = {
                includes: true,
                baseTemplate: BASE_TMPL,
                layout: {
                    pathName: 'res/layout',
                    fileExtension: 'xml'
                },
                inline: {
                    always: ['BR'],
                    tagName: WEBVIEW_ANDROID,
                },
                unsupported: {
                    tagName: ['OPTION', 'MAP', 'AREA']
                }
            };
            this._merge = {};
        }
        static getEnclosingTag(depth, controlName, id, xml = '', preXml = '', postXml = '') {
            const indent = $util$1.repeat(Math.max(0, depth));
            let output = preXml +
                `{<${id}}`;
            if (xml !== '') {
                output += indent + `<${controlName}${depth === 0 ? '{#0}' : ''}{@${id}}>\n` +
                    xml +
                    indent + `</${controlName}>\n`;
            }
            else {
                output += indent + `<${controlName}${depth === 0 ? '{#0}' : ''}{@${id}} />\n`;
            }
            output += `{>${id}}` +
                postXml;
            return output;
        }
        finalize(data, callbackArray) {
            this.setAttributes(data);
            for (const value of [...data.views, ...data.includes]) {
                if (Array.isArray(callbackArray)) {
                    callbackArray.forEach(callbackfn => callbackfn(data));
                }
                value.content = replaceUnit(value.content, this.settings);
                value.content = replaceTab(value.content, this.settings);
                value.content = $xml$1.removePlaceholderAll(value.content).replace(/\n\n/g, '\n');
            }
        }
        reset() {
            super.reset();
            resetId();
            this._merge = {};
        }
        setConstraints() {
            Object.assign(MAP_LAYOUT.relativeParent, {
                left: replaceRTL('layout_alignParentLeft', this.settings),
                right: replaceRTL('layout_alignParentRight', this.settings)
            });
            Object.assign(MAP_LAYOUT.relative, {
                left: replaceRTL('layout_alignLeft', this.settings),
                right: replaceRTL('layout_alignRight', this.settings),
                leftRight: replaceRTL('layout_toRightOf', this.settings),
                rightLeft: replaceRTL('layout_toLeftOf', this.settings)
            });
            Object.assign(MAP_LAYOUT.constraint, {
                left: replaceRTL('layout_constraintLeft_toLeftOf', this.settings),
                right: replaceRTL('layout_constraintRight_toRightOf', this.settings),
                leftRight: replaceRTL('layout_constraintLeft_toRightOf', this.settings),
                rightLeft: replaceRTL('layout_constraintRight_toLeftOf', this.settings)
            });
            const relativeParent = MAP_LAYOUT.relativeParent;
            let mapLayout;
            let constraint = false;
            function mapParent(node, direction) {
                if (constraint) {
                    return node.app(mapLayout[direction]) === 'parent';
                }
                else {
                    return node.android(relativeParent[direction]) === 'true';
                }
            }
            function mapSibling(node, direction) {
                return node[constraint ? 'app' : 'android'](mapLayout[direction]);
            }
            function mapDelete(node, ...direction) {
                node.delete(constraint ? 'app' : 'android', ...direction.map(value => mapLayout[value]));
            }
            function anchoredSibling(node, nodes, orientation) {
                if (!node.constraint[orientation]) {
                    const connected = [];
                    let parent = node;
                    while (parent && !connected.includes(parent.stringId)) {
                        connected.push(parent.stringId);
                        const stringId = mapSibling(parent, orientation === AXIS_ANDROID.HORIZONTAL ? 'leftRight' : 'topBottom');
                        if (stringId) {
                            parent = nodes.find(item => item.stringId === stringId);
                            if (parent && parent.constraint[orientation]) {
                                return true;
                            }
                        }
                        else {
                            parent = undefined;
                        }
                    }
                    return false;
                }
                return true;
            }
            for (const node of this.cache.visible) {
                const relative = node.is($enum$1.NODE_STANDARD.RELATIVE);
                constraint = node.is($enum$1.NODE_STANDARD.CONSTRAINT);
                const flex = node.flex;
                if (relative || constraint || flex.enabled) {
                    const nodes = node.renderChildren.filter(item => item.auto);
                    if (nodes.length === 0) {
                        continue;
                    }
                    const cleared = $NodeList$1.cleared(node.initial.children);
                    if (relative) {
                        function checkSingleLine(item, nowrap = false, flexParent = false) {
                            if (item && item.textElement && (nowrap ||
                                flexParent ||
                                (!item.hasWidth && !item.multiLine && item.textContent.trim().split(String.fromCharCode(32)).length > 1))) {
                                item.android('singleLine', 'true');
                            }
                        }
                        function adjustBaseline(siblings) {
                            if (nodes.length > 1) {
                                const textBaseline = $NodeList$1.textBaseline(siblings.filter(item => item.baseline && item.toInt('top') === 0 && item.toInt('bottom') === 0));
                                if (textBaseline.length > 0) {
                                    const alignWith = textBaseline[0];
                                    const images = [];
                                    let baseExcluded;
                                    for (const current of siblings) {
                                        if (current !== alignWith) {
                                            if (current.baseline && (current.nodeType <= $enum$1.NODE_STANDARD.INLINE ||
                                                (current.linearHorizontal && current.renderChildren.some(item => item.baseline && item.nodeType <= $enum$1.NODE_STANDARD.INLINE)))) {
                                                if (!alignWith.imageElement && current.imageElement) {
                                                    images.push(current);
                                                }
                                                else if (current.alignOrigin) {
                                                    current.android(MAP_LAYOUT.relative[current.imageElement || current.is($enum$1.NODE_STANDARD.BUTTON) ? 'bottom' : 'baseline'], alignWith.stringId);
                                                }
                                                else if (alignWith.position === 'relative' &&
                                                    current.bounds.height < alignWith.bounds.height &&
                                                    current.lineHeight === 0) {
                                                    current.android(MAP_LAYOUT.relative[$util$1.convertInt(alignWith.top) > 0 ? 'top' : 'bottom'], alignWith.stringId);
                                                }
                                            }
                                            if (alignWith.imageElement && (!baseExcluded || current.bounds.height > baseExcluded.bounds.height)) {
                                                baseExcluded = current;
                                            }
                                        }
                                    }
                                    if (images.length > 0) {
                                        images.sort((a, b) => a.bounds.height >= b.bounds.height ? -1 : 1);
                                        for (let i = 0; i < images.length; i++) {
                                            if (i === 0) {
                                                alignWith.android(mapLayout['bottom'], images[i].stringId);
                                            }
                                            else {
                                                images[i].android(mapLayout['bottom'], images[0].stringId);
                                            }
                                        }
                                        baseExcluded = undefined;
                                    }
                                    if (baseExcluded) {
                                        if (!baseExcluded.imageElement) {
                                            baseExcluded.delete('android', mapLayout['baseline']);
                                        }
                                        else if (baseExcluded.bounds.height > alignWith.bounds.height) {
                                            baseExcluded.delete('android', mapLayout['bottom']);
                                        }
                                        else {
                                            baseExcluded = undefined;
                                        }
                                        if (baseExcluded) {
                                            alignWith.android(mapLayout['bottom'], baseExcluded.stringId);
                                        }
                                    }
                                }
                            }
                        }
                        mapLayout = MAP_LAYOUT.relative;
                        const rows = [];
                        const baseline = [];
                        const textIndent = node.toInt('textIndent');
                        const noWrap = node.css('whiteSpace') === 'nowrap';
                        let boxWidth = node.box.width;
                        if (node.renderParent.overflowX) {
                            boxWidth = node.viewWidth || boxWidth || node.renderParent.toInt('width', 0, { map: 'initial' });
                        }
                        else if (node.renderParent.hasAlign($enum$1.NODE_ALIGNMENT.FLOAT)) {
                            const minLeft = Math.min.apply(null, nodes.map(item => item.linear.left));
                            const maxRight = Math.max.apply(null, nodes.map(item => item.linear.right));
                            boxWidth = maxRight - minLeft;
                        }
                        else {
                            const floatEnd = Math.max.apply(null, node.documentParent.initial.children.filter(item => item.float === 'left' && item.siblingIndex < node.siblingIndex).map(item => item.linear.right));
                            if (nodes.some(item => item.linear.left === floatEnd)) {
                                boxWidth = node.box.right - floatEnd;
                            }
                        }
                        boxWidth = Math.ceil(boxWidth);
                        let rowWidth = 0;
                        let rowPaddingLeft = 0;
                        let rowPreviousLeft;
                        let rowPreviousBottom;
                        if (textIndent < 0 && Math.abs(textIndent) <= node.paddingLeft) {
                            rowPaddingLeft = Math.abs(textIndent);
                            node.modifyBox($enum$1.BOX_STANDARD.PADDING_LEFT, node.paddingLeft + textIndent);
                            node.modifyBox($enum$1.BOX_STANDARD.PADDING_LEFT, null);
                        }
                        const rangeMultiLine = [];
                        const edgeOrFirefox = $dom$1.isUserAgent($enum$1.USER_AGENT.EDGE | $enum$1.USER_AGENT.FIREFOX);
                        for (let i = 0; i < nodes.length; i++) {
                            const current = nodes[i];
                            const previous = nodes[i - 1];
                            let dimension = current.bounds;
                            if (current.inlineText && !current.hasWidth) {
                                const [bounds, multiLine] = $dom$1.getRangeClientRect(current.element);
                                if (bounds && (multiLine || bounds.width < current.box.width)) {
                                    dimension = bounds;
                                    if (edgeOrFirefox && multiLine && !/^\s*\n+/.test(current.textContent)) {
                                        rangeMultiLine.push(current);
                                    }
                                }
                            }
                            const sideParent = relativeParent[current.float === 'right' ? 'right' : 'left'];
                            const sideSibling = mapLayout[current.float === 'right' ? 'rightLeft' : 'leftRight'];
                            if (i === 0) {
                                current.android(sideParent, 'true');
                                if (!node.inline && textIndent > 0) {
                                    current.modifyBox($enum$1.BOX_STANDARD.MARGIN_LEFT, textIndent);
                                }
                                if (!current.siblingflow || (current.floating && current.position === 'relative') || (current.multiLine && textIndent < 0)) {
                                    rowPreviousLeft = current;
                                }
                                rows[rows.length] = [current];
                            }
                            else if (previous) {
                                const items = rows[rows.length - 1];
                                const siblings = $dom$1.getElementsBetweenSiblings(previous.baseElement, current.baseElement, false, true);
                                const viewGroup = current.groupElement && !current.hasAlign($enum$1.NODE_ALIGNMENT.SEGMENTED);
                                const previousSibling = current.previousSibling();
                                const baseWidth = rowWidth + current.marginLeft + dimension.width - (edgeOrFirefox ? current.borderRightWidth : 0);
                                let connected = false;
                                if (i === 1 && previous.textElement && current.textElement) {
                                    connected = siblings.length === 0 && !/\s+$/.test(previous.textContent) && !/^\s+/.test(current.textContent);
                                }
                                if (!noWrap &&
                                    !connected &&
                                    !['SUP', 'SUB'].includes(current.tagName) &&
                                    (previous.float !== 'left' || current.linear.top >= previous.linear.bottom) && ((current.float !== 'right' && Math.floor(baseWidth) - (current.styleElement && current.inlineStatic ? current.paddingLeft + current.paddingRight : 0) > boxWidth) ||
                                    (current.multiLine && $dom$1.hasLineBreak(current.element)) ||
                                    (previous.multiLine && previous.textContent.trim() !== '' && !/^\s*\n+/.test(previous.textContent) && !/\n+\s*$/.test(previous.textContent) && $dom$1.hasLineBreak(previous.element)) ||
                                    (previousSibling && previousSibling.lineBreak) ||
                                    (current.preserveWhiteSpace && /^\n+/.test(current.textContent)) ||
                                    current.blockStatic ||
                                    viewGroup ||
                                    cleared.has(current) ||
                                    rangeMultiLine.includes(previous) ||
                                    (siblings.length > 0 && siblings.some(element => $dom$1.isLineBreak(element))) ||
                                    (current.floating && ((current.float === 'left' && $util$1.withinFraction(current.linear.left, node.box.left)) ||
                                        (current.float === 'right' && $util$1.withinFraction(current.linear.right, node.box.right)) ||
                                        current.linear.top >= previous.linear.bottom)))) {
                                    rowPreviousBottom = items.filter(item => !item.floating)[0] || items[0];
                                    for (let j = 0; j < items.length; j++) {
                                        if (items[j] !== rowPreviousBottom &&
                                            items[j].linear.bottom > rowPreviousBottom.linear.bottom &&
                                            (!items[j].floating || (items[j].floating && rowPreviousBottom.floating))) {
                                            rowPreviousBottom = items[j];
                                        }
                                    }
                                    if (viewGroup || (previous.groupElement && i === nodes.length - 1)) {
                                        current.constraint.marginVertical = rowPreviousBottom.stringId;
                                    }
                                    current.anchor(mapLayout['topBottom'], rowPreviousBottom.stringId);
                                    if (rowPreviousLeft &&
                                        current.linear.top < rowPreviousLeft.bounds.bottom &&
                                        !$util$1.withinRange(current.bounds.top, rowPreviousLeft.bounds.top, 1) &&
                                        !$util$1.withinRange(current.bounds.bottom, rowPreviousLeft.bounds.bottom, 1)) {
                                        current.anchor(sideSibling, rowPreviousLeft.stringId);
                                    }
                                    else {
                                        current.anchor(sideParent, 'true');
                                        rowPreviousLeft = undefined;
                                    }
                                    if (this.settings.ellipsisOnTextOverflow && previous.linearHorizontal) {
                                        checkSingleLine(previous.item(), true);
                                    }
                                    if (rowPaddingLeft > 0) {
                                        if (this.settings.ellipsisOnTextOverflow &&
                                            rows.length === 1 &&
                                            rows[0].length === 1 &&
                                            rows[0][0].textElement) {
                                            checkSingleLine(rows[0][0], true);
                                        }
                                        current.modifyBox($enum$1.BOX_STANDARD.PADDING_LEFT, rowPaddingLeft);
                                    }
                                    adjustBaseline(baseline);
                                    node.alignmentType ^= $enum$1.NODE_ALIGNMENT.HORIZONTAL;
                                    node.alignmentType |= $enum$1.NODE_ALIGNMENT.MULTILINE;
                                    rowWidth = 0;
                                    baseline.length = 0;
                                    rows.push([current]);
                                }
                                else {
                                    if (i === 1 && rowPaddingLeft > 0 && !previous.plainText) {
                                        current.anchor(sideParent, 'true');
                                        current.modifyBox($enum$1.BOX_STANDARD.PADDING_LEFT, rowPaddingLeft);
                                    }
                                    else {
                                        current.anchor(sideSibling, previous.stringId);
                                    }
                                    if (connected || baseWidth > boxWidth) {
                                        checkSingleLine(current);
                                    }
                                    if (rowPreviousBottom) {
                                        current.anchor(mapLayout['topBottom'], rowPreviousBottom.stringId);
                                    }
                                    items.push(current);
                                }
                            }
                            rowWidth += dimension.width + current.marginLeft + current.marginRight + (previous && !previous.floating && !previous.plainText && !previous.preserveWhiteSpace &&
                                previous.textContent.trim() !== '' && !/\s+$/.test(previous.textContent) &&
                                !current.floating && !current.plainText && !current.preserveWhiteSpace &&
                                current.textContent.trim() !== '' && !/^\s+/.test(current.textContent) ? this.settings.whitespaceHorizontalOffset : 0);
                            if (!current.floating) {
                                baseline.push(current);
                            }
                        }
                        adjustBaseline(baseline);
                        if (node.marginTop < 0 && nodes[0].position === 'relative') {
                            rows[0].forEach((item, index) => item.modifyBox($enum$1.BOX_STANDARD.MARGIN_TOP, node.marginTop * (index === 0 ? 1 : -1), true));
                        }
                        if (node.baseline && rows.length === 1) {
                            rows[0].forEach(item => {
                                switch (item.css('verticalAlign')) {
                                    case 'top':
                                        item.anchor(relativeParent['top'], 'true');
                                        break;
                                    case 'middle':
                                        rows[0].forEach(sibling => sibling.bounds.height <= item.bounds.height && sibling.anchor('layout_centerVertical', 'true'));
                                        break;
                                }
                            });
                        }
                        if (this.settings.ellipsisOnTextOverflow) {
                            const widthParent = !node.ascend().some(parent => parent.hasWidth);
                            if (!node.ascend(true).some(item => item.is($enum$1.NODE_STANDARD.GRID)) && (rows.length === 1 ||
                                node.hasAlign($enum$1.NODE_ALIGNMENT.HORIZONTAL))) {
                                for (let i = 1; i < nodes.length; i++) {
                                    const item = nodes[i];
                                    if (!item.multiLine && !item.floating && !item.alignParent('left')) {
                                        checkSingleLine(item, false, widthParent);
                                    }
                                }
                            }
                            else {
                                for (const row of rows) {
                                    if (row.length > 1) {
                                        const item = row[row.length - 1];
                                        if (item.inlineText) {
                                            checkSingleLine(item, false, widthParent);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        mapLayout = MAP_LAYOUT.constraint;
                        if (node.hasAlign($enum$1.NODE_ALIGNMENT.HORIZONTAL)) {
                            function boundsHeight(a, b) {
                                return a.bounds.height >= b.bounds.height ? -1 : 1;
                            }
                            const optimal = $NodeList$1.textBaseline(nodes)[0];
                            const baseline = nodes.filter(item => item.textElement && item.baseline).sort(boundsHeight);
                            let images = nodes.filter(item => item.imageElement && item.baseline).sort(boundsHeight);
                            if (images.length > 0) {
                                const tallest = images[0];
                                images.forEach((item, index) => index > 0 && item.app(mapLayout['baseline'], tallest.stringId));
                                if (!optimal.imageElement) {
                                    optimal.app(mapLayout['bottom'], tallest.stringId);
                                }
                                images = images.filter(item => item !== tallest);
                            }
                            for (let i = 0; i < nodes.length; i++) {
                                const current = nodes[i];
                                const previous = nodes[i - 1];
                                let alignWith = optimal;
                                if (i === 0) {
                                    current.app(mapLayout['left'], 'parent');
                                }
                                else if (previous) {
                                    current.app(mapLayout['leftRight'], previous.stringId);
                                    if (!previous.floating && !current.floating) {
                                        current.constraint.marginHorizontal = previous.stringId;
                                    }
                                }
                                if (images.includes(current)) {
                                    continue;
                                }
                                let verticalAlign = current.css('verticalAlign');
                                if (verticalAlign === 'baseline' && current.tagName === 'TEXTAREA') {
                                    verticalAlign = 'text-bottom';
                                }
                                if (!alignWith || verticalAlign.startsWith('text') || alignWith === current) {
                                    alignWith = undefined;
                                    baseline.some(item => {
                                        if (item !== current) {
                                            alignWith = item;
                                            return true;
                                        }
                                        return false;
                                    });
                                    if (!alignWith) {
                                        nodes.slice().sort((a, b) => a.nodeType <= b.nodeType ? -1 : 1).some(item => {
                                            if (item !== current) {
                                                alignWith = item;
                                                return true;
                                            }
                                            return false;
                                        });
                                    }
                                }
                                switch (verticalAlign) {
                                    case 'text-top':
                                        if (alignWith) {
                                            current.app(mapLayout['top'], alignWith.stringId);
                                        }
                                        break;
                                    case 'top':
                                        current.app(mapLayout['top'], 'parent');
                                        break;
                                    case 'middle':
                                        setAlignParent(current, AXIS_ANDROID.VERTICAL);
                                        break;
                                    case 'baseline':
                                        if (alignWith) {
                                            current.app(mapLayout['baseline'], alignWith.stringId);
                                        }
                                        break;
                                    case 'text-bottom':
                                        if (alignWith) {
                                            current.app(mapLayout['bottom'], alignWith.stringId);
                                        }
                                        break;
                                    case 'bottom':
                                        current.app(mapLayout['bottom'], 'parent');
                                        break;
                                }
                            }
                        }
                        else {
                            const [absolute, pageflow] = $util$1.partition(nodes, item => !item.pageflow || (item.position === 'relative' && item.alignNegative));
                            const percentage = node.hasAlign($enum$1.NODE_ALIGNMENT.PERCENT);
                            const columnCount = node.toInt('columnCount');
                            if (percentage) {
                                node.android('layout_width', 'match_parent');
                            }
                            else if (columnCount === 0) {
                                for (const current of pageflow) {
                                    const parent = node.renderParent.is($enum$1.NODE_STANDARD.GRID) && !node.styleElement ? node : current.documentParent;
                                    if (current.autoMarginHorizontal) {
                                        setAlignParent(current, AXIS_ANDROID.HORIZONTAL);
                                    }
                                    else {
                                        if (current.linear.left <= parent.box.left || $util$1.withinFraction(current.linear.left, parent.box.left)) {
                                            current.anchor(mapLayout['left'], 'parent', AXIS_ANDROID.HORIZONTAL);
                                        }
                                        if (current.linear.right >= parent.box.right || $util$1.withinFraction(current.linear.right, parent.box.right)) {
                                            current.anchor(mapLayout['right'], 'parent', parent.hasWidth || current.float === 'right' || current.autoMarginLeft ? AXIS_ANDROID.HORIZONTAL : '');
                                        }
                                    }
                                    if (current.linear.top <= parent.box.top || $util$1.withinFraction(current.linear.top, parent.box.top)) {
                                        current.anchor(mapLayout['top'], 'parent', AXIS_ANDROID.VERTICAL);
                                    }
                                    else if (current.linear.bottom >= parent.box.bottom || $util$1.withinFraction(current.linear.bottom, parent.box.bottom)) {
                                        current.anchor(mapLayout['bottom'], 'parent', parent.hasHeight ? AXIS_ANDROID.VERTICAL : '');
                                    }
                                    for (const adjacent of pageflow) {
                                        if (current !== adjacent) {
                                            const stringId = adjacent.stringId;
                                            const horizontal = anchoredSibling(adjacent, nodes, AXIS_ANDROID.HORIZONTAL) ? AXIS_ANDROID.HORIZONTAL : '';
                                            const vertical = anchoredSibling(adjacent, nodes, AXIS_ANDROID.VERTICAL) ? AXIS_ANDROID.VERTICAL : '';
                                            const intersectY = current.intersectY(adjacent.linear);
                                            const alignOrigin = current.alignOrigin && adjacent.alignOrigin;
                                            if (!current.hasWidth && current.linear.left === adjacent.linear.left && current.linear.right === adjacent.linear.right) {
                                                if (!mapParent(current, 'right')) {
                                                    current.anchor(mapLayout['left'], stringId);
                                                }
                                                if (!mapParent(current, 'left')) {
                                                    current.anchor(mapLayout['right'], stringId);
                                                }
                                            }
                                            if ($util$1.withinFraction(current.linear.left, adjacent.linear.right) ||
                                                (alignOrigin && $util$1.withinRange(current.linear.left, adjacent.linear.right, this.settings.whitespaceHorizontalOffset))) {
                                                if (current.float !== 'right' || current.float === adjacent.float) {
                                                    current.anchor(mapLayout['leftRight'], stringId, horizontal, current.withinX(adjacent.linear));
                                                }
                                            }
                                            if ($util$1.withinFraction(current.linear.right, adjacent.linear.left) ||
                                                (alignOrigin && $util$1.withinRange(current.linear.right, adjacent.linear.left, this.settings.whitespaceHorizontalOffset))) {
                                                current.anchor(mapLayout['rightLeft'], stringId, horizontal, current.withinX(adjacent.linear));
                                            }
                                            const topParent = mapParent(current, 'top');
                                            const bottomParent = mapParent(current, 'bottom');
                                            const blockElement = !flex.enabled && !current.inlineElement;
                                            if ($util$1.withinFraction(current.linear.top, adjacent.linear.bottom) ||
                                                (alignOrigin && intersectY && $util$1.withinRange(current.linear.top, adjacent.linear.bottom, this.settings.whitespaceVerticalOffset))) {
                                                if (intersectY || !bottomParent || blockElement) {
                                                    current.anchor(mapLayout['topBottom'], stringId, vertical, intersectY);
                                                }
                                            }
                                            if ($util$1.withinFraction(current.linear.bottom, adjacent.linear.top) ||
                                                (alignOrigin && intersectY && $util$1.withinRange(current.linear.bottom, adjacent.linear.top, this.settings.whitespaceVerticalOffset))) {
                                                if (intersectY || !topParent || blockElement) {
                                                    current.anchor(mapLayout['bottomTop'], stringId, vertical, intersectY);
                                                }
                                            }
                                            if (!topParent && !bottomParent) {
                                                if (current.linear.top === adjacent.linear.top) {
                                                    current.anchor(mapLayout['top'], stringId, vertical);
                                                }
                                                if (current.linear.bottom === adjacent.linear.bottom) {
                                                    current.anchor(mapLayout['bottom'], stringId, vertical);
                                                }
                                            }
                                        }
                                    }
                                }
                                for (const current of pageflow) {
                                    const leftRight = mapSibling(current, 'leftRight');
                                    if (leftRight) {
                                        if (!current.constraint.horizontal) {
                                            current.constraint.horizontal = flex.enabled || anchoredSibling(current, pageflow, AXIS_ANDROID.HORIZONTAL);
                                        }
                                        current.constraint.marginHorizontal = leftRight;
                                    }
                                    const topBottom = mapSibling(current, 'topBottom');
                                    if (topBottom) {
                                        if (!current.constraint.vertical) {
                                            current.constraint.vertical = flex.enabled || anchoredSibling(current, pageflow, AXIS_ANDROID.VERTICAL);
                                        }
                                        current.constraint.marginVertical = topBottom;
                                        mapDelete(current, 'top');
                                    }
                                    if (mapParent(current, 'left') && mapParent(current, 'right')) {
                                        if (current.autoMargin) {
                                            if (current.autoMarginLeft) {
                                                mapDelete(current, 'left');
                                            }
                                            if (current.autoMarginRight) {
                                                mapDelete(current, 'right');
                                            }
                                            if (current.autoMarginHorizontal) {
                                                if (node.hasWidth && !current.has('width', $enum$1.CSS_STANDARD.PERCENT)) {
                                                    current.android('layout_width', 'match_parent');
                                                }
                                                else if (current.inlineElement && !current.hasWidth) {
                                                    current.android('layout_width', 'wrap_content');
                                                }
                                            }
                                        }
                                        else if (current.floating) {
                                            mapDelete(current, current.float === 'right' ? 'left' : 'right');
                                        }
                                        else if (current.inlineElement) {
                                            if (current.nodeType <= $enum$1.NODE_STANDARD.IMAGE) {
                                                switch (current.css('textAlign')) {
                                                    case 'center':
                                                        break;
                                                    case 'right':
                                                    case 'end':
                                                        mapDelete(current, 'left');
                                                        break;
                                                    default:
                                                        mapDelete(current, 'right');
                                                        break;
                                                }
                                            }
                                            else {
                                                mapDelete(current, 'right');
                                            }
                                        }
                                        else {
                                            mapDelete(current, 'right');
                                            current.android('layout_width', 'match_parent');
                                        }
                                    }
                                    if (mapSibling(current, 'bottomTop')) {
                                        mapDelete(current, 'bottom');
                                    }
                                    if (current.plainText || (!current.styleElement && current.renderChildren.some(item => item.textElement))) {
                                        const textAlign = current.cssParent('textAlign');
                                        if (textAlign === 'right') {
                                            current.anchor(mapLayout['right'], 'parent', AXIS_ANDROID.HORIZONTAL);
                                            current.constraint.horizontal = true;
                                        }
                                        else if (textAlign === 'center') {
                                            current.constraint.horizontal = false;
                                            setAlignParent(current, AXIS_ANDROID.HORIZONTAL);
                                        }
                                    }
                                }
                                for (let i = 0; i < pageflow.length; i++) {
                                    const current = pageflow[i];
                                    if (!current.anchored) {
                                        const result = $util$1.searchObject(current.namespace('app'), '*constraint*');
                                        const localizeLeft = current.localizeString('Left');
                                        const localizeRight = current.localizeString('Right');
                                        for (const [key, value] of result) {
                                            if (value !== 'parent' && pageflow.filter(item => item.anchored).find(item => item.stringId === value)) {
                                                if ($util$1.indexOf(key, localizeLeft, localizeRight) !== -1) {
                                                    current.constraint.horizontal = true;
                                                }
                                                if ($util$1.indexOf(key, 'Top', 'Bottom', 'Baseline', 'above', 'below') !== -1) {
                                                    current.constraint.vertical = true;
                                                }
                                            }
                                        }
                                        if (current.anchored) {
                                            i = -1;
                                        }
                                    }
                                }
                                for (const current of absolute) {
                                    let alignMarginLeft = false;
                                    if (current.right !== null && current.toInt('right') >= 0) {
                                        current.anchor(mapLayout['right'], 'parent', AXIS_ANDROID.HORIZONTAL);
                                        if (current.toInt('left') > 0) {
                                            current.anchor(mapLayout['left'], 'parent');
                                            current.modifyBox($enum$1.BOX_STANDARD.MARGIN_LEFT, current.toInt('left'));
                                            alignMarginLeft = true;
                                        }
                                    }
                                    if (!alignMarginLeft && current.left !== null && current.toInt('left') === 0) {
                                        current.anchor(mapLayout['left'], 'parent', AXIS_ANDROID.HORIZONTAL);
                                        if (current.toInt('right') > 0) {
                                            current.anchor(mapLayout['right'], 'parent');
                                            current.modifyBox($enum$1.BOX_STANDARD.MARGIN_RIGHT, current.toInt('right'));
                                        }
                                    }
                                    if (current.top !== null && current.toInt('top') === 0) {
                                        current.anchor(mapLayout['top'], 'parent', AXIS_ANDROID.VERTICAL);
                                    }
                                    if (current.bottom !== null && current.toInt('bottom') >= 0) {
                                        current.anchor(mapLayout['bottom'], 'parent', AXIS_ANDROID.VERTICAL);
                                    }
                                    if (current.left === 0 &&
                                        current.right === 0 &&
                                        !current.floating &&
                                        !current.has('width', $enum$1.CSS_STANDARD.PERCENT)) {
                                        current.android('layout_width', 'match_parent');
                                    }
                                    if (current.top === 0 && current.bottom === 0) {
                                        current.android('layout_height', 'match_parent');
                                    }
                                }
                            }
                            if (flex.enabled || columnCount > 0 || (!this.settings.constraintChainDisabled && pageflow.length > 1)) {
                                const horizontal = [];
                                const vertical = [];
                                if (flex.enabled) {
                                    if (flex.wrap === 'nowrap') {
                                        switch (flex.direction) {
                                            case 'row-reverse':
                                                const row = pageflow.slice();
                                                row.reverse();
                                                horizontal.push(row);
                                                break;
                                            case 'row':
                                                horizontal.push(pageflow.slice());
                                                break;
                                            case 'column-reverse':
                                                const column = pageflow.slice();
                                                column.reverse();
                                                vertical.push(column);
                                                break;
                                            case 'column':
                                                vertical.push(pageflow.slice());
                                                break;
                                        }
                                    }
                                    else {
                                        const sorted = pageflow.slice();
                                        const map = {};
                                        const levels = [];
                                        function reverseMap() {
                                            for (const y in map) {
                                                map[y].reverse();
                                            }
                                        }
                                        switch (flex.direction) {
                                            case 'row-reverse':
                                            case 'column-reverse':
                                                sorted.reverse();
                                                break;
                                        }
                                        for (const item of sorted) {
                                            const y = item.linear.top;
                                            if (map[y] === undefined) {
                                                map[y] = [];
                                                levels.push(y);
                                            }
                                            map[y].push(item);
                                        }
                                        switch (flex.wrap) {
                                            case 'wrap':
                                                if (flex.direction === 'column-reverse') {
                                                    reverseMap();
                                                }
                                                break;
                                            case 'wrap-reverse':
                                                if (flex.direction.indexOf('row') !== -1) {
                                                    levels.reverse();
                                                }
                                                else if (flex.direction === 'column') {
                                                    reverseMap();
                                                }
                                                break;
                                        }
                                        levels.forEach(value => horizontal.push(map[value]));
                                    }
                                }
                                else if (columnCount > 0) {
                                    const columns = [];
                                    const perRowCount = Math.ceil(pageflow.length / Math.min(columnCount, pageflow.length));
                                    for (let i = 0, j = 0; i < pageflow.length; i++) {
                                        const item = pageflow[i];
                                        if (i % perRowCount === 0) {
                                            if (i > 0) {
                                                j++;
                                            }
                                            if (columns[j] === undefined) {
                                                columns[j] = [];
                                            }
                                        }
                                        columns[j].push(item);
                                    }
                                    const row = [];
                                    const marginLeft = $util$1.convertInt(node.css('columnGap')) || 16;
                                    const marginTotal = columns.map(list => Math.max.apply(null, list.map(item => item.marginLeft + item.marginRight))).reduce((a, b) => a + b, 0);
                                    const marginPercent = Math.max(((marginTotal + (marginLeft * (columnCount - 1))) / node.box.width) / columnCount, 0.01);
                                    for (let i = 0; i < columns.length; i++) {
                                        const column = columns[i];
                                        const first = column[0];
                                        if (i > 0) {
                                            first.android(first.localizeString('layout_marginLeft'), $util$1.formatPX(first.marginLeft + marginLeft));
                                        }
                                        row.push(first);
                                        column.forEach(item => {
                                            if (!item.hasWidth) {
                                                item.android('layout_width', '0px');
                                                item.app('layout_constraintWidth_percent', ((1 / columnCount) - marginPercent).toFixed(2));
                                            }
                                        });
                                        vertical.push(column);
                                    }
                                    horizontal.push(row);
                                }
                                else {
                                    function partitionChain(current, siblings, orientation, validate) {
                                        const map = MAP_LAYOUT.constraint;
                                        const mapParent = [];
                                        const coordinate = [];
                                        const connected = [];
                                        switch (orientation) {
                                            case AXIS_ANDROID.HORIZONTAL:
                                                mapParent.push(map['left'], map['right']);
                                                coordinate.push('linear.top', 'linear.bottom');
                                                connected.push(map['leftRight'], map['rightLeft']);
                                                break;
                                            case AXIS_ANDROID.VERTICAL:
                                                mapParent.push(map['top'], map['bottom']);
                                                coordinate.push('linear.left', 'linear.right');
                                                connected.push(map['topBottom'], map['bottomTop']);
                                                break;
                                        }
                                        return coordinate.map(value => {
                                            const sameXY = $util$1.sortAsc(siblings.filter(item => $util$1.hasSameValue(current, item, value) && item[orientation === AXIS_ANDROID.HORIZONTAL ? 'intersectX' : 'intersectY'](current.linear)), coordinate[0]);
                                            if (sameXY.length > 1) {
                                                if (!validate || (sameXY.every(item => !item.floating) && sameXY[0].app(mapParent[0]) === 'parent' && sameXY[sameXY.length - 1].app(mapParent[1]) === 'parent')) {
                                                    return sameXY;
                                                }
                                                else {
                                                    const chained = new Set([current]);
                                                    let valid;
                                                    do {
                                                        valid = false;
                                                        Array.from(chained).some(item => sameXY.some(adjacent => {
                                                            if (!chained.has(adjacent) && (adjacent.app(connected[0]) === item.stringId ||
                                                                adjacent.app(connected[1]) === item.stringId)) {
                                                                chained.add(adjacent);
                                                                valid = true;
                                                            }
                                                            return valid;
                                                        }));
                                                    } while (valid);
                                                    return Array.from(chained);
                                                }
                                            }
                                            return [];
                                        })
                                            .reduce((a, b) => a.length >= b.length ? a : b);
                                    }
                                    const mapId = new Set();
                                    const horizontalChain = pageflow.filter(current => !current.constraint.horizontal);
                                    const verticalChain = pageflow.filter(current => !current.constraint.vertical);
                                    function availableChain(list) {
                                        const id = list.map(item => item.id).sort().join('-');
                                        return !mapId.has(id) && !!mapId.add(id);
                                    }
                                    pageflow.some(current => {
                                        const horizontalOutput = [];
                                        const verticalOutput = [];
                                        if (horizontalChain.includes(current)) {
                                            horizontalOutput.push(...partitionChain(current, pageflow, AXIS_ANDROID.HORIZONTAL, !percentage));
                                            if (horizontalOutput.length > 1 && availableChain(horizontalOutput)) {
                                                horizontal.push($util$1.sortAsc(horizontalOutput, 'linear.left'));
                                            }
                                        }
                                        if (verticalChain.includes(current) && !percentage) {
                                            verticalOutput.push(...partitionChain(current, pageflow, AXIS_ANDROID.VERTICAL, true));
                                            if (verticalOutput.length > 1 && availableChain(verticalOutput)) {
                                                vertical.push($util$1.sortAsc(verticalOutput, 'linear.top'));
                                            }
                                        }
                                        return horizontalOutput.length === pageflow.length || verticalOutput.length === pageflow.length;
                                    });
                                    horizontal.sort((a, b) => a.length >= b.length ? -1 : 1);
                                    vertical.sort((a, b) => a.length >= b.length ? -1 : 1);
                                }
                                [horizontal, vertical].forEach((connected, index) => {
                                    if (connected.length > 0) {
                                        const inverse = index === 0 ? 1 : 0;
                                        const connectedRows = [];
                                        connected.forEach((chainable, level) => {
                                            if (chainable.length > 0) {
                                                const [HV, VH] = [MAP_CHAIN['horizontalVertical'][index], MAP_CHAIN['horizontalVertical'][inverse]];
                                                const [LT, TL] = [MAP_CHAIN['leftTop'][index], MAP_CHAIN['leftTop'][inverse]];
                                                const [RB, BR] = [MAP_CHAIN['rightBottom'][index], MAP_CHAIN['rightBottom'][inverse]];
                                                const [WH, HW] = [MAP_CHAIN['widthHeight'][index], MAP_CHAIN['widthHeight'][inverse]];
                                                const orientation = HV.toLowerCase();
                                                const orientationInverse = VH.toLowerCase();
                                                const dimension = WH.toLowerCase();
                                                if (flex.enabled) {
                                                    if (chainable.some(item => item.flex.order > 0)) {
                                                        if (flex.direction.indexOf('reverse') !== -1) {
                                                            $util$1.sortDesc(chainable, 'flex.order');
                                                        }
                                                        else {
                                                            $util$1.sortAsc(chainable, 'flex.order');
                                                        }
                                                    }
                                                }
                                                else if (!percentage && columnCount === 0) {
                                                    if (chainable.every(item => anchoredSibling(item, nodes, orientation))) {
                                                        return;
                                                    }
                                                }
                                                const first = chainable[0];
                                                const last = chainable[chainable.length - 1];
                                                let disconnected = false;
                                                let marginDelete = false;
                                                let maxOffset = -1;
                                                const attrs = index === 0 ? ['left', 'leftRight', 'top', AXIS_ANDROID.VERTICAL, 'hasWidth', 'right', 'marginHorizontal']
                                                    : ['top', 'topBottom', 'left', AXIS_ANDROID.HORIZONTAL, 'hasHeight', 'bottom', 'marginVertical'];
                                                for (let i = 0; i < chainable.length; i++) {
                                                    const item = chainable[i];
                                                    if (i === 0) {
                                                        if (!mapParent(item, attrs[0])) {
                                                            disconnected = true;
                                                            break;
                                                        }
                                                    }
                                                    else {
                                                        if (!mapSibling(item, attrs[1])) {
                                                            disconnected = true;
                                                            break;
                                                        }
                                                    }
                                                }
                                                if (!disconnected) {
                                                    if (chainable.every(item => $util$1.hasSameValue(first, item, `linear.${attrs[2]}`))) {
                                                        for (let j = 1; j < chainable.length; j++) {
                                                            const item = chainable[j];
                                                            if (!item.constraint[attrs[3]]) {
                                                                item.anchor(mapLayout[attrs[2]], first.stringId, attrs[3]);
                                                            }
                                                        }
                                                    }
                                                    if (!flex.enabled && node[attrs[4]] === 0) {
                                                        mapDelete(last, attrs[5]);
                                                        last.constraint[attrs[6]] = mapSibling(last, attrs[1]);
                                                    }
                                                }
                                                if (percentage) {
                                                    first.anchor(mapLayout[LT], 'parent', orientation);
                                                    last.anchor(mapLayout[RB], 'parent', orientation);
                                                    if (!node.renderParent.autoMarginHorizontal) {
                                                        if (first.float === 'right' && last.float === 'right') {
                                                            first.app(`layout_constraint${HV}_bias`, '1');
                                                        }
                                                        else {
                                                            first.app(`layout_constraint${HV}_bias`, '0');
                                                        }
                                                    }
                                                }
                                                else {
                                                    first.anchor(mapLayout[LT], 'parent', orientation);
                                                    last.anchor(mapLayout[RB], 'parent', orientation);
                                                }
                                                for (let i = 0; i < chainable.length; i++) {
                                                    const chain = chainable[i];
                                                    const next = chainable[i + 1];
                                                    const previous = chainable[i - 1];
                                                    if (flex.enabled) {
                                                        if (chain.linear[TL] === node.box[TL] && chain.linear[BR] === node.box[BR]) {
                                                            setAlignParent(chain, orientationInverse);
                                                        }
                                                        const rowNext = connected[level + 1];
                                                        if (rowNext) {
                                                            const chainNext = rowNext[i];
                                                            if (chainNext && chain.withinY(chainNext.linear)) {
                                                                chain.anchor(mapLayout['bottomTop'], chainNext.stringId);
                                                                if (!mapParent(chain, 'bottom')) {
                                                                    mapDelete(chain, 'bottom');
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else if (percentage) {
                                                        if (connectedRows.length === 0) {
                                                            chain.anchor(mapLayout['top'], 'parent');
                                                        }
                                                        else {
                                                            const previousRow = connectedRows[connectedRows.length - 1];
                                                            const bottom = Math.max.apply(null, previousRow.map(item => item.linear.bottom));
                                                            let anchorAbove;
                                                            if (chainable.length === previousRow.length) {
                                                                anchorAbove = previousRow[i];
                                                            }
                                                            else {
                                                                anchorAbove = previousRow.find(item => item.linear.bottom === bottom);
                                                            }
                                                            if (anchorAbove) {
                                                                chain.anchor(mapLayout['topBottom'], anchorAbove.stringId);
                                                            }
                                                        }
                                                        const width = chain.css('width');
                                                        if ($util$1.isPercent(width)) {
                                                            chain.android('layout_width', '0px');
                                                            chain.app(`layout_constraint${WH}_percent`, (parseInt(width) / 100).toFixed(2));
                                                        }
                                                        chain.constraint.horizontal = true;
                                                        chain.constraint.vertical = true;
                                                    }
                                                    else if (columnCount > 0) {
                                                        if (index === 0) {
                                                            chain.app(`layout_constraint${VH}_bias`, '0');
                                                        }
                                                        if (index === 1 && i > 0) {
                                                            chain.anchor(mapLayout['left'], first.stringId);
                                                        }
                                                        chain.constraint.horizontal = true;
                                                        chain.constraint.vertical = true;
                                                    }
                                                    if (next) {
                                                        chain.anchor(mapLayout[MAP_CHAIN['rightLeftBottomTop'][index]], next.stringId);
                                                        maxOffset = Math.max(next.linear[LT] - chain.linear[RB], maxOffset);
                                                    }
                                                    if (previous) {
                                                        chain.anchor(mapLayout[MAP_CHAIN['leftRightTopBottom'][index]], previous.stringId);
                                                        chain.constraint[`margin${HV}`] = previous.stringId;
                                                    }
                                                    chain.constraint[`chain${HV}`] = true;
                                                    if (!chain.has(dimension) || chain.has(dimension, $enum$1.CSS_STANDARD.PERCENT)) {
                                                        const minWH = chain.styleMap[`min${WH}`];
                                                        const maxWH = chain.styleMap[`max${WH}`];
                                                        if ($util$1.isUnit(minWH)) {
                                                            chain.app(`layout_constraint${WH}_min`, minWH);
                                                            chain.android(`layout_${dimension}`, '0px');
                                                        }
                                                        if ($util$1.isUnit(maxWH)) {
                                                            chain.app(`layout_constraint${WH}_max`, maxWH);
                                                            chain.android(`layout_${dimension}`, '0px');
                                                        }
                                                    }
                                                    if (flex.enabled) {
                                                        chain.app(`layout_constraint${HV}_weight`, chain.flex.grow.toString());
                                                        if (chain[`view${WH}`] === 0 && chain.flex.grow === 0 && chain.flex.shrink <= 1) {
                                                            chain.android(`layout_${dimension}`, 'wrap_content');
                                                        }
                                                        else if (chain.flex.grow > 0) {
                                                            chain.android(`layout_${dimension}`, '0px');
                                                        }
                                                        if (chain.flex.shrink === 0) {
                                                            chain.app(`layout_constrained${WH}`, 'true');
                                                        }
                                                        switch (chain.flex.alignSelf) {
                                                            case 'flex-start':
                                                                chain.anchor(mapLayout[TL], 'parent', orientationInverse);
                                                                break;
                                                            case 'flex-end':
                                                                chain.anchor(mapLayout[BR], 'parent', orientationInverse);
                                                                break;
                                                            case 'baseline':
                                                                const valid = chainable.some(adjacent => {
                                                                    if (adjacent !== chain && adjacent.nodeType <= $enum$1.NODE_STANDARD.TEXT) {
                                                                        chain.anchor(mapLayout['baseline'], adjacent.stringId);
                                                                        return true;
                                                                    }
                                                                    return false;
                                                                });
                                                                if (valid) {
                                                                    mapDelete(chain, 'top', 'bottom');
                                                                    for (const item of chainable) {
                                                                        if (mapSibling(item, 'top') === chain.stringId) {
                                                                            mapDelete(item, 'top');
                                                                        }
                                                                        if (mapSibling(item, 'bottom') === chain.stringId) {
                                                                            mapDelete(item, 'bottom');
                                                                        }
                                                                    }
                                                                    chain.constraint.vertical = true;
                                                                }
                                                                break;
                                                            case 'center':
                                                            case 'stretch':
                                                                if (chain.flex.alignSelf !== 'center') {
                                                                    chain.android(`layout_${HW.toLowerCase()}`, '0px');
                                                                }
                                                                chain.constraint[orientationInverse] = false;
                                                                setAlignParent(chain, orientationInverse);
                                                                break;
                                                        }
                                                        if (chain.flex.basis !== 'auto') {
                                                            const basis = $util$1.convertInt(chain.flex.basis);
                                                            if (basis > 0) {
                                                                if ($util$1.isPercent(chain.flex.basis)) {
                                                                    chain.app(`layout_constraint${WH}_percent`, (basis / 100).toFixed(2));
                                                                }
                                                                else {
                                                                    chain.app(`layout_constraint${WH}_min`, $util$1.formatPX(basis));
                                                                    chain.constraint[`min${WH}`] = true;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                const chainStyle = `layout_constraint${HV}_chainStyle`;
                                                if (flex.enabled &&
                                                    flex.justifyContent !== 'normal' &&
                                                    Math.max.apply(null, chainable.map(item => item.flex.grow)) === 0) {
                                                    switch (flex.justifyContent) {
                                                        case 'space-between':
                                                            first.app(chainStyle, 'spread_inside');
                                                            break;
                                                        case 'space-evenly':
                                                            first.app(chainStyle, 'spread');
                                                            chainable.forEach(item => item.app(`layout_constraint${HV}_weight`, (item.flex.grow || 1).toString()));
                                                            break;
                                                        case 'space-around':
                                                            first.app(`layout_constraint${HV}_chainStyle`, 'spread_inside');
                                                            first.constraint[orientation] = false;
                                                            last.constraint[orientation] = false;
                                                            this.addGuideline(first, orientation, true, false);
                                                            this.addGuideline(last, orientation, true, true);
                                                            break;
                                                        default:
                                                            let justifyContent = flex.justifyContent;
                                                            if (flex.direction.indexOf('reverse') !== -1) {
                                                                switch (flex.justifyContent) {
                                                                    case 'flex-start':
                                                                        justifyContent = 'flex-end';
                                                                        break;
                                                                    case 'flex-end':
                                                                        justifyContent = 'flex-start';
                                                                        break;
                                                                }
                                                            }
                                                            let bias = '0.5';
                                                            switch (justifyContent) {
                                                                case 'flex-start':
                                                                    bias = '0';
                                                                    break;
                                                                case 'flex-end':
                                                                    bias = '1';
                                                                    break;
                                                            }
                                                            first.app(chainStyle, 'packed');
                                                            first.app(`layout_constraint${HV}_bias`, bias);
                                                            break;
                                                    }
                                                    marginDelete = true;
                                                }
                                                else if (percentage) {
                                                    first.app(chainStyle, 'packed');
                                                }
                                                else if (!flex.enabled && columnCount > 0) {
                                                    first.app(chainStyle, index === 0 ? 'spread_inside' : 'packed');
                                                    marginDelete = index === 0;
                                                }
                                                else {
                                                    const alignLeft = $util$1.withinFraction(node.box.left, first.linear.left);
                                                    const alignRight = $util$1.withinFraction(last.linear.right, node.box.right);
                                                    const alignTop = $util$1.withinFraction(node.box.top, first.linear.top);
                                                    const alignBottom = $util$1.withinFraction(last.linear.bottom, node.box.bottom);
                                                    if ((orientation === AXIS_ANDROID.HORIZONTAL && alignLeft && alignRight) ||
                                                        (orientation === AXIS_ANDROID.VERTICAL && alignTop && alignBottom)) {
                                                        if (flex.enabled || chainable.length > 2) {
                                                            if (!flex.enabled && node.inlineElement) {
                                                                first.app(chainStyle, 'packed');
                                                                first.app(`layout_constraint${HV}_bias`, index === 0 && node.float === 'right' ? '1' : '0');
                                                            }
                                                            else {
                                                                first.app(chainStyle, 'spread_inside');
                                                                marginDelete = true;
                                                            }
                                                        }
                                                        else if (maxOffset > this.settings[`constraintChainPacked${HV}Offset`]) {
                                                            if (mapParent(first, LT)) {
                                                                mapDelete(first, MAP_CHAIN['rightLeftBottomTop'][index]);
                                                            }
                                                            if (mapParent(last, RB)) {
                                                                mapDelete(last, MAP_CHAIN['leftRightTopBottom'][index]);
                                                            }
                                                        }
                                                    }
                                                    else if ((maxOffset <= this.settings[`chainPacked${HV}Offset`] || node.flex.wrap !== 'nowrap') ||
                                                        (orientation === AXIS_ANDROID.HORIZONTAL && (alignLeft || alignRight))) {
                                                        first.app(chainStyle, 'packed');
                                                        let bias = '';
                                                        if (orientation === AXIS_ANDROID.HORIZONTAL) {
                                                            if (alignLeft) {
                                                                bias = '0';
                                                            }
                                                            else if (alignRight) {
                                                                bias = '1';
                                                            }
                                                        }
                                                        if (bias === '') {
                                                            bias = chainable[`${orientation}Bias`];
                                                        }
                                                        first.app(`layout_constraint${HV}_bias`, bias);
                                                    }
                                                    else {
                                                        first.app(chainStyle, 'spread');
                                                        marginDelete = true;
                                                    }
                                                    if (!flex.enabled) {
                                                        (index === 0 ? [[TL, BR], [BR, TL]] : [[LT, RB], [RB, LT]]).forEach(opposing => {
                                                            if (chainable.some(lower => !$util$1.hasSameValue(first, lower, `linear.${opposing[1]}`)) &&
                                                                chainable.every(upper => $util$1.hasSameValue(first, upper, `linear.${opposing[0]}`))) {
                                                                chainable.forEach(item => mapDelete(item, opposing[1]));
                                                            }
                                                        });
                                                        for (const item of chainable) {
                                                            for (const list of connected) {
                                                                if (list.find(subitem => subitem.id === item.id)) {
                                                                    list.length = 0;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                if (marginDelete) {
                                                    for (const item of chainable) {
                                                        delete item.constraint.marginHorizontal;
                                                        delete item.constraint.marginVertical;
                                                    }
                                                }
                                                connectedRows.push(chainable);
                                            }
                                        });
                                    }
                                });
                            }
                            for (const current of pageflow) {
                                current.constraint.horizontal = anchoredSibling(current, nodes, AXIS_ANDROID.HORIZONTAL);
                                current.constraint.vertical = anchoredSibling(current, nodes, AXIS_ANDROID.VERTICAL);
                            }
                            if (flex.enabled) {
                                if (flex.wrap !== 'nowrap') {
                                    ['topBottom', 'bottomTop'].forEach((value, index) => {
                                        for (const current of pageflow) {
                                            if (mapParent(current, index === 0 ? 'bottom' : 'top')) {
                                                const chain = [current];
                                                let valid = false;
                                                let adjacent = current;
                                                while (adjacent) {
                                                    const topBottom = mapSibling(adjacent, value);
                                                    if (topBottom) {
                                                        adjacent = nodes.find(item => item.stringId === topBottom);
                                                        if (adjacent && current.withinY(adjacent.linear)) {
                                                            chain.push(adjacent);
                                                            if (mapParent(adjacent, index === 0 ? 'top' : 'bottom')) {
                                                                valid = true;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        adjacent = undefined;
                                                    }
                                                }
                                                if (!valid) {
                                                    for (const item of chain) {
                                                        pageflow.some(next => {
                                                            if (item !== next && next.linear.top === item.linear.top && next.linear.bottom === item.linear.bottom) {
                                                                mapDelete(item, 'topBottom', 'bottomTop');
                                                                item.app(mapLayout['top'], next.stringId);
                                                                item.app(mapLayout['bottom'], next.stringId);
                                                                return true;
                                                            }
                                                            return false;
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                            else if (columnCount === 0) {
                                for (const current of pageflow) {
                                    [['top', 'bottom', 'topBottom'], ['bottom', 'top', 'bottomTop']].forEach(direction => {
                                        if (mapParent(current, direction[1]) && !mapSibling(current, direction[2])) {
                                            ['leftRight', 'rightLeft'].forEach(value => {
                                                const stringId = mapSibling(current, value);
                                                if (stringId) {
                                                    const aligned = pageflow.find(item => item.stringId === stringId);
                                                    if (aligned && mapSibling(aligned, direction[2])) {
                                                        if ($util$1.withinFraction(current.linear[direction[0]], aligned.linear[direction[0]])) {
                                                            current.anchor(mapLayout[direction[0]], aligned.stringId);
                                                        }
                                                        if ($util$1.withinFraction(current.linear[direction[1]], aligned.linear[direction[1]])) {
                                                            current.anchor(mapLayout[direction[1]], aligned.stringId);
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                                const unbound = pageflow.filter(current => !current.anchored && (mapParent(current, 'top') ||
                                    mapParent(current, 'right') ||
                                    mapParent(current, 'bottom') ||
                                    mapParent(current, 'left')));
                                if (nodes.filter(item => item.anchored).length === 0 && unbound.length === 0) {
                                    unbound.push(nodes[0]);
                                }
                                unbound.forEach(current => this.addGuideline(current, '', false, false));
                                const [adjacent, unanchored] = $util$1.partition(nodes, item => item.anchored);
                                for (const current of unanchored) {
                                    if ($util$1.withinRange(current.horizontalBias(), 0.5, 0.01) && $util$1.withinRange(current.verticalBias(), 0.5, 0.01)) {
                                        setAlignParent(current);
                                    }
                                    else if (this.settings.constraintCirclePositionAbsolute &&
                                        adjacent.length > 0 &&
                                        !current.constraint.horizontal &&
                                        !current.constraint.vertical) {
                                        const opposite = adjacent[0];
                                        const center1 = current.center;
                                        const center2 = opposite.center;
                                        const x = Math.abs(center1.x - center2.x);
                                        const y = Math.abs(center1.y - center2.y);
                                        let degrees = Math.round(Math.atan(Math.min(x, y) / Math.max(x, y)) * (180 / Math.PI));
                                        const radius = Math.round(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
                                        if (center1.y > center2.y) {
                                            if (center1.x > center2.x) {
                                                if (x > y) {
                                                    degrees += 90;
                                                }
                                                else {
                                                    degrees = 180 - degrees;
                                                }
                                            }
                                            else {
                                                if (x > y) {
                                                    degrees = 270 - degrees;
                                                }
                                                else {
                                                    degrees += 180;
                                                }
                                            }
                                        }
                                        else if (center1.y < center2.y) {
                                            if (center2.x > center1.x) {
                                                if (x > y) {
                                                    degrees += 270;
                                                }
                                                else {
                                                    degrees = 360 - degrees;
                                                }
                                            }
                                            else {
                                                if (x > y) {
                                                    degrees = 90 - degrees;
                                                }
                                            }
                                        }
                                        else {
                                            degrees = center1.x > center2.x ? 90 : 270;
                                        }
                                        current.delete('app', 'layout_constraint*');
                                        current.app('layout_constraintCircle', opposite.stringId);
                                        current.app('layout_constraintCircleRadius', delimitUnit(`${current.nodeName}`, 'constraintcircleradius', $util$1.formatPX(radius), this.settings));
                                        current.app('layout_constraintCircleAngle', degrees.toString());
                                        current.constraint.horizontal = true;
                                        current.constraint.vertical = true;
                                    }
                                    else {
                                        this.addGuideline(current);
                                    }
                                }
                                let bottomParent;
                                let rightParent;
                                const maxBottom = Math.max.apply(null, nodes.map(item => item.linear.bottom));
                                const connected = {};
                                function deleteChain(item, value) {
                                    mapDelete(item, value);
                                    delete connected[item.stringId][value];
                                }
                                for (const current of nodes) {
                                    const top = mapParent(current, 'top');
                                    const right = mapParent(current, 'right');
                                    let bottom = mapParent(current, 'bottom');
                                    const left = mapParent(current, 'left');
                                    connected[current.stringId] = {
                                        leftRight: mapSibling(current, 'leftRight'),
                                        rightLeft: mapSibling(current, 'rightLeft'),
                                        topBottom: mapSibling(current, 'topBottom'),
                                        bottomTop: mapSibling(current, 'bottomTop')
                                    };
                                    if ((bottom && mapSibling(current, 'topBottom') && current.hasHeight) ||
                                        (top && bottom && current.linear.bottom < maxBottom && !current.has('marginTop', $enum$1.CSS_STANDARD.AUTO))) {
                                        mapDelete(current, 'bottom');
                                        bottom = false;
                                    }
                                    if (current.pageflow) {
                                        [[left, right, 'rightLeft', 'leftRight', 'right', 'left', 'Horizontal'], [top, bottom, 'bottomTop', 'topBottom', 'bottom', 'top', 'Vertical']].forEach((value, index) => {
                                            if (value[0] || value[1]) {
                                                let valid = value[0] && value[1];
                                                let next = current;
                                                if (!valid) {
                                                    do {
                                                        const stringId = mapSibling(next, value[0] ? value[2] : value[3]);
                                                        if (stringId) {
                                                            next = this.findByStringId(stringId);
                                                            if (next && ((value[0] && mapParent(next, value[4])) || (value[1] && mapParent(next, value[5])))) {
                                                                valid = true;
                                                                break;
                                                            }
                                                        }
                                                        else {
                                                            next = undefined;
                                                        }
                                                    } while (next);
                                                }
                                                if (valid) {
                                                    node.constraint[`layout${value[6]}`] = true;
                                                }
                                                if (!current.constraint[`chain${value[6]}`]) {
                                                    if (value[0] && value[1]) {
                                                        if (!current.autoMargin && !current.linearVertical) {
                                                            current.android(`layout_${index === 0 ? 'width' : 'height'}`, 'match_parent', false);
                                                        }
                                                    }
                                                    else if (value[1]) {
                                                        if (valid) {
                                                            const below = this.findByStringId(mapSibling(current, value[3]));
                                                            if (below && below.marginBottom === 0) {
                                                                mapDelete(current, value[4]);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                        if (right) {
                                            if (!rightParent) {
                                                rightParent = false;
                                                rightParent = anchoredSibling(current, nodes, AXIS_ANDROID.HORIZONTAL);
                                            }
                                        }
                                        else if (left) {
                                            if (current.is($enum$1.NODE_STANDARD.TEXT) && current.cssParent('textAlign', true) === 'center') {
                                                current.anchor(mapLayout['right'], 'parent');
                                            }
                                            if (current.textElement &&
                                                !current.hasWidth &&
                                                current.toInt('maxWidth') === 0 &&
                                                current.multiLine &&
                                                !$dom$1.hasLineBreak(current.element) &&
                                                !nodes.some(item => mapSibling(item, 'rightLeft') === current.stringId)) {
                                                current.android('layout_width', 'match_parent');
                                            }
                                        }
                                        if (bottom) {
                                            if (!bottomParent) {
                                                bottomParent = false;
                                                bottomParent = anchoredSibling(current, nodes, AXIS_ANDROID.VERTICAL);
                                            }
                                        }
                                    }
                                    else {
                                        if (left && right && current.right === null && current.hasWidth) {
                                            switch (current.cssParent('textAlign', true)) {
                                                case 'center':
                                                case 'right':
                                                case 'end':
                                                    break;
                                                default:
                                                    mapDelete(current, 'right');
                                                    break;
                                            }
                                        }
                                        if (top && bottom && current.bottom === null && current.hasHeight) {
                                            switch (current.css('verticalAlign')) {
                                                case 'bottom':
                                                case 'text-bottom':
                                                case 'middle':
                                                    break;
                                                default:
                                                    mapDelete(current, 'bottom');
                                                    break;
                                            }
                                        }
                                        if (left && right && !node.hasWidth) {
                                            node.constraint.layoutWidth = true;
                                        }
                                        if (top && bottom && !node.hasHeight) {
                                            node.constraint.layoutHeight = true;
                                        }
                                        if (right && current.toInt('right') > 0) {
                                            current.modifyBox($enum$1.BOX_STANDARD.MARGIN_RIGHT, Math.max(current.toInt('right') - node.paddingRight, 0));
                                        }
                                        if (bottom && current.toInt('bottom') > 0) {
                                            current.modifyBox($enum$1.BOX_STANDARD.MARGIN_BOTTOM, Math.max(current.toInt('bottom') - node.paddingBottom, 0));
                                        }
                                        if (right && bottom) {
                                            if (node.documentRoot) {
                                                if (!node.hasWidth) {
                                                    node.constraint.layoutWidth = false;
                                                    node.constraint.layoutHorizontal = false;
                                                }
                                                if (!node.hasHeight) {
                                                    node.constraint.layoutHeight = false;
                                                    node.constraint.layoutVertical = false;
                                                }
                                            }
                                        }
                                    }
                                }
                                for (const left in connected) {
                                    for (const right in connected) {
                                        if (left !== right) {
                                            ['leftRight', 'rightLeft', 'bottomTop', 'topBottom'].forEach(value => {
                                                if (connected[left][value] && connected[left][value] === connected[right][value]) {
                                                    const conflict = nodes.find(item => item.stringId === connected[left][value]);
                                                    if (conflict) {
                                                        [nodes.find(item => item.stringId === left), nodes.find(item => item.stringId === right)].some((item, index) => {
                                                            if (item) {
                                                                const stringId = index === 0 ? left : right;
                                                                switch (value) {
                                                                    case 'leftRight':
                                                                    case 'rightLeft':
                                                                        if ((mapSibling(item, 'left') || mapSibling(item, 'right')) &&
                                                                            mapSibling(conflict, value === 'rightLeft' ? 'leftRight' : 'rightLeft') !== stringId) {
                                                                            deleteChain(item, value);
                                                                            return true;
                                                                        }
                                                                        break;
                                                                    case 'bottomTop':
                                                                    case 'topBottom':
                                                                        if ((mapSibling(item, 'top') || mapSibling(item, 'bottom')) &&
                                                                            mapSibling(conflict, value === 'topBottom' ? 'bottomTop' : 'topBottom') !== stringId) {
                                                                            deleteChain(item, value);
                                                                            return true;
                                                                        }
                                                                        break;
                                                                }
                                                            }
                                                            return false;
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    }
                                }
                                if (rightParent === false) {
                                    node.constraint.layoutWidth = true;
                                }
                                if (bottomParent === false) {
                                    node.constraint.layoutHeight = true;
                                }
                            }
                        }
                    }
                    for (const current of nodes) {
                        if (current.constraint.marginHorizontal) {
                            const previous = this.findByStringId(current.constraint.marginHorizontal);
                            if (previous) {
                                const offset = current.linear.left - previous.actualRight();
                                if (offset >= 1) {
                                    current.modifyBox($enum$1.BOX_STANDARD.MARGIN_LEFT, offset);
                                }
                            }
                        }
                        if (current.constraint.marginVertical) {
                            const previous = this.findByStringId(current.constraint.marginVertical);
                            if (previous) {
                                let bottom = previous.linear.bottom;
                                if ($dom$1.isUserAgent($enum$1.USER_AGENT.EDGE)) {
                                    const elements = $dom$1.getElementsBetweenSiblings(previous.groupElement ? previous.item().baseElement : previous.baseElement, current.baseElement).filter(element => element.tagName === 'BR');
                                    if (elements.length > 0) {
                                        bottom = Math.min(bottom, elements[0].getBoundingClientRect().top + this.settings.whitespaceVerticalOffset);
                                    }
                                }
                                const offset = current.linear.top - bottom;
                                if (offset >= 1) {
                                    current.modifyBox($enum$1.BOX_STANDARD.MARGIN_TOP, offset);
                                }
                            }
                        }
                    }
                }
                else {
                    if (node.linearHorizontal) {
                        const lineHeight = Math.max.apply(null, node.renderChildren.map(item => item.toInt('lineHeight')));
                        if (lineHeight > 0) {
                            let minHeight = Number.MAX_VALUE;
                            let offsetTop = 0;
                            const valid = node.renderChildren.every(item => {
                                const offset = lineHeight - item.bounds.height;
                                if (offset > 0) {
                                    minHeight = Math.min(offset, minHeight);
                                    if (lineHeight === item.toInt('lineHeight')) {
                                        offsetTop = Math.max(item.toInt('top') < 0 ? Math.abs(item.toInt('top')) : 0, offsetTop);
                                    }
                                    return true;
                                }
                                return false;
                            });
                            if (valid) {
                                node.modifyBox($enum$1.BOX_STANDARD.PADDING_TOP, Math.floor(minHeight / 2));
                                node.modifyBox($enum$1.BOX_STANDARD.PADDING_BOTTOM, Math.ceil(minHeight / 2) + offsetTop);
                            }
                        }
                    }
                }
            }
        }
        createGroup(parent, node, children) {
            const group = new ViewGroup(this.cache.nextId, node, parent, children, this.delegateNodeInit);
            if (children.length > 0) {
                children.forEach(item => item.inherit(group, 'data'));
            }
            this.cache.append(group);
            return group;
        }
        renderGroup(node, parent, nodeType, options) {
            const target = $util$1.hasValue(node.dataset.target) && !$util$1.hasValue(node.dataset.include);
            if (typeof nodeType === 'number') {
                node.nodeType = nodeType;
                nodeType = View.getControlName(nodeType);
            }
            switch (nodeType) {
                case NODE_ANDROID.LINEAR:
                    options = {
                        android: {
                            orientation: options && options.horizontal ? AXIS_ANDROID.HORIZONTAL : AXIS_ANDROID.VERTICAL
                        }
                    };
                    break;
                case NODE_ANDROID.GRID:
                    options = {
                        android: {
                            columnCount: options && $util$1.convertInt(options.columnCount) > 0 ? options.columnCount.toString() : '2',
                            rowCount: options && $util$1.convertInt(options.rowCount) > 0 ? options.rowCount.toString() : ''
                        }
                    };
                    break;
                default:
                    options = {};
                    break;
            }
            node.setNodeType(nodeType);
            let preXml = '';
            let postXml = '';
            if (node.overflowX || node.overflowY) {
                const overflow = [];
                if (node.overflowX && node.overflowY) {
                    overflow.push(NODE_ANDROID.SCROLL_HORIZONTAL, NODE_ANDROID.SCROLL_VERTICAL);
                }
                else {
                    if (node.overflowX) {
                        overflow.push(NODE_ANDROID.SCROLL_HORIZONTAL);
                    }
                    if (node.overflowY) {
                        overflow.push(NODE_ANDROID.SCROLL_VERTICAL);
                    }
                }
                let previous;
                const scrollView = overflow.map((controlName, index) => {
                    const container = new View(this.cache.nextId, index === 0 ? node.element : undefined, this.delegateNodeInit);
                    container.nodeName = node.nodeName;
                    container.setNodeType(controlName);
                    if (index === 0) {
                        container.inherit(node, 'initial', 'base', 'data', 'style', 'styleMap');
                        parent.replaceNode(node, container);
                        container.render(parent);
                    }
                    else {
                        container.init();
                        container.documentParent = node.documentParent;
                        container.inherit(node, 'dimensions');
                        container.inherit(node, 'initial', 'style', 'styleMap');
                        if (previous) {
                            previous.css('overflow', 'visible scroll');
                            previous.css('overflowX', 'scroll');
                            previous.css('overflowY', 'visible');
                            container.parent = previous;
                            container.render(previous);
                        }
                        container.css('overflow', 'scroll visible');
                        container.css('overflowX', 'visible');
                        container.css('overflowY', 'scroll');
                        if (node.has('height', $enum$1.CSS_STANDARD.UNIT)) {
                            container.css('height', $util$1.formatPX(node.toInt('height') + node.paddingTop + node.paddingBottom));
                        }
                    }
                    container.resetBox($enum$1.BOX_STANDARD.PADDING);
                    const indent = $util$1.repeat(container.renderDepth);
                    preXml += `{<${container.id}}${indent}<${controlName}{@${container.id}}>\n` +
                        `{:${container.id}}`;
                    postXml = `${indent}</${controlName}>\n{>${container.id}}` + (index === 1 ? '\n' : '') + postXml;
                    previous = container;
                    this.cache.append(container);
                    return container;
                });
                if (scrollView.length === 2) {
                    node.android('layout_width', 'wrap_content');
                    node.android('layout_height', 'wrap_content');
                }
                else {
                    node.android(node.overflowX ? 'layout_width' : 'layout_height', 'wrap_content');
                }
                node.removeElement();
                node.resetBox($enum$1.BOX_STANDARD.MARGIN);
                node.parent = scrollView[scrollView.length - 1];
                node.render(node.parent);
            }
            else {
                node.render(target ? node : parent);
            }
            node.apply(options);
            return ViewController.getEnclosingTag(target || $util$1.hasValue(parent.dataset.target) || (node.renderDepth === 0 && !node.documentRoot) ? -1 : node.renderDepth, nodeType, node.id, $xml$1.formatPlaceholder(node.id), preXml, postXml);
        }
        renderNode(node, parent, nodeType, recursive = false) {
            const target = $util$1.hasValue(node.dataset.target) && !$util$1.hasValue(node.dataset.include);
            if (typeof nodeType === 'number') {
                node.nodeType = nodeType;
                nodeType = View.getControlName(nodeType);
            }
            node.setNodeType(nodeType);
            switch (node.tagName) {
                case 'IMG': {
                    if (!recursive) {
                        const element = node.element;
                        const percentWidth = node.has('width', $enum$1.CSS_STANDARD.PERCENT);
                        const percentHeight = node.has('height', $enum$1.CSS_STANDARD.PERCENT);
                        let width = node.toInt('width');
                        let height = node.toInt('height');
                        let scaleType = '';
                        if (percentWidth || percentHeight) {
                            scaleType = percentWidth && percentHeight ? 'fitXY' : 'fitCenter';
                        }
                        else {
                            if (width === 0) {
                                const match = /width="(\d+)"/.exec(element.outerHTML);
                                if (match) {
                                    width = parseInt(match[1]);
                                    node.css('width', $util$1.formatPX(match[1]));
                                }
                            }
                            if (height === 0) {
                                const match = /height="(\d+)"/.exec(element.outerHTML);
                                if (match) {
                                    height = parseInt(match[1]);
                                    node.css('height', $util$1.formatPX(match[1]));
                                }
                            }
                            switch (node.css('objectFit')) {
                                case 'contain':
                                    scaleType = 'centerInside';
                                    break;
                                case 'cover':
                                    scaleType = 'centerCrop';
                                    break;
                                case 'scale-down':
                                    scaleType = 'fitCenter';
                                    break;
                                case 'none':
                                    scaleType = 'matrix';
                                    break;
                                default:
                                    scaleType = 'fitXY';
                                    break;
                            }
                        }
                        if (scaleType !== '') {
                            node.android('scaleType', scaleType);
                        }
                        if ((width > 0 && height === 0) || (width === 0 && height > 0)) {
                            node.android('adjustViewBounds', 'true');
                        }
                        if (!node.pageflow) {
                            const left = node.toInt('left');
                            const top = node.toInt('top');
                            if (left < 0 || top < 0) {
                                const container = new View(this.cache.nextId, node.element, this.delegateNodeInit);
                                container.excludeProcedure |= $enum$1.NODE_PROCEDURE.ALL;
                                container.excludeResource |= $enum$1.NODE_RESOURCE.ALL;
                                container.android('layout_width', width > 0 ? $util$1.formatPX(width) : 'wrap_content');
                                container.android('layout_height', height > 0 ? $util$1.formatPX(height) : 'wrap_content');
                                container.setBounds();
                                container.setNodeType(NODE_ANDROID.FRAME);
                                container.render(parent);
                                if (left < 0) {
                                    node.modifyBox($enum$1.BOX_STANDARD.MARGIN_LEFT, left, true);
                                    container.css('left', '0px');
                                }
                                if (top < 0) {
                                    node.modifyBox($enum$1.BOX_STANDARD.MARGIN_TOP, top, true);
                                    container.css('top', '0px');
                                }
                                node.parent = container;
                                this.cache.append(container);
                                return ViewController.getEnclosingTag(container.renderDepth, NODE_ANDROID.FRAME, container.id, this.renderNode(node, container, nodeType, true));
                            }
                        }
                        else {
                            if (parent.layoutHorizontal && node.baseline) {
                                node.android('baselineAlignBottom', 'true');
                            }
                        }
                    }
                    break;
                }
                case 'TEXTAREA': {
                    const element = node.element;
                    node.android('minLines', '2');
                    if (element.rows > 2) {
                        node.android('maxLines', element.rows.toString());
                    }
                    if (element.maxLength > 0) {
                        node.android('maxLength', element.maxLength.toString());
                    }
                    if (!node.hasWidth) {
                        const cols = $util$1.convertInt(element.cols);
                        if (cols > 0) {
                            node.css('width', $util$1.formatPX(cols * 10));
                        }
                    }
                    node.android('hint', element.placeholder);
                    node.android('scrollbars', AXIS_ANDROID.VERTICAL);
                    node.android('inputType', 'textMultiLine');
                    if (node.overflowX) {
                        node.android('scrollHorizontally', 'true');
                    }
                    break;
                }
                case 'INPUT': {
                    const element = node.element;
                    switch (element.type) {
                        case 'radio':
                            if (!recursive) {
                                const radiogroup = parent.map(item => {
                                    if (item.renderAs) {
                                        item = item.renderAs;
                                    }
                                    const input = item.element;
                                    if (item.visible &&
                                        !item.rendered &&
                                        input.type === 'radio' &&
                                        input.name === element.name) {
                                        return item;
                                    }
                                    return null;
                                })
                                    .filter(item => item);
                                if (radiogroup.length > 1) {
                                    const group = this.createGroup(parent, node, radiogroup);
                                    group.setNodeType(NODE_ANDROID.RADIO_GROUP);
                                    group.inherit(node, 'alignment');
                                    group.render(parent);
                                    let xml = '';
                                    let checked = '';
                                    group.each((item) => {
                                        if (item.element.checked) {
                                            checked = item.stringId;
                                        }
                                        xml += this.renderNode(item, group, $enum$1.NODE_STANDARD.RADIO, true);
                                    });
                                    group.android('orientation', $NodeList$1.linearX(radiogroup, radiogroup.every(item => item.documentParent === radiogroup[0].documentParent)) ? AXIS_ANDROID.HORIZONTAL : AXIS_ANDROID.VERTICAL);
                                    group.alignmentType |= $enum$1.NODE_ALIGNMENT.SEGMENTED;
                                    if (checked !== '') {
                                        group.android('checkedButton', checked);
                                    }
                                    return ViewController.getEnclosingTag(group.renderDepth, NODE_ANDROID.RADIO_GROUP, group.id, xml);
                                }
                            }
                            break;
                        case 'password':
                            node.android('inputType', 'textPassword');
                            break;
                        case 'text':
                            node.android('inputType', 'text');
                            break;
                        case 'range':
                            if ($util$1.hasValue(element.min)) {
                                node.android('min', element.min);
                            }
                            if ($util$1.hasValue(element.max)) {
                                node.android('max', element.max);
                            }
                            if ($util$1.hasValue(element.value)) {
                                node.android('progress', element.value);
                            }
                            break;
                    }
                    switch (element.type) {
                        case 'text':
                        case 'search':
                        case 'tel':
                        case 'url':
                        case 'email':
                        case 'password':
                            if (!node.hasWidth) {
                                const size = $util$1.convertInt(element.size);
                                if (size > 0) {
                                    node.css('width', $util$1.formatPX(size * 10));
                                }
                            }
                            break;
                    }
                    break;
                }
            }
            switch (node.controlName) {
                case NODE_ANDROID.TEXT:
                    const scrollbars = [];
                    if (node.overflowX) {
                        scrollbars.push(AXIS_ANDROID.HORIZONTAL);
                    }
                    if (node.overflowY) {
                        scrollbars.push(AXIS_ANDROID.VERTICAL);
                    }
                    if (scrollbars.length > 0) {
                        node.android('scrollbars', scrollbars.join('|'));
                    }
                    if (node.has('maxWidth', $enum$1.CSS_STANDARD.UNIT)) {
                        node.android('maxWidth', node.css('maxWidth'));
                    }
                    if (node.has('maxHeight', $enum$1.CSS_STANDARD.UNIT)) {
                        node.android('maxHeight', node.css('maxHeight'));
                    }
                    if (node.css('whiteSpace') === 'nowrap') {
                        node.android('singleLine', 'true');
                    }
                    break;
                case NODE_ANDROID.LINE:
                    if (!node.hasHeight) {
                        node.android('layout_height', $util$1.formatPX(node.borderTopWidth + node.borderBottomWidth + node.paddingTop + node.paddingBottom || 1));
                    }
                    break;
            }
            node.render(target ? node : parent);
            return ViewController.getEnclosingTag(target || $util$1.hasValue(parent.dataset.target) || (node.renderDepth === 0 && !node.documentRoot) ? -1 : node.renderDepth, node.controlName, node.id);
        }
        renderNodeStatic(nodeType, depth, options = {}, width = '', height = '', node, children) {
            if (!node) {
                node = new View(0, undefined, this.delegateNodeInit);
            }
            node.apply(options);
            const renderDepth = Math.max(0, depth);
            let viewName = '';
            if (typeof nodeType === 'number') {
                node.nodeType = nodeType;
                viewName = View.getControlName(nodeType);
            }
            else {
                viewName = nodeType;
            }
            switch (viewName) {
                case 'include':
                case 'merge':
                case 'menu':
                    break;
                default:
                    node.setNodeType(viewName);
                    break;
            }
            const displayName = node.styleElement ? node.nodeName : viewName;
            if ($util$1.hasValue(width)) {
                if (!isNaN(parseInt(width))) {
                    width = delimitUnit(displayName, 'width', width, this.settings);
                }
                node.android('layout_width', width, false);
            }
            if ($util$1.hasValue(height)) {
                if (!isNaN(parseInt(height))) {
                    height = delimitUnit(displayName, 'height', height, this.settings);
                }
                node.android('layout_height', height, false);
            }
            node.renderDepth = renderDepth;
            let output = ViewController.getEnclosingTag(!node.documentRoot && depth === 0 ? -1 : depth, viewName, node.id, children ? $xml$1.formatPlaceholder(node.id) : '');
            if (this.settings.showAttributes && node.id === 0) {
                const indent = $util$1.repeat(renderDepth + 1);
                const attrs = node.combine().map(value => `\n${indent + value}`).join('');
                output = output.replace($xml$1.formatPlaceholder(node.id, '@'), attrs);
            }
            options['stringId'] = node.stringId;
            return output;
        }
        renderInclude(node, parent, name) {
            this._merge[name] = node.dataset.includeMerge === 'true';
            node.documentRoot = !this._merge[name];
            return this.renderNodeStatic('include', parent.renderDepth + 1, {
                layout: `@layout/${name}`
            });
        }
        renderMerge(name, value) {
            let xml = value.join('');
            if (this._merge[name]) {
                const node = new View(0, undefined, this.delegateNodeInit);
                node.documentRoot = true;
                xml = this.renderNodeStatic('merge', 0, {}, '', '', node, true)
                    .replace('{:0}', xml);
            }
            return xml;
        }
        renderColumnSpace(depth, width, height = '', columnSpan = 1) {
            let percent = '';
            if ($util$1.isPercent(width)) {
                percent = (parseInt(width) / 100).toFixed(2);
                width = '0px';
            }
            return this.renderNodeStatic($enum$1.NODE_STANDARD.SPACE, depth, {
                android: {
                    layout_columnWeight: percent,
                    layout_columnSpan: columnSpan.toString()
                }
            }, width, $util$1.hasValue(height) ? height : 'wrap_content');
        }
        baseRenderDepth(name) {
            return this._merge[name] ? 0 : -1;
        }
        setBoxSpacing(data) {
            data.cache.visible.forEach(node => node.rendered && node.setBoxSpacing());
        }
        addGuideline(node, orientation = '', percent, opposite) {
            const map = MAP_LAYOUT.constraint;
            if (node.pageflow) {
                if (opposite === undefined) {
                    opposite = (node.float === 'right' ||
                        (node.left === null && node.right !== null) ||
                        (node.textElement && node.css('textAlign') === 'right') ||
                        node.alignParent('right'));
                }
                if (percent === undefined && opposite) {
                    percent = true;
                }
            }
            if (node.dataset.constraintPercent) {
                percent = node.dataset.constraintPercent === 'true';
            }
            const parent = node.documentParent;
            const beginPercent = `layout_constraintGuide_${percent ? 'percent' : 'begin'}`;
            [AXIS_ANDROID.HORIZONTAL, AXIS_ANDROID.VERTICAL].forEach((value, index) => {
                if (!node.constraint[value] && (orientation === '' || value === orientation)) {
                    let LT = '';
                    let RB = '';
                    let LTRB = '';
                    let RBLT = '';
                    let found = false;
                    let offset = 0;
                    switch (index) {
                        case 0:
                            LT = !opposite ? 'left' : 'right';
                            RB = !opposite ? 'right' : 'left';
                            LTRB = !opposite ? 'leftRight' : 'rightLeft';
                            RBLT = !opposite ? 'rightLeft' : 'leftRight';
                            if (node.position === 'relative' && node.toInt('left') < 0) {
                                offset = node.toInt('left');
                            }
                            break;
                        case 1:
                            LT = !opposite ? 'top' : 'bottom';
                            RB = !opposite ? 'bottom' : 'top';
                            LTRB = !opposite ? 'topBottom' : 'bottomTop';
                            RBLT = !opposite ? 'bottomTop' : 'topBottom';
                            if (node.position === 'relative' && node.toInt('top') < 0) {
                                offset = node.toInt('top');
                            }
                            break;
                    }
                    const dimension = node.pageflow ? 'bounds' : 'linear';
                    const position = percent ? Math.abs((node[dimension][LT] + offset) - (parent.documentBody ? 0 : parent.box[LT])) / parent.box[index === 0 ? 'width' : 'height'] : 0;
                    if (!percent) {
                        const direction = $util$1.capitalize(value);
                        found = parent.renderChildren.some(item => {
                            if (item !== node && item.constraint[value] && (!item.constraint[`chain${direction}`] || item.constraint[`margin${direction}`])) {
                                if ($util$1.withinFraction(node.linear[LT] + offset, item.linear[RB])) {
                                    node.anchor(map[LTRB], item.stringId, value, true);
                                    return true;
                                }
                                else if ($util$1.withinFraction(node.linear[RB] + offset, item.linear[LT])) {
                                    node.anchor(map[RBLT], item.stringId, value, true);
                                    return true;
                                }
                                if ($util$1.withinFraction(node.bounds[LT] + offset, item.bounds[LT])) {
                                    node.anchor(map[index === 1 &&
                                        node.textElement &&
                                        node.baseline &&
                                        item.textElement &&
                                        item.baseline ? 'baseline' : LT], item.stringId, value, true);
                                    return true;
                                }
                                else if ($util$1.withinFraction(node.bounds[RB] + offset, item.bounds[RB])) {
                                    node.anchor(map[RB], item.stringId, value, true);
                                    return true;
                                }
                            }
                            return false;
                        });
                    }
                    if (!found) {
                        const guideline = parent.constraint.guideline || {};
                        let location = percent ? parseFloat(Math.abs(position - (!opposite ? 0 : 1)).toFixed(this.settings.constraintPercentAccuracy))
                            : (!opposite ? (node[dimension][LT] + offset) - parent.box[LT] : (node[dimension][LT] + offset) - parent.box[RB]);
                        if (!percent && !opposite) {
                            if (location < 0) {
                                const padding = parent[`padding${$util$1.capitalize(LT)}`];
                                if (padding >= Math.abs(location)) {
                                    location = 0;
                                }
                                else {
                                    location = Math.abs(location) - padding;
                                }
                            }
                            else {
                                if (parent.documentBody) {
                                    location = node[dimension][LT] + offset;
                                }
                            }
                        }
                        if (location === 0) {
                            node.anchor(map[LT], 'parent', value, true);
                        }
                        else {
                            const options = createViewAttribute({
                                android: {
                                    orientation: index === 0 ? AXIS_ANDROID.VERTICAL : AXIS_ANDROID.HORIZONTAL
                                },
                                app: {
                                    [beginPercent]: location.toString()
                                }
                            });
                            const anchors = $util$1.optional(guideline, `${value}.${beginPercent}.${LT}`, 'object');
                            if (anchors) {
                                for (const stringId in anchors) {
                                    if (anchors[stringId] === location) {
                                        node.anchor(map[LT], stringId, value, true);
                                        node.delete('app', map[RB]);
                                        found = true;
                                        break;
                                    }
                                }
                            }
                            if (!found) {
                                if (!percent) {
                                    options.app[beginPercent] = delimitUnit(node.nodeName, 'constraintguide_begin', $util$1.formatPX(location), this.settings);
                                }
                                this.appendAfter(node.id, this.renderNodeStatic(NODE_ANDROID.GUIDELINE, node.renderDepth, options, 'wrap_content', 'wrap_content'));
                                const stringId = options['stringId'];
                                node.anchor(map[LT], stringId, value, true);
                                node.delete('app', map[RB]);
                                node.constraint[`${value}Guideline`] = stringId;
                                if (guideline[value] === undefined) {
                                    guideline[value] = {};
                                }
                                if (guideline[value][beginPercent] === undefined) {
                                    guideline[value][beginPercent] = {};
                                }
                                if (guideline[value][beginPercent][LT] === undefined) {
                                    guideline[value][beginPercent][LT] = {};
                                }
                                guideline[value][beginPercent][LT][stringId] = location;
                                parent.constraint.guideline = guideline;
                            }
                        }
                    }
                }
            });
        }
        setAttributes(data) {
            if (this.settings.showAttributes) {
                function parseAttributes(node) {
                    if (node.dir === 'rtl') {
                        if (node.nodeType < $enum$1.NODE_STANDARD.INLINE) {
                            node.android('textDirection', 'rtl');
                        }
                        else if (node.renderChildren.length > 0) {
                            node.android('layoutDirection', 'rtl');
                        }
                    }
                    for (const name in node.dataset) {
                        if (/^attr[A-Z]+/.test(name)) {
                            const obj = $util$1.capitalize(name.substring(4), false);
                            node.dataset[name].split(';').forEach(values => {
                                const [key, value] = values.split('::');
                                if ($util$1.hasValue(key) && $util$1.hasValue(value)) {
                                    node.attr(obj, key, value);
                                }
                            });
                        }
                    }
                    const indent = $util$1.repeat(node.renderDepth + 1);
                    return node.combine().map(value => `\n${indent + value}`).join('');
                }
                function getRootNamespace(content) {
                    let output = '';
                    for (const namespace in XMLNS_ANDROID) {
                        if (new RegExp(`\\s+${namespace}:`).test(content)) {
                            output += `\n\t${getXmlNs(namespace)}`;
                        }
                    }
                    return output;
                }
                const cache = data.cache.visible.map(node => ({ pattern: $xml$1.formatPlaceholder(node.id, '@'), attributes: parseAttributes(node) }));
                for (const value of [...data.views, ...data.includes]) {
                    cache.forEach(item => value.content = value.content.replace(item.pattern, item.attributes));
                    value.content = value.content.replace(`{#0}`, getRootNamespace(value.content));
                }
            }
        }
        findByStringId(id) {
            return this.cache.find('stringId', id);
        }
        get delegateNodeInit() {
            return (self) => {
                self.localSettings = {
                    targetAPI: this.settings.targetAPI !== undefined ? this.settings.targetAPI : 26,
                    supportRTL: this.settings.supportRTL !== undefined ? this.settings.supportRTL : true,
                    constraintPercentAccuracy: this.settings.constraintPercentAccuracy !== undefined ? this.settings.constraintPercentAccuracy : 4,
                    customizationsOverwritePrivilege: this.settings.customizationsOverwritePrivilege !== undefined ? this.settings.customizationsOverwritePrivilege : true,
                    autoSizePaddingAndBorderWidth: this.settings.autoSizePaddingAndBorderWidth !== undefined ? this.settings.autoSizePaddingAndBorderWidth : true,
                    ellipsisOnTextOverflow: this.settings.ellipsisOnTextOverflow !== undefined ? this.settings.ellipsisOnTextOverflow : true
                };
            };
        }
    }

    const template = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">',
        '!1',
        '	<stroke android:width="{&width}" {~borderStyle} />',
        '!1',
        '!2',
        '	<solid android:color="@color/{&color}" />',
        '!2',
        '!3',
        '	<corners android:radius="{~radius}" android:topLeftRadius="{~topLeftRadius}" android:topRightRadius="{~topRightRadius}" android:bottomLeftRadius="{~bottomLeftRadius}" android:bottomRightRadius="{~bottomRightRadius}" />',
        '!3',
        '!4',
        '	<gradient android:type="{&type}" android:startColor="@color/{~startColor}" android:endColor="@color/{~endColor}" android:centerColor="@color/{~centerColor}" android:angle="{~angle}" android:centerX="{~centerX}" android:centerY="{~centerY}" android:gradientRadius="{~gradientRadius}" />',
        '!4',
        '</shape>'
    ];
    var SHAPE_TMPL = template.join('\n');

    const template$1 = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<vector xmlns:android="http://schemas.android.com/apk/res/android" {~namespace} android:width="{&width}" android:height="{&height}" android:viewportWidth="{&viewportWidth}" android:viewportHeight="{&viewportHeight}" android:alpha="{~alpha}">',
        '!1',
        '	<group android:name="{~name}" android:rotation="{~rotation}" android:pivotX="{~pivotX}" android:pivotY="{~pivotY}" android:scaleX="{~scaleX}" android:scaleY="{~scaleY}" android:translateX="{~translateX}" android:translateY="{~translateY}">',
        '!2',
        '!clipPaths',
        '		<clip-path android:name="{~name}" android:pathData="{&d}" />',
        '!clipPaths',
        '		<path',
        '			android:name="{~name}" android:fillType="{~fillRule}" android:fillColor="{~fill}" android:fillAlpha="{~fillOpacity}" android:strokeColor="{~stroke}" android:strokeWidth="{~strokeWidth}" android:strokeAlpha="{~strokeOpacity}" android:strokeLineCap="{~strokeLinecap}" android:strokeLineJoin="{~strokeLinejoin}" android:strokeMiterLimit="{~strokeMiterlimit}"',
        '			android:pathData="{&d}">',
        '!fill',
        '			<aapt:attr name="android:fillColor">',
        '!gradients',
        '				<gradient android:type="{&type}" android:startColor="@color/{~startColor}" android:endColor="@color/{~endColor}" android:centerColor="@color/{~centerColor}" android:startX="{~startX}" android:startY="{~startY}" android:endX="{~endX}" android:endY="{~endY}" android:centerX="{~centerX}" android:centerY="{~centerY}" android:gradientRadius="{~gradientRadius}">',
        '!colorStop',
        '					<item android:offset="{&offset}" android:color="{&color}" />',
        '!colorStop',
        '				</gradient>',
        '!gradients',
        '			</aapt:attr>',
        '!fill',
        '		</path>',
        '!2',
        '	</group>',
        '!1',
        '</vector>',
    ];
    var VECTOR_TMPL = template$1.join('\n');

    const template$2 = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<layer-list xmlns:android="http://schemas.android.com/apk/res/android">',
        '!1',
        '	<item>',
        '		<shape android:shape="rectangle">',
        '			<solid android:color="@color/{&color}" />',
        '		</shape>',
        '	</item>',
        '!1',
        '!2',
        '	<item>',
        '		<shape android:shape="rectangle">',
        '			<gradient android:type="{&type}" android:startColor="@color/{~startColor}" android:endColor="@color/{~endColor}" android:centerColor="@color/{~centerColor}" android:angle="{~angle}" android:centerX="{~centerX}" android:centerY="{~centerY}" android:gradientRadius="{~gradientRadius}" android:visible="{~visible}" />',
        '		</shape>',
        '	</item>',
        '!2',
        '!3',
        '	<item android:drawable="@drawable/{&vector}" />',
        '!3',
        '!4',
        '	<item android:left="{~left}" android:top="{~top}" android:right="{~right}" android:bottom="{~bottom}" android:width="{~width}" android:height="{~height}">',
        '		<rotate android:drawable="@drawable/{&src}" android:fromDegrees="{~fromDegrees}" android:toDegrees="{~toDegrees}" android:pivotX="{~pivotX}" android:pivotY="{~pivotY}" android:visible="{~visible}" />',
        '	</item>',
        '!4',
        '!5',
        '	<item android:left="{~left}" android:top="{~top}" android:right="{~right}" android:bottom="{~bottom}" android:drawable="@drawable/{&src}" android:width="{~width}" android:height="{~height}" />',
        '!5',
        '!6',
        '	<item android:left="{~left}" android:top="{~top}" android:right="{~right}" android:bottom="{~bottom}">',
        '		<bitmap android:src="@drawable/{&src}" android:gravity="{~gravity}" android:tileMode="{~tileMode}" android:tileModeX="{~tileModeX}" android:tileModeY="{~tileModeY}" />',
        '	</item>',
        '!6',
        '!7',
        '	<item android:left="{~left}" android:top="{~top}" android:right="{~right}" android:bottom="{~bottom}">',
        '		<shape android:shape="rectangle">',
        '!stroke',
        '			<stroke android:width="{&width}" {~borderStyle} />',
        '!stroke',
        '!corners',
        '			<corners android:radius="{~radius}" android:topLeftRadius="{~topLeftRadius}" android:topRightRadius="{~topRightRadius}" android:bottomRightRadius="{~bottomRightRadius}" android:bottomLeftRadius="{~bottomLeftRadius}" />',
        '!corners',
        '		</shape>',
        '	</item>',
        '!7',
        '</layer-list>'
    ];
    var LAYERLIST_TMPL = template$2.join('\n');

    var $Resource = androme.lib.base.Resource;
    var $enum$2 = androme.lib.enumeration;
    var $const$1 = androme.lib.constant;
    var $util$2 = androme.lib.util;
    var $dom$2 = androme.lib.dom;
    var $xml$2 = androme.lib.xml;
    var $color = androme.lib.color;
    const FONT_STYLE = {
        'fontFamily': 'android:fontFamily="{0}"',
        'fontStyle': 'android:textStyle="{0}"',
        'fontWeight': 'android:fontWeight="{0}"',
        'fontSize': 'android:textSize="{0}"',
        'color': 'android:textColor="@color/{0}"',
        'backgroundColor': 'android:background="@color/{0}"'
    };
    function getStoredDrawable(xml) {
        for (const [name, value] of $Resource.STORED.drawables.entries()) {
            if (value === xml) {
                return name;
            }
        }
        return '';
    }
    function getBorderStyle(border, direction = -1, halfSize = false) {
        const result = {
            solid: `android:color="@color/${border.color}"`,
            groove: '',
            ridge: ''
        };
        const style = border.style;
        Object.assign(result, {
            double: result.solid,
            inset: result.solid,
            outset: result.solid,
            dotted: `${result.solid} android:dashWidth="3px" android:dashGap="1px"`,
            dashed: `${result.solid} android:dashWidth="1px" android:dashGap="1px"`
        });
        const groove = style === 'groove';
        if (parseInt(border.width) > 1 && (groove || style === 'ridge')) {
            const color = $color.parseRGBA(border.color);
            if (color) {
                const reduced = $color.reduceRGBA(color.valueRGBA, groove || color.valueRGB === '#000000' ? 0.5 : -0.5);
                if (reduced) {
                    const colorValue = ResourceHandler.addColor(reduced);
                    if (colorValue !== '') {
                        const colorName = `android:color="@color/${colorValue}"`;
                        if (direction === 0 || direction === 2) {
                            halfSize = !halfSize;
                        }
                        if (color.valueRGB === '#000000' && ((groove && (direction === 1 || direction === 3)) || (!groove && (direction === 0 || direction === 2)))) {
                            halfSize = !halfSize;
                        }
                        if (halfSize) {
                            switch (direction) {
                                case 0:
                                    result[style] = colorName;
                                    break;
                                case 1:
                                    result[style] = result.solid;
                                    break;
                                case 2:
                                    result[style] = result.solid;
                                    break;
                                case 3:
                                    result[style] = colorName;
                                    break;
                            }
                        }
                        else {
                            switch (direction) {
                                case 0:
                                    result[style] = result.solid;
                                    break;
                                case 1:
                                    result[style] = colorName;
                                    break;
                                case 2:
                                    result[style] = colorName;
                                    break;
                                case 3:
                                    result[style] = result.solid;
                                    break;
                            }
                        }
                    }
                }
            }
        }
        return result[style] || result.solid;
    }
    function getHexARGB(value) {
        return value ? (value.opaque ? value.valueARGB : value.valueRGB) : '';
    }
    class ResourceHandler extends androme.lib.base.Resource {
        constructor() {
            super(...arguments);
            this._tagStyle = {};
            this._tagCount = {};
        }
        static formatOptions(options, settings) {
            for (const namespace in options) {
                const obj = options[namespace];
                if (typeof obj === 'object') {
                    for (const attr in obj) {
                        if (obj.hasOwnProperty(attr)) {
                            let value = obj[attr].toString();
                            switch (namespace) {
                                case 'android': {
                                    switch (attr) {
                                        case 'text':
                                            if (!value.startsWith('@string/')) {
                                                value = this.addString(value, '', settings);
                                                if (value !== '') {
                                                    obj[attr] = `@string/${value}`;
                                                    continue;
                                                }
                                            }
                                            break;
                                        case 'src':
                                            if ($const$1.DOM_REGEX.URI.test(value)) {
                                                value = this.addImage({ mdpi: value });
                                                if (value !== '') {
                                                    obj[attr] = `@drawable/${value}`;
                                                    continue;
                                                }
                                            }
                                            break;
                                    }
                                    break;
                                }
                            }
                            const color = $color.parseRGBA(value);
                            if (color) {
                                const colorValue = this.addColor(color);
                                if (colorValue !== '') {
                                    obj[attr] = `@color/${colorValue}`;
                                }
                            }
                        }
                    }
                }
            }
            return options;
        }
        static addString(value, name = '', settings) {
            if (value !== '') {
                if (name === '') {
                    name = value;
                }
                const numeric = $util$2.isNumber(value);
                if (!numeric || (settings && settings.numberResourceValue)) {
                    for (const [resourceName, resourceValue] of $Resource.STORED.strings.entries()) {
                        if (resourceValue === value) {
                            return resourceName;
                        }
                    }
                    name = name.trim()
                        .toLowerCase()
                        .replace(/[^a-z\d]/g, '_')
                        .replace(/_+/g, '_')
                        .split('_')
                        .slice(0, 4)
                        .join('_')
                        .replace(/_+$/g, '');
                    if (numeric || /^\d/.test(name) || RESERVED_JAVA.includes(name)) {
                        name = `__${name}`;
                    }
                    else if (name === '') {
                        name = `__symbol${Math.ceil(Math.random() * 100000)}`;
                    }
                    if ($Resource.STORED.strings.has(name)) {
                        name = generateId('strings', name, 1);
                    }
                    $Resource.STORED.strings.set(name, value);
                }
                return name;
            }
            return '';
        }
        static addImageSrcSet(element, prefix = '') {
            const images = {};
            const srcset = element.srcset.trim();
            if (srcset !== '') {
                const filepath = element.src.substring(0, element.src.lastIndexOf('/') + 1);
                srcset.split(',').forEach(value => {
                    const match = /^(.*?)\s*(\d+\.?\d*x)?$/.exec(value.trim());
                    if (match) {
                        if (!$util$2.hasValue(match[2])) {
                            match[2] = '1x';
                        }
                        const src = filepath + $util$2.lastIndexOf(match[1]);
                        switch (match[2]) {
                            case '0.75x':
                                images.ldpi = src;
                                break;
                            case '1x':
                                images.mdpi = src;
                                break;
                            case '1.5x':
                                images.hdpi = src;
                                break;
                            case '2x':
                                images.xhdpi = src;
                                break;
                            case '3x':
                                images.xxhdpi = src;
                                break;
                            case '4x':
                                images.xxxhdpi = src;
                                break;
                        }
                    }
                });
            }
            if (images.mdpi === undefined) {
                images.mdpi = element.src;
            }
            return this.addImage(images, prefix);
        }
        static addImage(images, prefix = '') {
            let src = '';
            if (images && images.mdpi) {
                src = $util$2.lastIndexOf(images.mdpi);
                const format = $util$2.lastIndexOf(src, '.').toLowerCase();
                src = src.replace(/.\w+$/, '').replace(/-/g, '_');
                switch (format) {
                    case 'bmp':
                    case 'cur':
                    case 'gif':
                    case 'ico':
                    case 'jpg':
                    case 'png':
                        src = $Resource.insertStoredAsset('images', prefix + src, images);
                        break;
                    default:
                        src = '';
                        break;
                }
            }
            return src;
        }
        static addImageURL(value, prefix = '') {
            const url = $dom$2.cssResolveUrl(value);
            if (url !== '') {
                return this.addImage({ mdpi: url }, prefix);
            }
            return '';
        }
        static addColor(value) {
            if (typeof value === 'string') {
                value = $color.parseRGBA(value);
            }
            if (value && value.valueRGBA !== '#00000000') {
                const valueARGB = getHexARGB(value);
                let name = $Resource.STORED.colors.get(valueARGB) || '';
                if (name === '') {
                    const shade = $color.getColorByShade(value.valueRGB);
                    if (shade) {
                        shade.name = $util$2.convertUnderscore(shade.name);
                        if (!value.opaque && shade.hex === value.valueRGB) {
                            name = shade.name;
                        }
                        else {
                            name = generateId('color', shade.name, 1);
                        }
                        $Resource.STORED.colors.set(valueARGB, name);
                    }
                }
                return name;
            }
            return '';
        }
        static getColor(value) {
            for (const [hex, name] of $Resource.STORED.colors.entries()) {
                if (name === value) {
                    return hex;
                }
            }
            return '';
        }
        reset() {
            super.reset();
            this.file.reset();
            this._tagStyle = {};
            this._tagCount = {};
        }
        finalize(viewData) {
            const callbackArray = [];
            const styles = {};
            this.processFontStyle(viewData);
            if (this.settings.dimensResourceValue) {
                callbackArray.push(this.processDimensions(viewData));
            }
            for (const node of viewData.cache) {
                const children = node.renderChildren.filter(item => item.visible && item.auto);
                if (children.length > 1) {
                    const map = new Map();
                    let style = '';
                    let valid = true;
                    for (let i = 0; i < children.length; i++) {
                        let found = false;
                        children[i].combine('_', 'android').some(value => {
                            if (value.startsWith('style=')) {
                                if (i === 0) {
                                    style = value;
                                }
                                else {
                                    if (style === '' || value !== style) {
                                        valid = false;
                                        return true;
                                    }
                                }
                                found = true;
                            }
                            else {
                                if (!map.has(value)) {
                                    map.set(value, 0);
                                }
                                map.set(value, map.get(value) + 1);
                            }
                            return false;
                        });
                        if (!valid || (style !== '' && !found)) {
                            valid = false;
                            break;
                        }
                    }
                    if (valid) {
                        for (const [attr, value] of map.entries()) {
                            if (value !== children.length) {
                                map.delete(attr);
                            }
                        }
                        if (map.size > 1) {
                            if (style !== '') {
                                style = $util$2.trimString(style.substring(style.indexOf('/') + 1), '"');
                            }
                            const common = [];
                            for (const attr of map.keys()) {
                                const match = attr.match(/(\w+):(\w+)="(.*?)"/);
                                if (match) {
                                    children.forEach(item => item.delete(match[1], match[2]));
                                    common.push(match[0]);
                                }
                            }
                            common.sort();
                            let name = '';
                            for (const index in styles) {
                                if (styles[index].join(';') === common.join(';')) {
                                    name = index;
                                    break;
                                }
                            }
                            if (!(name !== '' && style !== '' && name.startsWith(`${style}.`))) {
                                name = $util$2.convertCamelCase((style !== '' ? `${style}.` : '') + $util$2.capitalize(node.nodeId), '_');
                                styles[name] = common;
                            }
                            children.forEach(item => item.attr('_', 'style', `@style/${name}`));
                        }
                    }
                }
            }
            for (const name in styles) {
                $Resource.STORED.styles.set(name, {
                    name,
                    attrs: styles[name].join(';'),
                    ids: []
                });
            }
            return callbackArray;
        }
        setBoxStyle() {
            super.setBoxStyle();
            this.cache.elements.forEach(node => {
                const stored = $dom$2.getElementCache(node.element, 'boxStyle');
                if (stored && !node.hasBit('excludeResource', $enum$2.NODE_RESOURCE.BOX_STYLE)) {
                    function checkPartialBackgroundPosition(current, adjacent, defaultPosition) {
                        if (current.indexOf(' ') === -1 && adjacent.indexOf(' ') !== -1) {
                            if (/^[a-z]+$/.test(current)) {
                                return `${current === 'initial' ? defaultPosition : current} 0px`;
                            }
                            else {
                                return `${defaultPosition} ${current}`;
                            }
                        }
                        return current;
                    }
                    stored.backgroundColor = ResourceHandler.addColor(stored.backgroundColor);
                    const backgroundImage = [];
                    const backgroundVector = [];
                    const backgroundRepeat = stored.backgroundRepeat.split(',').map(value => value.trim());
                    const backgroundDimensions = [];
                    const backgroundGradient = [];
                    const backgroundPositionX = stored.backgroundPositionX.split(',').map(value => value.trim());
                    const backgroundPositionY = stored.backgroundPositionY.split(',').map(value => value.trim());
                    const backgroundPosition = [];
                    if (Array.isArray(stored.backgroundImage)) {
                        if (!node.hasBit('excludeResource', $enum$2.NODE_RESOURCE.IMAGE_SOURCE)) {
                            backgroundImage.push(...stored.backgroundImage);
                            for (let i = 0; i < backgroundImage.length; i++) {
                                if (backgroundImage[i] && backgroundImage[i] !== 'none') {
                                    backgroundDimensions.push(this.imageAssets.get($dom$2.cssResolveUrl(backgroundImage[i])));
                                    backgroundImage[i] = ResourceHandler.addImageURL(backgroundImage[i]);
                                    const postionX = backgroundPositionX[i] || backgroundPositionX[i - 1];
                                    const postionY = backgroundPositionY[i] || backgroundPositionY[i - 1];
                                    const x = checkPartialBackgroundPosition(postionX, postionY, 'left');
                                    const y = checkPartialBackgroundPosition(postionY, postionX, 'top');
                                    backgroundPosition[i] = `${x === 'initial' ? '0px' : x} ${y === 'initial' ? '0px' : y}`;
                                }
                                else {
                                    backgroundImage[i] = '';
                                    backgroundRepeat[i] = '';
                                    backgroundPosition[i] = '';
                                }
                            }
                        }
                    }
                    else if (stored.backgroundGradient) {
                        backgroundGradient.push(...this.buildBackgroundGradient(node, stored.backgroundGradient));
                    }
                    const companion = node.companion;
                    if (companion && companion.htmlElement && !companion.visible && !$dom$2.cssFromParent(companion.element, 'backgroundColor')) {
                        const boxStyle = $dom$2.getElementCache(companion.element, 'boxStyle');
                        const backgroundColor = ResourceHandler.addColor(boxStyle.backgroundColor);
                        if (backgroundColor !== '') {
                            stored.backgroundColor = backgroundColor;
                        }
                    }
                    const hasBorder = ($Resource.isBorderVisible(stored.borderTop) ||
                        $Resource.isBorderVisible(stored.borderRight) ||
                        $Resource.isBorderVisible(stored.borderBottom) ||
                        $Resource.isBorderVisible(stored.borderLeft) ||
                        stored.borderRadius);
                    const hasBackgroundImage = backgroundImage.filter(value => value !== '').length > 0;
                    if (hasBorder || hasBackgroundImage || backgroundGradient.length > 0) {
                        function getShapeAttribute(boxStyle, name, direction = -1, hasInset = false, isInset = false) {
                            switch (name) {
                                case 'stroke':
                                    if (boxStyle.border && $Resource.isBorderVisible(boxStyle.border)) {
                                        if (!hasInset || isInset) {
                                            return [{
                                                    width: boxStyle.border.width,
                                                    borderStyle: getBorderStyle(boxStyle.border, isInset ? direction : -1)
                                                }];
                                        }
                                        else if (hasInset) {
                                            return [{
                                                    width: $util$2.formatPX(Math.ceil(parseInt(boxStyle.border.width) / 2)),
                                                    borderStyle: getBorderStyle(boxStyle.border, direction, true)
                                                }];
                                        }
                                    }
                                    return false;
                                case 'backgroundColor':
                                    return $util$2.isString(boxStyle.backgroundColor) ? [{ color: boxStyle.backgroundColor }] : false;
                                case 'radius':
                                    if (boxStyle.borderRadius) {
                                        if (boxStyle.borderRadius.length === 1) {
                                            if (boxStyle.borderRadius[0] !== '0px') {
                                                return [{ radius: boxStyle.borderRadius[0] }];
                                            }
                                        }
                                        else if (boxStyle.borderRadius.length > 1) {
                                            const result = {};
                                            boxStyle.borderRadius.forEach((value, index) => result[`${['topLeft', 'topRight', 'bottomRight', 'bottomLeft'][index]}Radius`] = value);
                                            return [result];
                                        }
                                    }
                                    return false;
                            }
                            return false;
                        }
                        const borders = [
                            stored.borderTop,
                            stored.borderRight,
                            stored.borderBottom,
                            stored.borderLeft
                        ];
                        const borderVisible = [];
                        borders.forEach(item => {
                            if ($Resource.isBorderVisible(item)) {
                                item.color = ResourceHandler.addColor(item.color);
                                borderVisible.push(item);
                            }
                        });
                        const images5 = [];
                        const images6 = [];
                        let data;
                        let resourceName = '';
                        for (let i = 0; i < backgroundImage.length; i++) {
                            if (backgroundImage[i] !== '') {
                                const boxPosition = $dom$2.getBackgroundPosition(backgroundPosition[i], node.bounds, node.css('fontSize'));
                                const image = backgroundDimensions[i];
                                let gravity = (() => {
                                    if (boxPosition.horizontal === 'center' && boxPosition.vertical === 'center') {
                                        return 'center';
                                    }
                                    return `${boxPosition.horizontal === 'center' ? 'center_horizontal' : boxPosition.horizontal}|${boxPosition.vertical === 'center' ? 'center_vertical' : boxPosition.vertical}`;
                                })();
                                let tileMode = '';
                                let tileModeX = '';
                                let tileModeY = '';
                                const imageRepeat = !image || image.width < node.bounds.width || image.height < node.bounds.height;
                                switch (backgroundRepeat[i]) {
                                    case 'repeat-x':
                                        if (imageRepeat) {
                                            tileModeX = 'repeat';
                                        }
                                        break;
                                    case 'repeat-y':
                                        if (imageRepeat) {
                                            tileModeY = 'repeat';
                                        }
                                        break;
                                    case 'no-repeat':
                                        tileMode = 'disabled';
                                        break;
                                    case 'repeat':
                                        if (imageRepeat) {
                                            tileMode = 'repeat';
                                        }
                                        break;
                                }
                                if (gravity !== '' && image && image.width > 0 && image.height > 0 && node.renderChildren.length === 0) {
                                    if (tileModeY === 'repeat') {
                                        let backgroundWidth = node.viewWidth;
                                        if (backgroundWidth > 0) {
                                            if (this.settings.autoSizePaddingAndBorderWidth && !node.hasBit('excludeResource', $enum$2.NODE_RESOURCE.BOX_SPACING)) {
                                                backgroundWidth = node.viewWidth + node.paddingLeft + node.paddingRight;
                                            }
                                        }
                                        else {
                                            backgroundWidth = node.bounds.width - (node.borderLeftWidth + node.borderRightWidth);
                                        }
                                        if (image.width < backgroundWidth) {
                                            const layoutWidth = $util$2.convertInt(node.android('layout_width'));
                                            if (gravity.indexOf('left') !== -1) {
                                                boxPosition.right = backgroundWidth - image.width;
                                                if (node.viewWidth === 0 && backgroundWidth > layoutWidth) {
                                                    node.android('layout_width', $util$2.formatPX(node.bounds.width));
                                                }
                                            }
                                            else if (gravity.indexOf('right') !== -1) {
                                                boxPosition.left = backgroundWidth - image.width;
                                                if (node.viewWidth === 0 && backgroundWidth > layoutWidth) {
                                                    node.android('layout_width', $util$2.formatPX(node.bounds.width));
                                                }
                                            }
                                            else if (gravity === 'center' || gravity.indexOf('center_horizontal') !== -1) {
                                                boxPosition.right = Math.floor((backgroundWidth - image.width) / 2);
                                                if (node.viewWidth === 0 && backgroundWidth > layoutWidth) {
                                                    node.android('layout_width', $util$2.formatPX(node.bounds.width));
                                                }
                                            }
                                        }
                                    }
                                    if (tileModeX === 'repeat') {
                                        let backgroundHeight = node.viewHeight;
                                        if (backgroundHeight > 0) {
                                            if (this.settings.autoSizePaddingAndBorderWidth && !node.hasBit('excludeResource', $enum$2.NODE_RESOURCE.BOX_SPACING)) {
                                                backgroundHeight = node.viewHeight + node.paddingTop + node.paddingBottom;
                                            }
                                        }
                                        else {
                                            backgroundHeight = node.bounds.height - (node.borderTopWidth + node.borderBottomWidth);
                                        }
                                        if (image.height < backgroundHeight) {
                                            const layoutHeight = $util$2.convertInt(node.android('layout_height'));
                                            if (gravity.indexOf('top') !== -1) {
                                                boxPosition.bottom = backgroundHeight - image.height;
                                                if (node.viewHeight === 0 && backgroundHeight > layoutHeight) {
                                                    node.android('layout_height', $util$2.formatPX(node.bounds.height));
                                                }
                                            }
                                            else if (gravity.indexOf('bottom') !== -1) {
                                                boxPosition.top = backgroundHeight - image.height;
                                                if (node.viewHeight === 0 && backgroundHeight > layoutHeight) {
                                                    node.android('layout_height', $util$2.formatPX(node.bounds.height));
                                                }
                                            }
                                            else if (gravity === 'center' || gravity.indexOf('center_vertical') !== -1) {
                                                boxPosition.bottom = Math.floor((backgroundHeight - image.height) / 2);
                                                if (node.viewHeight === 0 && backgroundHeight > layoutHeight) {
                                                    node.android('layout_height', $util$2.formatPX(node.bounds.height));
                                                }
                                            }
                                        }
                                    }
                                }
                                if (stored.backgroundSize.length > 0 && ($util$2.isPercent(stored.backgroundSize[0]) || $util$2.isPercent(stored.backgroundSize[1]))) {
                                    if (stored.backgroundSize[0] === '100%' && stored.backgroundSize[1] === '100%') {
                                        tileMode = '';
                                        tileModeX = '';
                                        tileModeY = '';
                                        gravity = '';
                                    }
                                    else if (stored.backgroundSize[0] === '100%') {
                                        tileModeX = '';
                                    }
                                    else if (stored.backgroundSize[1] === '100%') {
                                        tileModeY = '';
                                    }
                                    stored.backgroundSize = [];
                                }
                                if (hasBackgroundImage) {
                                    if (node.of($enum$2.NODE_STANDARD.IMAGE, $enum$2.NODE_ALIGNMENT.SINGLE) && backgroundPosition.length === 1) {
                                        node.android('src', `@drawable/${backgroundImage[0]}`);
                                        if (boxPosition.left > 0) {
                                            node.modifyBox($enum$2.BOX_STANDARD.MARGIN_LEFT, boxPosition.left);
                                        }
                                        if (boxPosition.top > 0) {
                                            node.modifyBox($enum$2.BOX_STANDARD.MARGIN_TOP, boxPosition.top);
                                        }
                                        let scaleType = '';
                                        switch (gravity) {
                                            case 'left|top':
                                            case 'left|center_vertical':
                                            case 'left|bottom':
                                                scaleType = 'fitStart';
                                                break;
                                            case 'right|top':
                                            case 'right|center_vertical':
                                            case 'right|bottom':
                                                scaleType = 'fitEnd';
                                                break;
                                            case 'center':
                                            case 'center_horizontal|top':
                                            case 'center_horizontal|bottom':
                                                scaleType = 'center';
                                                break;
                                        }
                                        node.android('scaleType', scaleType);
                                        if (!hasBorder) {
                                            return;
                                        }
                                        backgroundImage.length = 0;
                                    }
                                    else {
                                        if (gravity === 'left|top') {
                                            gravity = '';
                                        }
                                        const imageXml = {
                                            top: boxPosition.top !== 0 ? $util$2.formatPX(boxPosition.top) : '',
                                            right: boxPosition.right !== 0 ? $util$2.formatPX(boxPosition.right) : '',
                                            bottom: boxPosition.bottom !== 0 ? $util$2.formatPX(boxPosition.bottom) : '',
                                            left: boxPosition.left !== 0 ? $util$2.formatPX(boxPosition.left) : '',
                                            gravity,
                                            tileMode,
                                            tileModeX,
                                            tileModeY,
                                            width: '',
                                            height: '',
                                            src: backgroundImage[i]
                                        };
                                        if (gravity !== '' || tileMode !== '' || tileModeX !== '' || tileModeY !== '') {
                                            images6.push(imageXml);
                                        }
                                        else {
                                            if (stored.backgroundSize.length > 0) {
                                                imageXml.width = stored.backgroundSize[0];
                                                imageXml.height = stored.backgroundSize[1];
                                            }
                                            images5.push(imageXml);
                                        }
                                    }
                                }
                            }
                        }
                        images6.sort((a, b) => {
                            if (!(a.tileModeX === 'repeat' || a.tileModeY === 'repeat' || a.tileMode === 'repeat')) {
                                return 1;
                            }
                            else if (!(b.tileModeX === 'repeat' || b.tileModeY === 'repeat' || b.tileMode === 'repeat')) {
                                return -1;
                            }
                            else {
                                if (a.tileMode === 'repeat') {
                                    return -1;
                                }
                                else if (b.tileMode === 'repeat') {
                                    return 1;
                                }
                                else {
                                    return b.tileModeX === 'repeat' || b.tileModeY === 'repeat' ? 1 : -1;
                                }
                            }
                        });
                        const backgroundColor = getShapeAttribute(stored, 'backgroundColor');
                        const borderRadius = getShapeAttribute(stored, 'radius');
                        const vectorGradient = backgroundGradient.length > 0 && backgroundGradient.some(gradient => gradient.colorStop.length > 0);
                        if (vectorGradient) {
                            const width = node.bounds.width;
                            const height = node.bounds.height;
                            const xml = $xml$2.createTemplate($xml$2.parseTemplate(VECTOR_TMPL), {
                                namespace: getXmlNs('aapt'),
                                width: $util$2.formatPX(width),
                                height: $util$2.formatPX(height),
                                viewportWidth: width.toString(),
                                viewportHeight: height.toString(),
                                alpha: '',
                                '1': [{
                                        '2': [{
                                                clipPaths: false,
                                                d: `'M0,0 L${width},0 L${width},${height} L0,${height} Z`,
                                                fill: [{ 'gradients': backgroundGradient }]
                                            }]
                                    }]
                            });
                            let vector = getStoredDrawable(xml);
                            if (vector === '') {
                                vector = `${node.nodeName.toLowerCase()}_${node.nodeId}_gradient`;
                                $Resource.STORED.drawables.set(vector, xml);
                            }
                            backgroundVector.push({ vector });
                        }
                        let template;
                        if (stored.border && !((parseInt(stored.border.width) > 2 && stored.border.style === 'double') ||
                            (parseInt(stored.border.width) > 1 && (stored.border.style === 'groove' || stored.border.style === 'ridge')))) {
                            if (!hasBackgroundImage && backgroundGradient.length <= 1 && !vectorGradient) {
                                if (borderRadius && borderRadius[0]['radius'] === undefined) {
                                    borderRadius[0]['radius'] = '1px';
                                }
                                template = $xml$2.parseTemplate(SHAPE_TMPL);
                                data = {
                                    '1': getShapeAttribute(stored, 'stroke'),
                                    '2': backgroundColor,
                                    '3': borderRadius,
                                    '4': backgroundGradient.length > 0 ? backgroundGradient : false
                                };
                            }
                            else {
                                template = $xml$2.parseTemplate(LAYERLIST_TMPL);
                                data = {
                                    '1': backgroundColor,
                                    '2': !vectorGradient && backgroundGradient.length > 0 ? backgroundGradient : false,
                                    '3': backgroundVector,
                                    '4': false,
                                    '5': images5.length > 0 ? images5 : false,
                                    '6': images6.length > 0 ? images6 : false,
                                    '7': $Resource.isBorderVisible(stored.border) || borderRadius ? [{ 'stroke': getShapeAttribute(stored, 'stroke'), 'corners': borderRadius }] : false
                                };
                            }
                        }
                        else {
                            function getHideWidth(value) {
                                return value + (value === 1 ? 1 : 2);
                            }
                            template = $xml$2.parseTemplate(LAYERLIST_TMPL);
                            data = {
                                '1': backgroundColor,
                                '2': !vectorGradient && backgroundGradient.length > 0 ? backgroundGradient : false,
                                '3': backgroundVector,
                                '4': false,
                                '5': images5.length > 0 ? images5 : false,
                                '6': images6.length > 0 ? images6 : false,
                                '7': []
                            };
                            const borderWidth = new Set(borderVisible.map(item => item.width));
                            const borderStyle = new Set(borderVisible.map(item => getBorderStyle(item)));
                            const borderData = borderVisible[0];
                            function insertDoubleBorder(border, top, right, bottom, left) {
                                const width = parseInt(border.width);
                                const baseWidth = Math.floor(width / 3);
                                const remainder = width % 3;
                                const offset = remainder === 2 ? 1 : 0;
                                const leftWidth = baseWidth + offset;
                                const rightWidth = baseWidth + offset;
                                let indentWidth = `${$util$2.formatPX(width - baseWidth)}`;
                                let hideWidth = `-${indentWidth}`;
                                data['7'].push({
                                    top: top ? '' : hideWidth,
                                    right: right ? '' : hideWidth,
                                    bottom: bottom ? '' : hideWidth,
                                    left: left ? '' : hideWidth,
                                    'stroke': [{ width: $util$2.formatPX(leftWidth), borderStyle: getBorderStyle(border) }],
                                    'corners': borderRadius
                                });
                                if (width === 3) {
                                    indentWidth = `${$util$2.formatPX(width)}`;
                                    hideWidth = `-${indentWidth}`;
                                }
                                data['7'].push({
                                    top: top ? indentWidth : hideWidth,
                                    right: right ? indentWidth : hideWidth,
                                    bottom: bottom ? indentWidth : hideWidth,
                                    left: left ? indentWidth : hideWidth,
                                    'stroke': [{ width: $util$2.formatPX(rightWidth), borderStyle: getBorderStyle(border) }],
                                    'corners': borderRadius
                                });
                            }
                            if (borderWidth.size === 1 && borderStyle.size === 1 && !(borderData.style === 'groove' || borderData.style === 'ridge')) {
                                const width = parseInt(borderData.width);
                                if (width > 2 && borderData.style === 'double') {
                                    insertDoubleBorder.apply(null, [
                                        borderData,
                                        $Resource.isBorderVisible(stored.borderTop),
                                        $Resource.isBorderVisible(stored.borderRight),
                                        $Resource.isBorderVisible(stored.borderBottom),
                                        $Resource.isBorderVisible(stored.borderLeft)
                                    ]);
                                }
                                else {
                                    const hideWidth = `-${$util$2.formatPX(getHideWidth(width))}`;
                                    data['7'].push({
                                        top: $Resource.isBorderVisible(stored.borderTop) ? '' : hideWidth,
                                        right: $Resource.isBorderVisible(stored.borderRight) ? '' : hideWidth,
                                        bottom: $Resource.isBorderVisible(stored.borderBottom) ? '' : hideWidth,
                                        left: $Resource.isBorderVisible(stored.borderLeft) ? '' : hideWidth,
                                        'stroke': getShapeAttribute({ border: borderVisible[0] }, 'stroke'),
                                        'corners': borderRadius
                                    });
                                }
                            }
                            else {
                                for (let i = 0; i < borders.length; i++) {
                                    const border = borders[i];
                                    if ($Resource.isBorderVisible(border)) {
                                        const width = parseInt(border.width);
                                        if (width > 2 && border.style === 'double') {
                                            insertDoubleBorder.apply(null, [
                                                border,
                                                i === 0,
                                                i === 1,
                                                i === 2,
                                                i === 3
                                            ]);
                                        }
                                        else {
                                            const hasInset = width > 1 && (border.style === 'groove' || border.style === 'ridge');
                                            const outsetWidth = hasInset ? Math.ceil(width / 2) : width;
                                            let hideWidth = `-${$util$2.formatPX(getHideWidth(outsetWidth))}`;
                                            data['7'].push({
                                                top: i === 0 ? '' : hideWidth,
                                                right: i === 1 ? '' : hideWidth,
                                                bottom: i === 2 ? '' : hideWidth,
                                                left: i === 3 ? '' : hideWidth,
                                                'stroke': getShapeAttribute({ border }, 'stroke', i, hasInset),
                                                'corners': borderRadius
                                            });
                                            if (hasInset) {
                                                hideWidth = `-${$util$2.formatPX(getHideWidth(width))}`;
                                                data['7'].unshift({
                                                    top: i === 0 ? '' : hideWidth,
                                                    right: i === 1 ? '' : hideWidth,
                                                    bottom: i === 2 ? '' : hideWidth,
                                                    left: i === 3 ? '' : hideWidth,
                                                    'stroke': getShapeAttribute({ border }, 'stroke', i, true, true),
                                                    'corners': false
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (template) {
                            const xml = $xml$2.createTemplate(template, data);
                            resourceName = getStoredDrawable(xml);
                            if (resourceName === '') {
                                resourceName = `${node.nodeName.toLowerCase()}_${node.nodeId}`;
                                $Resource.STORED.drawables.set(resourceName, xml);
                            }
                        }
                        node.android('background', `@drawable/${resourceName}`, node.renderExtension.size === 0);
                        if (hasBackgroundImage) {
                            node.data('RESOURCE', 'backgroundImage', true);
                            if (this.settings.autoSizeBackgroundImage &&
                                !node.documentRoot &&
                                !node.imageElement &&
                                !node.svgElement &&
                                node.renderParent.tagName !== 'TABLE' &&
                                !node.hasBit('excludeProcedure', $enum$2.NODE_PROCEDURE.AUTOFIT)) {
                                const sizeParent = { width: 0, height: 0 };
                                backgroundDimensions.forEach(item => {
                                    if (item) {
                                        sizeParent.width = Math.max(sizeParent.width, item.width);
                                        sizeParent.height = Math.max(sizeParent.height, item.height);
                                    }
                                });
                                if (sizeParent.width === 0) {
                                    let current = node;
                                    while (current && !current.documentBody) {
                                        if (current.hasWidth) {
                                            sizeParent.width = current.bounds.width;
                                        }
                                        if (current.hasHeight) {
                                            sizeParent.height = current.bounds.height;
                                        }
                                        if (!current.pageflow || (sizeParent.width > 0 && sizeParent.height > 0)) {
                                            break;
                                        }
                                        current = current.documentParent;
                                    }
                                }
                                if (!node.has('width', $enum$2.CSS_STANDARD.UNIT)) {
                                    const width = node.bounds.width + (!node.is($enum$2.NODE_STANDARD.LINE) ? node.borderLeftWidth + node.borderRightWidth : 0);
                                    if (sizeParent.width === 0 || (width > 0 && width < sizeParent.width)) {
                                        node.css('width', $util$2.formatPX(width));
                                    }
                                }
                                if (!node.has('height', $enum$2.CSS_STANDARD.UNIT)) {
                                    const height = node.actualHeight + (!node.is($enum$2.NODE_STANDARD.LINE) ? node.borderTopWidth + node.borderBottomWidth : 0);
                                    if (sizeParent.height === 0 || (height > 0 && height < sizeParent.height)) {
                                        node.css('height', $util$2.formatPX(height));
                                        if (node.marginTop < 0) {
                                            node.modifyBox($enum$2.BOX_STANDARD.MARGIN_TOP, null);
                                        }
                                        if (node.marginBottom < 0) {
                                            node.modifyBox($enum$2.BOX_STANDARD.MARGIN_BOTTOM, null);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (!$dom$2.getElementCache(node.element, 'fontStyle') && $util$2.isString(stored.backgroundColor)) {
                        node.formatted($util$2.formatString(FONT_STYLE.backgroundColor, stored.backgroundColor), node.renderExtension.size === 0);
                    }
                }
            });
        }
        setFontStyle() {
            super.setFontStyle();
            const nodeName = {};
            for (const node of this.cache.visible) {
                if (!node.hasBit('excludeResource', $enum$2.NODE_RESOURCE.FONT_STYLE)) {
                    if ($dom$2.getElementCache(node.element, 'fontStyle')) {
                        if (nodeName[node.nodeName] === undefined) {
                            nodeName[node.nodeName] = [];
                        }
                        nodeName[node.nodeName].push(node);
                    }
                    const textShadow = node.css('textShadow');
                    if (textShadow !== 'none') {
                        [/^(rgba?\(\d+, \d+, \d+(?:, [\d.]+)?\)) ([\d.]+[a-z]+) ([\d.]+[a-z]+) ([\d.]+[a-z]+)$/, /^([\d.]+[a-z]+) ([\d.]+[a-z]+) ([\d.]+[a-z]+) (.+)$/].some((value, index) => {
                            const match = textShadow.match(value);
                            if (match) {
                                const color = $color.parseRGBA(match[index === 0 ? 1 : 4]);
                                if (color) {
                                    const colorValue = ResourceHandler.addColor(color);
                                    if (colorValue !== '') {
                                        node.android('shadowColor', `@color/${colorValue}`);
                                    }
                                }
                                node.android('shadowDx', $util$2.convertInt(match[index === 0 ? 2 : 1]).toString());
                                node.android('shadowDy', $util$2.convertInt(match[index === 0 ? 3 : 2]).toString());
                                node.android('shadowRadius', $util$2.convertInt(match[index === 0 ? 4 : 3]).toString());
                                return true;
                            }
                            return false;
                        });
                    }
                }
            }
            for (const tag in nodeName) {
                const sorted = [];
                let visible = 0;
                nodeName[tag].forEach(node => {
                    if (node.visible) {
                        visible++;
                    }
                    const nodeId = node.id;
                    const companion = node.companion;
                    if (companion && !companion.visible && companion.tagName === 'LABEL') {
                        node = companion;
                    }
                    const element = node.element;
                    const stored = Object.assign({}, $dom$2.getElementCache(element, 'fontStyle'));
                    let system = false;
                    stored.backgroundColor = ResourceHandler.addColor(stored.backgroundColor);
                    if (stored.fontFamily) {
                        let fontFamily = stored.fontFamily.split(',')[0]
                            .replace(/"/g, '')
                            .toLowerCase()
                            .trim();
                        let fontStyle = '';
                        let fontWeight = '';
                        stored.color = ResourceHandler.addColor(stored.color);
                        if (this.settings.fontAliasResourceValue && FONTREPLACE_ANDROID[fontFamily]) {
                            fontFamily = FONTREPLACE_ANDROID[fontFamily];
                        }
                        if ((FONT_ANDROID[fontFamily] && node.localSettings.targetAPI >= FONT_ANDROID[fontFamily]) ||
                            (this.settings.fontAliasResourceValue && FONTALIAS_ANDROID[fontFamily] && node.localSettings.targetAPI >= FONT_ANDROID[FONTALIAS_ANDROID[fontFamily]])) {
                            system = true;
                            stored.fontFamily = fontFamily;
                            if (stored.fontStyle === 'normal') {
                                delete stored.fontStyle;
                            }
                            if (stored.fontWeight === '400') {
                                delete stored.fontWeight;
                            }
                        }
                        else {
                            fontFamily = $util$2.convertWord(fontFamily);
                            stored.fontFamily = `@font/${fontFamily + (stored.fontStyle !== 'normal' ? `_${stored.fontStyle}` : '') + (stored.fontWeight !== '400' ? `_${FONTWEIGHT_ANDROID[stored.fontWeight] || stored.fontWeight}` : '')}`;
                            fontStyle = stored.fontStyle;
                            fontWeight = stored.fontWeight;
                            delete stored.fontStyle;
                            delete stored.fontWeight;
                        }
                        if (!system) {
                            const fonts = $Resource.STORED.fonts.get(fontFamily) || {};
                            fonts[`${fontStyle}-${fontWeight}`] = true;
                            $Resource.STORED.fonts.set(fontFamily, fonts);
                        }
                    }
                    const keys = Object.keys(FONT_STYLE);
                    for (let i = 0; i < keys.length; i++) {
                        if (sorted[i] === undefined) {
                            sorted[i] = {};
                        }
                        const value = stored[keys[i]];
                        if ($util$2.hasValue(value)) {
                            if (node.supported('android', keys[i])) {
                                const attr = $util$2.formatString(FONT_STYLE[keys[i]], value);
                                if (sorted[i][attr] === undefined) {
                                    sorted[i][attr] = [];
                                }
                                sorted[i][attr].push(nodeId);
                            }
                        }
                    }
                });
                const tagStyle = this._tagStyle[tag];
                if (tagStyle) {
                    for (let i = 0; i < tagStyle.length; i++) {
                        for (const attr in tagStyle[i]) {
                            if (sorted[i][attr]) {
                                sorted[i][attr].push(...tagStyle[i][attr]);
                            }
                            else {
                                sorted[i][attr] = tagStyle[i][attr];
                            }
                        }
                    }
                    this._tagCount[tag] += visible;
                }
                else {
                    this._tagCount[tag] = visible;
                }
                this._tagStyle[tag] = sorted;
            }
        }
        setBoxSpacing() {
            super.setBoxSpacing();
            for (const node of this.cache.elements) {
                const stored = $dom$2.getElementCache(node.element, 'boxSpacing');
                if (stored && !node.hasBit('excludeResource', $enum$2.NODE_RESOURCE.BOX_SPACING)) {
                    if (stored.marginLeft === stored.marginRight &&
                        !node.blockWidth &&
                        node.alignParent('left') &&
                        node.alignParent('right') &&
                        !(node.position === 'relative' && node.alignNegative)) {
                        node.modifyBox($enum$2.BOX_STANDARD.MARGIN_LEFT, null);
                        node.modifyBox($enum$2.BOX_STANDARD.MARGIN_RIGHT, null);
                    }
                    if (node.css('marginLeft') === 'auto') {
                        node.modifyBox($enum$2.BOX_STANDARD.MARGIN_LEFT, null);
                    }
                    if (node.css('marginRight') === 'auto') {
                        node.modifyBox($enum$2.BOX_STANDARD.MARGIN_RIGHT, null);
                    }
                }
            }
        }
        setValueString() {
            super.setValueString();
            for (const node of this.cache.visible) {
                const stored = $dom$2.getElementCache(node.element, 'valueString');
                if (stored) {
                    if (node.renderParent.is($enum$2.NODE_STANDARD.RELATIVE)) {
                        if (node.alignParent('left') && !$dom$2.cssParent(node.element, 'whiteSpace', 'pre', 'pre-wrap')) {
                            const value = node.textContent;
                            let leadingSpace = 0;
                            for (let i = 0; i < value.length; i++) {
                                switch (value.charCodeAt(i)) {
                                    case 32:
                                        continue;
                                    case 160:
                                        leadingSpace++;
                                        continue;
                                }
                                break;
                            }
                            if (leadingSpace === 0) {
                                stored.value = stored.value.replace(/^(\s|&#160;)+/, '');
                            }
                        }
                    }
                    if (node.htmlElement) {
                        switch (node.css('fontVariant')) {
                            case 'small-caps':
                                stored.value = stored.value.toUpperCase();
                                break;
                        }
                        const match = node.css('textDecoration').match(/(underline|line-through)/);
                        if (match) {
                            switch (match[0]) {
                                case 'underline':
                                    stored.value = `<u>${$xml$2.replaceCharacter(stored.value)}</u>`;
                                    break;
                                case 'line-through':
                                    stored.value = `<strike>${$xml$2.replaceCharacter(stored.value)}</strike>`;
                                    break;
                            }
                        }
                        else {
                            stored.value = $xml$2.replaceCharacter(stored.value);
                        }
                    }
                    else {
                        stored.value = $xml$2.replaceCharacter(stored.value);
                    }
                    const name = ResourceHandler.addString(stored.value, stored.name, this.settings);
                    if (name !== '' && node.toInt('textIndent') + node.bounds.width > 0) {
                        node.android('text', isNaN(parseInt(name)) || parseInt(name).toString() !== name ? `@string/${name}` : name, node.renderExtension.size === 0);
                    }
                }
            }
        }
        setOptionArray() {
            super.setOptionArray();
            for (const node of this.cache.visible) {
                const stored = $dom$2.getElementCache(node.element, 'optionArray');
                if (stored) {
                    const result = [];
                    if (stored.numberArray) {
                        if (!this.settings.numberResourceValue) {
                            result.push(...stored.numberArray);
                        }
                        else {
                            stored.stringArray = stored.numberArray;
                        }
                    }
                    if (stored.stringArray) {
                        result.push(...stored.stringArray.map(value => {
                            const name = ResourceHandler.addString($xml$2.replaceCharacter(value), '', this.settings);
                            return name !== '' ? `@string/${name}` : '';
                        })
                            .filter(name => name));
                    }
                    if (result.length > 0) {
                        const arrayValue = result.join('-');
                        let arrayName = '';
                        for (const [storedName, storedResult] of $Resource.STORED.arrays.entries()) {
                            if (arrayValue === storedResult.join('-')) {
                                arrayName = storedName;
                                break;
                            }
                        }
                        if (arrayName === '') {
                            arrayName = `${node.nodeId}_array`;
                            $Resource.STORED.arrays.set(arrayName, result);
                        }
                        node.android('entries', `@array/${arrayName}`, node.renderExtension.size === 0);
                    }
                }
            }
        }
        setImageSource() {
            function setPivotXY(data, origin) {
                if (origin) {
                    if (origin.left !== 0) {
                        data.pivotX = $util$2.isPercent(origin.originalX) ? origin.originalX : origin.left.toString();
                    }
                    if (origin.top !== 0) {
                        data.pivotY = $util$2.isPercent(origin.originalY) ? origin.originalY : origin.top.toString();
                    }
                }
            }
            super.setImageSource();
            for (const node of this.cache.visible) {
                let result = '';
                if (node.svgElement) {
                    const stored = $dom$2.getElementCache(node.element, 'imageSource');
                    if (stored) {
                        let vectorName = '';
                        if (stored.length > 0) {
                            const namespace = new Set();
                            const groups = [];
                            for (const group of stored) {
                                const data = {
                                    name: group.name,
                                    '2': []
                                };
                                if (group.element !== node.element) {
                                    const transform = group.transform;
                                    const x = (group.x || 0) + (transform ? transform.translateX : 0);
                                    const y = (group.y || 0) + (transform ? transform.translateY : 0);
                                    if (x !== 0) {
                                        data.translateX = x.toString();
                                    }
                                    if (y !== 0) {
                                        data.translateY = y.toString();
                                    }
                                    if (transform) {
                                        if (transform.scaleX !== 1) {
                                            data.scaleX = transform.scaleX.toString();
                                        }
                                        if (transform.scaleY !== 1) {
                                            data.scaleY = transform.scaleY.toString();
                                        }
                                        if (transform.rotateAngle !== 0) {
                                            data.rotation = transform.rotateAngle.toString();
                                            if (transform.rotateX !== 0 || transform.rotateY !== 0) {
                                                data.pivotX = transform.rotateX.toString();
                                                data.pivotY = transform.rotateX.toString();
                                            }
                                        }
                                        setPivotXY(data, transform.origin);
                                    }
                                }
                                for (const item of group) {
                                    if (item.visibility) {
                                        const clipPaths = [];
                                        if (item.clipPath !== '') {
                                            const clipPath = stored.defs.clipPath.get(item.clipPath);
                                            if (clipPath) {
                                                clipPath.forEach(path => clipPaths.push({ name: path.name, d: path.d }));
                                            }
                                        }
                                        ['fill', 'stroke'].forEach(value => {
                                            if ($util$2.isString(item[value])) {
                                                if (item[value].charAt(0) === '@') {
                                                    const gradient = stored.defs.gradient.get(item[value]);
                                                    if (gradient) {
                                                        item[value] = [{ gradients: this.buildBackgroundGradient(node, [gradient]) }];
                                                        namespace.add('aapt');
                                                        return;
                                                    }
                                                    else {
                                                        item[value] = item.color;
                                                    }
                                                }
                                                if (this.settings.vectorColorResourceValue) {
                                                    const colorValue = ResourceHandler.addColor(item[value]);
                                                    if (colorValue !== '') {
                                                        item[value] = `@color/${colorValue}`;
                                                    }
                                                }
                                            }
                                        });
                                        if (item.fillRule) {
                                            switch (item.fillRule) {
                                                case 'evenodd':
                                                    item.fillRule = 'evenOdd';
                                                    break;
                                                default:
                                                    item.fillRule = 'nonZero';
                                                    break;
                                            }
                                        }
                                        data['2'].push(Object.assign({}, item, { clipPaths }));
                                    }
                                }
                                if (data['2'].length) {
                                    groups.push(data);
                                }
                            }
                            const xml = $xml$2.createTemplate($xml$2.parseTemplate(VECTOR_TMPL), {
                                namespace: namespace.size > 0 ? getXmlNs(...Array.from(namespace)) : '',
                                width: $util$2.formatPX(stored.width),
                                height: $util$2.formatPX(stored.height),
                                viewportWidth: stored.viewBoxWidth > 0 ? stored.viewBoxWidth.toString() : false,
                                viewportHeight: stored.viewBoxHeight > 0 ? stored.viewBoxHeight.toString() : false,
                                alpha: stored.opacity < 1 ? stored.opacity : false,
                                '1': groups
                            });
                            vectorName = getStoredDrawable(xml);
                            if (vectorName === '') {
                                vectorName = `${node.nodeName.toLowerCase()}_${node.nodeId + (stored.defs.image.length > 0 ? '_vector' : '')}`;
                                $Resource.STORED.drawables.set(vectorName, xml);
                            }
                        }
                        if (stored.defs.image.length > 0) {
                            const images = [];
                            const rotate = [];
                            for (const item of stored.defs.image) {
                                if (item.uri) {
                                    const transform = item.transform;
                                    const scaleX = stored.width / stored.viewBoxWidth;
                                    const scaleY = stored.height / stored.viewBoxHeight;
                                    if (transform) {
                                        if (item.width) {
                                            item.width *= scaleX * transform.scaleX;
                                        }
                                        if (item.height) {
                                            item.height *= scaleY * transform.scaleY;
                                        }
                                    }
                                    let x = (item.x || 0) * scaleX;
                                    let y = (item.y || 0) * scaleY;
                                    let parent = item.element && item.element.parentElement;
                                    while (parent instanceof SVGSVGElement && parent !== node.element) {
                                        const attributes = $Resource.getSvgTransform(parent);
                                        x += parent.x.baseVal.value + attributes.translateX;
                                        y += parent.y.baseVal.value + attributes.translateY;
                                        parent = parent.parentElement;
                                    }
                                    const data = {
                                        width: item.width ? $util$2.formatPX(item.width) : '',
                                        height: item.height ? $util$2.formatPX(item.height) : '',
                                        left: x !== 0 ? $util$2.formatPX(x) : '',
                                        top: y !== 0 ? $util$2.formatPX(y) : '',
                                        src: ResourceHandler.addImage({ mdpi: item.uri })
                                    };
                                    if (transform && transform.rotateAngle !== 0) {
                                        data.fromDegrees = transform.rotateAngle.toString();
                                        data.visible = 'true';
                                        setPivotXY(data, transform.origin);
                                        rotate.push(data);
                                    }
                                    else {
                                        images.push(data);
                                    }
                                }
                            }
                            const xml = $xml$2.createTemplate($xml$2.parseTemplate(LAYERLIST_TMPL), {
                                '1': false,
                                '2': false,
                                '3': [{ vector: vectorName }],
                                '4': rotate,
                                '5': images,
                                '6': false,
                                '7': false
                            });
                            result = getStoredDrawable(xml);
                            if (result === '') {
                                result = `${node.nodeName.toLowerCase()}_${node.nodeId}`;
                                $Resource.STORED.drawables.set(result, xml);
                            }
                        }
                        else {
                            result = vectorName;
                        }
                    }
                }
                else {
                    if ((node.imageElement || (node.tagName === 'INPUT' && node.element.type === 'image')) &&
                        !node.hasBit('excludeResource', $enum$2.NODE_RESOURCE.IMAGE_SOURCE)) {
                        const element = node.element;
                        result = node.imageElement ? ResourceHandler.addImageSrcSet(element) : ResourceHandler.addImage({ mdpi: element.src });
                    }
                }
                if (result !== '') {
                    node.android('src', `@drawable/${result}`, node.renderExtension.size === 0);
                    $dom$2.setElementCache(node.element, 'imageSource', result);
                }
            }
        }
        addStyleTheme(template, data, options) {
            if (options.item) {
                const items = { item: options.item };
                ResourceHandler.formatOptions(items, this.settings);
                for (const name in items) {
                    data['1'].push({
                        name,
                        value: items[name]
                    });
                }
            }
            const xml = $xml$2.createTemplate($xml$2.parseTemplate(template), data);
            this.addFile(options.output.path, options.output.file, xml);
        }
        buildBackgroundGradient(node, gradients) {
            const result = [];
            for (const shape of gradients) {
                const hasStop = node.svgElement || shape.colorStop.filter(item => $util$2.convertInt(item.offset) > 0).length > 0;
                const gradient = {
                    type: shape.type,
                    startColor: !hasStop ? ResourceHandler.addColor(shape.colorStop[0].color) : '',
                    centerColor: !hasStop && shape.colorStop.length > 2 ? ResourceHandler.addColor(shape.colorStop[1].color) : '',
                    endColor: !hasStop ? ResourceHandler.addColor(shape.colorStop[shape.colorStop.length - 1].color) : '',
                    colorStop: []
                };
                switch (shape.type) {
                    case 'radial':
                        const radial = shape;
                        if (node.svgElement) {
                            gradient.gradientRadius = radial.r.toString();
                            gradient.centerX = radial.cx.toString();
                            gradient.centerY = radial.cy.toString();
                        }
                        else {
                            let boxPosition;
                            if (radial.shapePosition && radial.shapePosition.length > 1) {
                                boxPosition = $dom$2.getBackgroundPosition(radial.shapePosition[1], node.bounds, node.css('fontSize'), true, !hasStop);
                            }
                            if (hasStop) {
                                gradient.gradientRadius = node.bounds.width.toString();
                                if (boxPosition) {
                                    gradient.centerX = boxPosition.left.toString();
                                    gradient.centerY = boxPosition.top.toString();
                                }
                            }
                            else {
                                gradient.gradientRadius = $util$2.formatPX(node.bounds.width);
                                if (boxPosition) {
                                    gradient.centerX = $util$2.convertPercent(boxPosition.left);
                                    gradient.centerY = $util$2.convertPercent(boxPosition.top);
                                }
                            }
                        }
                        break;
                    case 'linear':
                        const linear = shape;
                        if (hasStop) {
                            gradient.startX = linear.x1.toString();
                            gradient.startY = linear.y1.toString();
                            gradient.endX = linear.x2.toString();
                            gradient.endY = linear.y2.toString();
                        }
                        else {
                            if (linear.angle) {
                                gradient.angle = (Math.floor(linear.angle / 45) * 45).toString();
                            }
                        }
                        break;
                }
                if (hasStop) {
                    for (let i = 0; i < shape.colorStop.length; i++) {
                        const item = shape.colorStop[i];
                        let offset = $util$2.convertInt(item.offset);
                        const color = this.settings.vectorColorResourceValue ? `@color/${ResourceHandler.addColor(item.color)}` : getHexARGB($color.parseRGBA(item.color));
                        if (i === 0) {
                            if (!node.svgElement && offset !== 0) {
                                gradient.colorStop.push({
                                    color,
                                    offset: '0',
                                    opacity: item.opacity
                                });
                            }
                        }
                        else if (offset === 0) {
                            if (i < shape.colorStop.length - 1) {
                                offset = Math.round(($util$2.convertInt(shape.colorStop[i - 1].offset) + $util$2.convertInt(shape.colorStop[i + 1].offset)) / 2);
                            }
                            else {
                                offset = 100;
                            }
                        }
                        gradient.colorStop.push({
                            color,
                            offset: (offset / 100).toFixed(2),
                            opacity: item.opacity
                        });
                    }
                }
                result.push(gradient);
            }
            return result;
        }
        processFontStyle(viewData) {
            function deleteStyleAttribute(sorted, attrs, ids) {
                attrs.split(';').forEach(value => {
                    for (let i = 0; i < sorted.length; i++) {
                        if (sorted[i]) {
                            let index = -1;
                            let key = '';
                            for (const j in sorted[i]) {
                                if (j === value) {
                                    index = i;
                                    key = j;
                                    i = sorted.length;
                                    break;
                                }
                            }
                            if (index !== -1) {
                                sorted[index][key] = sorted[index][key].filter(id => !ids.includes(id));
                                if (sorted[index][key].length === 0) {
                                    delete sorted[index][key];
                                }
                                break;
                            }
                        }
                    }
                });
            }
            const style = {};
            const layout = {};
            for (const tag in this._tagStyle) {
                style[tag] = {};
                layout[tag] = {};
                const count = this._tagCount[tag];
                let sorted = this._tagStyle[tag].filter(item => Object.keys(item).length > 0).sort((a, b) => {
                    let maxA = 0;
                    let maxB = 0;
                    let countA = 0;
                    let countB = 0;
                    for (const attr in a) {
                        maxA = Math.max(a[attr].length, maxA);
                        countA += a[attr].length;
                    }
                    for (const attr in b) {
                        if (b[attr]) {
                            maxB = Math.max(b[attr].length, maxB);
                            countB += b[attr].length;
                        }
                    }
                    if (maxA !== maxB) {
                        return maxA > maxB ? -1 : 1;
                    }
                    else {
                        return countA >= countB ? -1 : 1;
                    }
                });
                do {
                    if (sorted.length === 1) {
                        for (const attr in sorted[0]) {
                            const value = sorted[0][attr];
                            if (value.length === 1) {
                                layout[tag][attr] = value;
                            }
                            else if (value.length > 1) {
                                style[tag][attr] = value;
                            }
                        }
                        sorted.length = 0;
                    }
                    else {
                        const styleKey = {};
                        const layoutKey = {};
                        for (let i = 0; i < sorted.length; i++) {
                            if (!sorted[i]) {
                                continue;
                            }
                            const filtered = {};
                            const combined = {};
                            const deleteKeys = new Set();
                            for (const attr1 in sorted[i]) {
                                const ids = sorted[i][attr1];
                                let revalidate = false;
                                if (!ids || ids.length === 0) {
                                    continue;
                                }
                                else if (ids.length === count) {
                                    styleKey[attr1] = ids.slice();
                                    sorted[i] = {};
                                    revalidate = true;
                                }
                                else if (ids.length === 1) {
                                    layoutKey[attr1] = ids.slice();
                                    sorted[i][attr1] = [];
                                    revalidate = true;
                                }
                                if (!revalidate) {
                                    const found = {};
                                    let merged = false;
                                    for (let j = 0; j < sorted.length; j++) {
                                        if (i !== j && sorted[j]) {
                                            for (const attr in sorted[j]) {
                                                const compare = sorted[j][attr];
                                                if (compare.length > 0) {
                                                    for (const nodeId of ids) {
                                                        if (compare.includes(nodeId)) {
                                                            if (found[attr] === undefined) {
                                                                found[attr] = [];
                                                            }
                                                            found[attr].push(nodeId);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    for (const attr2 in found) {
                                        if (found[attr2].length > 1) {
                                            filtered[[attr1, attr2].sort().join(';')] = found[attr2];
                                            merged = true;
                                        }
                                    }
                                    if (!merged) {
                                        filtered[attr1] = ids;
                                    }
                                }
                            }
                            for (const attr1 in filtered) {
                                for (const attr2 in filtered) {
                                    if (attr1 !== attr2 && filtered[attr1].join('') === filtered[attr2].join('')) {
                                        const index = filtered[attr1].join(',');
                                        if (combined[index]) {
                                            combined[index] = new Set([...combined[index], ...attr2.split(';')]);
                                        }
                                        else {
                                            combined[index] = new Set([...attr1.split(';'), ...attr2.split(';')]);
                                        }
                                        deleteKeys.add(attr1).add(attr2);
                                    }
                                }
                            }
                            deleteKeys.forEach(value => delete filtered[value]);
                            for (const attrs in filtered) {
                                deleteStyleAttribute(sorted, attrs, filtered[attrs]);
                                style[tag][attrs] = filtered[attrs];
                            }
                            for (const index in combined) {
                                const attrs = Array.from(combined[index]).sort().join(';');
                                const ids = index.split(',').map(value => parseInt(value));
                                deleteStyleAttribute(sorted, attrs, ids);
                                style[tag][attrs] = ids;
                            }
                        }
                        const shared = Object.keys(styleKey);
                        if (shared.length > 0) {
                            if (shared.length > 1 || styleKey[shared[0]].length > 1) {
                                style[tag][shared.join(';')] = styleKey[shared[0]];
                            }
                            else {
                                Object.assign(layoutKey, styleKey);
                            }
                        }
                        for (const attr in layoutKey) {
                            layout[tag][attr] = layoutKey[attr];
                        }
                        for (let i = 0; i < sorted.length; i++) {
                            if (sorted[i] && Object.keys(sorted[i]).length === 0) {
                                delete sorted[i];
                            }
                        }
                        sorted = sorted.filter(item => {
                            if (item) {
                                for (const attr in item) {
                                    if (item[attr] && item[attr].length > 0) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        });
                    }
                } while (sorted.length > 0);
            }
            const resource = {};
            const mapNode = {};
            const parentStyle = new Set();
            for (const tagName in style) {
                const tagData = style[tagName];
                const styleData = [];
                for (const attrs in tagData) {
                    styleData.push({
                        name: '',
                        attrs,
                        ids: tagData[attrs]
                    });
                }
                styleData.sort((a, b) => {
                    let [c, d] = [a.ids.length, b.ids.length];
                    if (c === d) {
                        [c, d] = [a.attrs.split(';').length, b.attrs.split(';').length];
                    }
                    return c >= d ? -1 : 1;
                });
                styleData.forEach((item, index) => item.name = $util$2.capitalize(tagName) + (index > 0 ? `_${index}` : ''));
                resource[tagName] = styleData;
            }
            for (const tagName in resource) {
                for (const group of resource[tagName]) {
                    for (const id of group.ids) {
                        if (mapNode[id] === undefined) {
                            mapNode[id] = { styles: [], attrs: [] };
                        }
                        mapNode[id].styles.push(group.name);
                    }
                }
                const tagData = layout[tagName];
                if (tagData) {
                    for (const attr in tagData) {
                        for (const id of tagData[attr]) {
                            if (mapNode[id] === undefined) {
                                mapNode[id] = { styles: [], attrs: [] };
                            }
                            mapNode[id].attrs.push(attr);
                        }
                    }
                }
            }
            for (const id in mapNode) {
                const node = viewData.cache.find('id', parseInt(id));
                if (node) {
                    const styles = mapNode[id].styles;
                    const attrs = mapNode[id].attrs;
                    if (styles.length > 0) {
                        parentStyle.add(styles.join('.'));
                        node.attr('_', 'style', `@style/${styles.pop()}`);
                    }
                    if (attrs.length > 0) {
                        attrs.sort().forEach(value => node.formatted(replaceUnit(value, this.settings, true), false));
                    }
                }
            }
            for (const name of parentStyle) {
                let parent = '';
                name.split('.').forEach(value => {
                    const match = value.match(/^(\w*?)(?:_(\d+))?$/);
                    if (match) {
                        const tagData = resource[match[1].toUpperCase()][match[2] === undefined ? 0 : parseInt(match[2])];
                        tagData.name = value;
                        tagData.parent = parent;
                        $Resource.STORED.styles.set(value, tagData);
                        parent = value;
                    }
                });
            }
        }
        processDimensions(data) {
            const groups = {};
            const dimens = $Resource.STORED.dimens;
            function getResourceKey(key, value) {
                return dimens.has(key) && dimens.get(key) !== value ? generateId('dimens', key, 1) : key;
            }
            function addToGroup(group, node, dimen, attr, value) {
                if (typeof value !== 'undefined') {
                    if (/(px|dp|sp)$/.test(value)) {
                        dimen += `,${attr},${value}`;
                    }
                    else {
                        return;
                    }
                }
                if (group[dimen] === undefined) {
                    group[dimen] = [];
                }
                group[dimen].push(node);
            }
            for (const node of data.cache.visible) {
                const nodeName = node.nodeName.toLowerCase();
                if (groups[nodeName] === undefined) {
                    groups[nodeName] = {};
                }
                for (const key of Object.keys($enum$2.BOX_STANDARD)) {
                    const attr = node.localizeString($util$2.convertEnum(parseInt(key), $enum$2.BOX_STANDARD, BOX_ANDROID));
                    const value = node.android(attr);
                    if (value !== '') {
                        addToGroup(groups[nodeName], node, `${node.localizeString($enum$2.BOX_STANDARD[key].toLowerCase())},${attr},${value}`);
                    }
                }
                ['android:layout_width:width',
                    'android:layout_height:height',
                    'android:minWidth:min_width',
                    'android:minHeight:min_height',
                    'app:layout_constraintWidth_min:constraint_width_min',
                    'app:layout_constraintHeight_min:constraint_height_min'].forEach(value => {
                    const [obj, attr, dimen] = value.split(':');
                    addToGroup(groups[nodeName], node, dimen, attr, node[obj](attr));
                });
            }
            for (const nodeName in groups) {
                const group = groups[nodeName];
                for (const name in group) {
                    const [dimen, attr, value] = name.split(',');
                    const key = getResourceKey(`${nodeName}_${dimen}`, value);
                    group[name].forEach(node => node[attr.indexOf('constraint') !== -1 ? 'app' : 'android'](attr, `@dimen/${key}`));
                    dimens.set(key, value);
                }
            }
            return (_data) => {
                for (const value of [..._data.views, ..._data.includes]) {
                    let content = value.content;
                    const pattern = /\s+\w+:\w+="({%(\w+),(\w+),(-?\w+)})"/g;
                    let match;
                    while ((match = pattern.exec(content)) !== null) {
                        const key = getResourceKey(`${match[2]}_${match[3]}`, match[4]);
                        dimens.set(key, match[4]);
                        content = content.replace(new RegExp(match[1], 'g'), `@dimen/${key}`);
                    }
                    value.content = content;
                }
            };
        }
    }

    const template$3 = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<resources>',
        '!1',
        '	<string name="{&name}">{~value}</string>',
        '!1',
        '</resources>',
        '<!-- filename: res/values/strings.xml -->'
    ];
    var STRING_TMPL = template$3.join('\n');

    const template$4 = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<resources>',
        '!1',
        '	<string-array name="{&name}">',
        '!items',
        '		<item>{&value}</item>',
        '!items',
        '	</string-array>',
        '!1',
        '</resources>',
        '<!-- filename: res/values/string_arrays.xml -->'
    ];
    var STRINGARRAY_TMPL = template$4.join('\n');

    const template$5 = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<font-family {&namespace}>',
        '!1',
        '	<font android:fontStyle="{&style}" android:fontWeight="{&weight}" android:font="{&font}" />',
        '!1',
        '</font-family>',
        '<!-- filename: res/font/{&name}.xml -->',
    ];
    var FONT_TMPL = template$5.join('\n');

    const template$6 = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<resources>',
        '!1',
        '	<color name="{&value}">{&name}</color>',
        '!1',
        '</resources>',
        '<!-- filename: res/values/colors.xml -->'
    ];
    var COLOR_TMPL = template$6.join('\n');

    const template$7 = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<resources>',
        '!1',
        '	<style name="{&parentName}" parent="{~parent}">',
        '!items',
        '		<item name="{&name}">{&value}</item>',
        '!items',
        '	</style>',
        '!1',
        '</resources>',
        '<!-- filename: res/values/styles.xml -->'
    ];
    var STYLE_TMPL = template$7.join('\n');

    const template$8 = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<resources>',
        '!1',
        '	<dimen name="{&name}">{&value}</dimen>',
        '!1',
        '</resources>',
        '<!-- filename: res/values/dimens.xml -->'
    ];
    var DIMEN_TMPL = template$8.join('\n');

    const template$9 = [
        '{&value}',
        '<!-- filename: {&name} -->',
    ];
    var DRAWABLE_TMPL = template$9.join('\n');

    var $util$3 = androme.lib.util;
    var $xml$3 = androme.lib.xml;
    function parseImageDetails(xml) {
        const result = [];
        const pattern = /<!-- image: (.+) -->\n<!-- filename: (.+)\/(.*?\.\w+) -->/;
        let match;
        while ((match = pattern.exec(xml)) !== null) {
            result.push({
                uri: match[1],
                pathname: match[2],
                filename: match[3],
                content: ''
            });
            xml = xml.replace(match[0], '');
        }
        return result;
    }
    function parseFileDetails(xml) {
        const result = [];
        const pattern = /<\?xml[\w\W]*?(<!-- filename: (.+)\/(.*?\.xml) -->)/;
        let match;
        while ((match = pattern.exec(xml)) !== null) {
            result.push({
                content: match[0].replace(match[1], '').trim(),
                pathname: match[2],
                filename: match[3]
            });
            xml = xml.replace(match[0], '');
        }
        return result;
    }
    function createPlainFile(pathname, filename, content) {
        return {
            pathname,
            filename,
            content
        };
    }
    function caseInsensitive(a, b) {
        return a.toString().toLowerCase() >= b.toString().toLowerCase() ? 1 : -1;
    }
    class FileHandler extends androme.lib.base.File {
        constructor(settings) {
            super();
            this.settings = settings;
        }
        saveAllToDisk(data) {
            const files = [];
            const views = [...data.views, ...data.includes];
            for (let i = 0; i < views.length; i++) {
                const view = views[i];
                files.push(createPlainFile(view.pathname, i === 0 ? this.settings.outputMainFileName : `${view.filename}.xml`, view.content));
            }
            const xml = this.resourceDrawableToXml();
            files.push(...parseFileDetails(this.resourceStringToXml()));
            files.push(...parseFileDetails(this.resourceStringArrayToXml()));
            files.push(...parseFileDetails(this.resourceFontToXml()));
            files.push(...parseFileDetails(this.resourceColorToXml()));
            files.push(...parseFileDetails(this.resourceStyleToXml()));
            files.push(...parseFileDetails(this.resourceDimenToXml()));
            files.push(...parseImageDetails(xml), ...parseFileDetails(xml));
            this.saveToDisk(files);
        }
        layoutAllToXml(data, saveToDisk = false) {
            const result = {};
            const files = [];
            const views = [...data.views, ...data.includes];
            for (let i = 0; i < views.length; i++) {
                const view = views[i];
                result[view.filename] = view.content;
                if (saveToDisk) {
                    files.push(createPlainFile(view.pathname, i === 0 ? this.settings.outputMainFileName : `${view.filename}.xml`, view.content));
                }
            }
            if (saveToDisk) {
                this.saveToDisk(files);
            }
            return result;
        }
        resourceAllToXml(saveToDisk = false) {
            const result = {
                string: this.resourceStringToXml(),
                stringArray: this.resourceStringArrayToXml(),
                font: this.resourceFontToXml(),
                color: this.resourceColorToXml(),
                style: this.resourceStyleToXml(),
                dimen: this.resourceDimenToXml(),
                drawable: this.resourceDrawableToXml()
            };
            for (const resource in result) {
                if (result[resource] === '') {
                    delete result[resource];
                }
            }
            if (saveToDisk) {
                const files = [];
                for (const resource in result) {
                    if (resource === 'drawable') {
                        files.push(...parseImageDetails(result[resource]));
                    }
                    files.push(...parseFileDetails(result[resource]));
                }
                this.saveToDisk(files);
            }
            return result;
        }
        resourceStringToXml(saveToDisk = false) {
            const data = { '1': [] };
            this.stored.strings = new Map([...this.stored.strings.entries()].sort(caseInsensitive));
            if (this.appName !== '' && !this.stored.strings.has('app_name')) {
                data['1'].push({
                    name: 'app_name',
                    value: this.appName
                });
            }
            for (const [name, value] of this.stored.strings.entries()) {
                data['1'].push({
                    name,
                    value
                });
            }
            let xml = $xml$3.createTemplate($xml$3.parseTemplate(STRING_TMPL), data);
            xml = replaceTab(xml, this.settings, true);
            if (saveToDisk) {
                this.saveToDisk(parseFileDetails(xml));
            }
            return xml;
        }
        resourceStringArrayToXml(saveToDisk = false) {
            let xml = '';
            if (this.stored.arrays.size > 0) {
                const data = { '1': [] };
                this.stored.arrays = new Map([...this.stored.arrays.entries()].sort());
                for (const [name, values] of this.stored.arrays.entries()) {
                    data['1'].push({
                        name,
                        items: values.map(value => ({ value }))
                    });
                }
                xml = $xml$3.createTemplate($xml$3.parseTemplate(STRINGARRAY_TMPL), data);
                xml = replaceTab(xml, this.settings, true);
                if (saveToDisk) {
                    this.saveToDisk(parseFileDetails(xml));
                }
            }
            return xml;
        }
        resourceFontToXml(saveToDisk = false) {
            let xml = '';
            if (this.stored.fonts.size > 0) {
                this.stored.fonts = new Map([...this.stored.fonts.entries()].sort());
                const namespace = this.settings.targetAPI < BUILD_ANDROID.OREO ? 'app' : 'android';
                for (const [name, font] of this.stored.fonts.entries()) {
                    const data = {
                        name,
                        namespace: getXmlNs(namespace),
                        '1': []
                    };
                    for (const attr in font) {
                        const [style, weight] = attr.split('-');
                        data['1'].push({
                            style,
                            weight,
                            font: `@font/${name + (style === 'normal' && weight === '400' ? `_${style}` : (style !== 'normal' ? `_${style}` : '') + (weight !== '400' ? `_${FONTWEIGHT_ANDROID[weight] || weight}` : ''))}`
                        });
                    }
                    xml += '\n\n' + $xml$3.createTemplate($xml$3.parseTemplate(FONT_TMPL), data);
                }
                if (this.settings.targetAPI < BUILD_ANDROID.OREO) {
                    xml = xml.replace(/android/g, 'app');
                }
                xml = replaceTab(xml, this.settings);
                if (saveToDisk) {
                    this.saveToDisk(parseFileDetails(xml));
                }
            }
            return xml.trim();
        }
        resourceColorToXml(saveToDisk = false) {
            let xml = '';
            if (this.stored.colors.size > 0) {
                const data = { '1': [] };
                this.stored.colors = new Map([...this.stored.colors.entries()].sort());
                for (const [name, value] of this.stored.colors.entries()) {
                    data['1'].push({
                        name,
                        value
                    });
                }
                xml = $xml$3.createTemplate($xml$3.parseTemplate(COLOR_TMPL), data);
                xml = replaceTab(xml, this.settings);
                if (saveToDisk) {
                    this.saveToDisk(parseFileDetails(xml));
                }
            }
            return xml;
        }
        resourceStyleToXml(saveToDisk = false) {
            let xml = '';
            if (this.stored.styles.size > 0) {
                const data = { '1': [] };
                const styles = Array.from(this.stored.styles.values()).sort((a, b) => a.name.toString().toLowerCase() >= b.name.toString().toLowerCase() ? 1 : -1);
                for (const style of styles) {
                    const items = [];
                    style.attrs.split(';').sort().forEach((attr) => {
                        const [name, value] = attr.split('=');
                        items.push({
                            name,
                            value: value.replace(/"/g, '')
                        });
                    });
                    data['1'].push({
                        parentName: style.name,
                        parent: style.parent || '',
                        items
                    });
                }
                xml = $xml$3.createTemplate($xml$3.parseTemplate(STYLE_TMPL), data);
                xml = replaceUnit(xml, this.settings, true);
                xml = replaceTab(xml, this.settings);
                if (saveToDisk) {
                    this.saveToDisk(parseFileDetails(xml));
                }
            }
            return xml;
        }
        resourceDimenToXml(saveToDisk = false) {
            let xml = '';
            if (this.stored.dimens.size > 0) {
                const data = { '1': [] };
                this.stored.dimens = new Map([...this.stored.dimens.entries()].sort());
                for (const [name, value] of this.stored.dimens.entries()) {
                    data['1'].push({
                        name,
                        value
                    });
                }
                xml = $xml$3.createTemplate($xml$3.parseTemplate(DIMEN_TMPL), data);
                xml = replaceUnit(xml, this.settings);
                xml = replaceTab(xml, this.settings);
                if (saveToDisk) {
                    this.saveToDisk(parseFileDetails(xml));
                }
            }
            return xml;
        }
        resourceDrawableToXml(saveToDisk = false) {
            let xml = '';
            if (this.stored.drawables.size > 0 || this.stored.images.size > 0) {
                const template = $xml$3.parseTemplate(DRAWABLE_TMPL);
                for (const [name, value] of this.stored.drawables.entries()) {
                    xml += '\n\n' + $xml$3.createTemplate(template, {
                        name: `res/drawable/${name}.xml`,
                        value
                    });
                }
                for (const [name, images] of this.stored.images.entries()) {
                    if (Object.keys(images).length > 1) {
                        for (const dpi in images) {
                            xml += '\n\n' + $xml$3.createTemplate(template, {
                                name: `res/drawable-${dpi}/${name}.${$util$3.lastIndexOf(images[dpi], '.')}`,
                                value: `<!-- image: ${images[dpi]} -->`
                            });
                        }
                    }
                    else if (images.mdpi) {
                        xml += '\n\n' + $xml$3.createTemplate(template, {
                            name: `res/drawable/${name}.${$util$3.lastIndexOf(images.mdpi, '.')}`,
                            value: `<!-- image: ${images.mdpi} -->`
                        });
                    }
                }
                xml = replaceUnit(xml.trim(), this.settings);
                xml = replaceTab(xml, this.settings);
                if (saveToDisk) {
                    this.saveToDisk([...parseImageDetails(xml), ...parseFileDetails(xml)]);
                }
            }
            return xml;
        }
    }

    var $enum$3 = androme.lib.enumeration;
    var $util$4 = androme.lib.util;
    var $dom$3 = androme.lib.dom;
    class Accessibility extends androme.lib.base.extensions.Accessibility {
        afterRender() {
            for (const node of Array.from(this.application.cacheProcessing.elements)) {
                if (!node.hasBit('excludeProcedure', $enum$3.NODE_PROCEDURE.ACCESSIBILITY)) {
                    const element = node.element;
                    switch (node.controlName) {
                        case NODE_ANDROID.EDIT:
                            if (!node.companion) {
                                [node.nextElementSibling, node.previousElementSibling].some((sibling) => {
                                    const label = $dom$3.getNodeFromElement(sibling);
                                    const labelParent = sibling && sibling.parentElement && sibling.parentElement.tagName === 'LABEL' ? $dom$3.getNodeFromElement(sibling.parentElement) : null;
                                    if (label && label.visible && label.pageflow) {
                                        if ($util$4.hasValue(sibling.htmlFor) && sibling.htmlFor === element.id) {
                                            label.android('labelFor', node.stringId);
                                            return true;
                                        }
                                        else if (label.textElement && labelParent) {
                                            labelParent.android('labelFor', node.stringId);
                                            return true;
                                        }
                                    }
                                    return false;
                                });
                            }
                        case NODE_ANDROID.SELECT:
                        case NODE_ANDROID.CHECKBOX:
                        case NODE_ANDROID.RADIO:
                        case NODE_ANDROID.BUTTON:
                            if (element.disabled) {
                                node.android('focusable', 'false');
                            }
                            break;
                    }
                }
            }
        }
    }

    class Custom extends androme.lib.base.extensions.Custom {
        afterInsert() {
            const node = this.node;
            const options = Object.assign({}, this.options[node.element.id]);
            node.apply(ResourceHandler.formatOptions(options, this.application.settings));
        }
    }

    class External extends androme.lib.base.extensions.External {
    }

    var $enum$4 = androme.lib.enumeration;
    var $const$2 = androme.lib.constant;
    var $util$5 = androme.lib.util;
    var $dom$4 = androme.lib.dom;
    class Grid extends androme.lib.base.extensions.Grid {
        processChild() {
            const node = this.node;
            const data = node.data($const$2.EXT_NAME.GRID, 'cellData');
            if (data) {
                if (data.rowSpan > 1) {
                    node.android('layout_rowSpan', data.rowSpan.toString());
                }
                if (data.columnSpan > 1) {
                    node.android('layout_columnSpan', data.columnSpan.toString());
                }
                if (node.parent.display === 'table' && node.display === 'table-cell') {
                    node.android('layout_gravity', 'fill');
                }
            }
            return super.processChild();
        }
        afterRender() {
            for (const node of this.subscribers) {
                if (!(node.display === 'table' && node.css('borderCollapse') === 'collapse')) {
                    const mainData = node.data($const$2.EXT_NAME.GRID, 'mainData');
                    if (mainData) {
                        node.each(item => {
                            const cellData = item.data($const$2.EXT_NAME.GRID, 'cellData');
                            if (cellData) {
                                const dimensions = $dom$4.getBoxSpacing(item.documentParent.element, true);
                                const padding = mainData.padding;
                                if (cellData.cellFirst) {
                                    padding.top = dimensions.paddingTop + dimensions.marginTop;
                                }
                                if (cellData.rowStart) {
                                    padding.left = Math.max(dimensions.marginLeft + dimensions.paddingLeft, padding.left);
                                }
                                if (cellData.rowEnd) {
                                    const heightBottom = dimensions.marginBottom + dimensions.paddingBottom + (!cellData.cellLast ? dimensions.marginTop + dimensions.paddingTop : 0);
                                    if (heightBottom > 0) {
                                        if (cellData.cellLast) {
                                            padding.bottom = heightBottom;
                                        }
                                        else {
                                            this.application.viewController.appendAfter(item.id, this.application.viewController.renderColumnSpace(item.renderDepth, 'match_parent', $util$5.formatPX(heightBottom), mainData.columnCount));
                                        }
                                    }
                                    padding.right = Math.max(dimensions.marginRight + dimensions.paddingRight, padding.right);
                                }
                            }
                        }, true);
                    }
                }
            }
            for (const node of this.subscribers) {
                const data = node.data($const$2.EXT_NAME.GRID, 'mainData');
                if (data) {
                    node.modifyBox($enum$4.BOX_STANDARD.PADDING_TOP, data.padding.top);
                    node.modifyBox($enum$4.BOX_STANDARD.PADDING_RIGHT, data.padding.right);
                    node.modifyBox($enum$4.BOX_STANDARD.PADDING_BOTTOM, data.padding.bottom);
                    node.modifyBox($enum$4.BOX_STANDARD.PADDING_LEFT, data.padding.left);
                }
            }
        }
    }

    var $enum$5 = androme.lib.enumeration;
    var $const$3 = androme.lib.constant;
    var $util$6 = androme.lib.util;
    var $dom$5 = androme.lib.dom;
    class List extends androme.lib.base.extensions.List {
        processChild() {
            const node = this.node;
            const mainData = node.data($const$3.EXT_NAME.LIST, 'mainData');
            if (mainData) {
                const parent = this.parent;
                const controller = this.application.viewController;
                const settings = this.application.settings;
                const parentLeft = $util$6.convertInt(parent.css('paddingLeft')) + $util$6.convertInt(parent.cssInitial('marginLeft', true));
                let columnCount = 0;
                let paddingLeft = node.marginLeft;
                node.modifyBox($enum$5.BOX_STANDARD.MARGIN_LEFT, null);
                if (parent.is($enum$5.NODE_STANDARD.GRID)) {
                    columnCount = $util$6.convertInt(parent.android('columnCount'));
                    paddingLeft += parentLeft;
                }
                else if (parent.item(0) === node) {
                    paddingLeft += parentLeft;
                }
                const ordinal = node.find(item => item.float === 'left' &&
                    $util$6.convertInt(item.cssInitial('marginLeft', true)) < 0 &&
                    Math.abs($util$6.convertInt(item.cssInitial('marginLeft', true))) <= $util$6.convertInt(item.documentParent.cssInitial('marginLeft', true)));
                if (ordinal && mainData.ordinal === '') {
                    let output = '';
                    ordinal.parent = parent;
                    if (ordinal.inlineText || ordinal.length === 0) {
                        output = controller.renderNode(ordinal, parent, $enum$5.NODE_STANDARD.TEXT);
                    }
                    else if (ordinal.every(item => item.pageflow)) {
                        output = controller.renderGroup(ordinal, parent, $enum$5.NODE_STANDARD.RELATIVE);
                    }
                    else {
                        output = controller.renderGroup(ordinal, parent, $enum$5.NODE_STANDARD.CONSTRAINT);
                    }
                    controller.prependBefore(node.id, output);
                    if (columnCount === 3) {
                        node.android('layout_columnSpan', '2');
                    }
                    paddingLeft += ordinal.marginLeft;
                    ordinal.modifyBox($enum$5.BOX_STANDARD.MARGIN_LEFT, null);
                    if (!ordinal.hasWidth && paddingLeft > 0) {
                        ordinal.android('minWidth', $util$6.formatPX(paddingLeft));
                    }
                }
                else {
                    const columnWeight = columnCount > 0 ? '0' : '';
                    const positionInside = node.css('listStylePosition') === 'inside';
                    const listStyleImage = !['', 'none'].includes(node.css('listStyleImage'));
                    let image = '';
                    let left = 0;
                    let top = 0;
                    if (mainData.imageSrc !== '') {
                        const boxPosition = $dom$5.getBackgroundPosition(mainData.imagePosition, node.bounds, node.css('fontSize'));
                        left = boxPosition.left;
                        top = boxPosition.top;
                        image = ResourceHandler.addImageURL(mainData.imageSrc);
                    }
                    const gravity = (image !== '' && !listStyleImage) || (parentLeft === 0 && node.marginLeft === 0) ? '' : 'right';
                    if (gravity === '') {
                        paddingLeft += node.paddingLeft;
                        node.modifyBox($enum$5.BOX_STANDARD.PADDING_LEFT, null);
                    }
                    if (left > 0 && paddingLeft > left) {
                        paddingLeft -= left;
                    }
                    paddingLeft = Math.max(paddingLeft, 20);
                    const minWidth = paddingLeft > 0 ? delimitUnit(node.nodeName, 'min_width', $util$6.formatPX(paddingLeft), settings) : '';
                    const paddingRight = (() => {
                        if (paddingLeft <= 24) {
                            return 6;
                        }
                        else if (paddingLeft <= 32) {
                            return 8;
                        }
                        else {
                            return 10;
                        }
                    })();
                    let layoutMarginLeft = left > 0 ? $util$6.formatPX(left) : '';
                    const options = {
                        android: {
                            layout_columnWeight: columnWeight
                        }
                    };
                    if (positionInside) {
                        if (layoutMarginLeft !== '') {
                            layoutMarginLeft = delimitUnit(node.nodeName, node.localizeString('margin_left'), layoutMarginLeft, settings);
                        }
                        controller.prependBefore(node.id, controller.renderNodeStatic($enum$5.NODE_STANDARD.SPACE, parent.renderDepth + 1, {
                            android: {
                                minWidth,
                                layout_columnWeight: columnWeight,
                                [node.localizeString('layout_marginLeft')]: layoutMarginLeft
                            }
                        }, 'wrap_content', 'wrap_content'));
                        Object.assign(options.android, {
                            minWidth: delimitUnit(node.nodeName, 'min_width', $util$6.formatPX(24), settings)
                        });
                    }
                    else {
                        Object.assign(options.android, {
                            minWidth,
                            gravity: paddingLeft > 20 ? node.localizeString(gravity) : '',
                            [node.localizeString('layout_marginLeft')]: layoutMarginLeft,
                            [node.localizeString('paddingLeft')]: gravity === '' && image === '' ? $util$6.formatPX(paddingRight) : (paddingLeft === 20 ? '2px' : ''),
                            [node.localizeString('paddingRight')]: gravity === 'right' && paddingLeft > 20 ? $util$6.formatPX(paddingRight) : '',
                            paddingTop: node.paddingTop > 0 ? $util$6.formatPX(node.paddingTop) : ''
                        });
                        if (columnCount === 3) {
                            node.android('layout_columnSpan', '2');
                        }
                    }
                    if (node.tagName === 'DT' && image === '') {
                        node.android('layout_columnSpan', columnCount.toString());
                    }
                    else {
                        if (image !== '') {
                            Object.assign(options.android, {
                                src: `@drawable/${image}`,
                                layout_marginTop: top > 0 ? $util$6.formatPX(top) : '',
                                baselineAlignBottom: 'true',
                                scaleType: !positionInside && gravity === 'right' ? 'fitEnd' : 'fitStart'
                            });
                        }
                        else {
                            Object.assign(options.android, { text: mainData.ordinal });
                        }
                        const companion = new View(this.application.cacheProcessing.nextId, document.createElement('SPAN'), this.application.viewController.delegateNodeInit);
                        companion.alignmentType = $enum$5.NODE_ALIGNMENT.SPACE;
                        companion.nodeName = `${node.tagName}_ORDINAL`;
                        companion.setNodeType(NODE_ANDROID.SPACE);
                        companion.inherit(node, 'style');
                        if (mainData.ordinal !== '' && !/[A-Za-z\d]+\./.test(mainData.ordinal) && companion.toInt('fontSize') > 12) {
                            companion.css('fontSize', '12px');
                        }
                        node.companion = companion;
                        this.application.cacheProcessing.append(companion, false);
                        controller.prependBefore(node.id, controller.renderNodeStatic(image !== '' ? $enum$5.NODE_STANDARD.IMAGE
                            : mainData.ordinal !== '' ? $enum$5.NODE_STANDARD.TEXT : $enum$5.NODE_STANDARD.SPACE, parent.renderDepth + 1, options, 'wrap_content', 'wrap_content', companion));
                    }
                }
                if (columnCount > 0) {
                    node.android('layout_columnWeight', '1');
                }
            }
            return { output: '', complete: true };
        }
        beforeInsert() {
            const node = this.node;
            if (node.is($enum$5.NODE_STANDARD.GRID)) {
                const columnCount = node.android('columnCount');
                for (let i = 0; i < node.renderChildren.length; i++) {
                    const current = node.renderChildren[i];
                    const previous = node.renderChildren[i - 1];
                    let spaceHeight = 0;
                    if (previous) {
                        const marginBottom = $util$6.convertInt(previous.android('layout_marginBottom'));
                        if (marginBottom > 0) {
                            spaceHeight += $util$6.convertInt(previous.android('layout_marginBottom'));
                            previous.delete('android', 'layout_marginBottom');
                            previous.modifyBox($enum$5.BOX_STANDARD.MARGIN_BOTTOM, null);
                        }
                    }
                    const marginTop = $util$6.convertInt(current.android('layout_marginTop'));
                    if (marginTop > 0) {
                        spaceHeight += marginTop;
                        current.delete('android', 'layout_marginTop');
                        current.modifyBox($enum$5.BOX_STANDARD.MARGIN_TOP, null);
                    }
                    if (spaceHeight > 0) {
                        this.application.viewController.prependBefore(current.id, this.application.viewController.renderNodeStatic($enum$5.NODE_STANDARD.SPACE, current.renderDepth, {
                            android: {
                                layout_columnSpan: columnCount.toString()
                            }
                        }, 'match_parent', $util$6.formatPX(spaceHeight)), 0);
                    }
                }
            }
        }
        afterInsert() {
            const node = this.node;
            if (node.is($enum$5.NODE_STANDARD.GRID) && node.blockStatic && !node.has('width')) {
                node.android('layout_width', 'match_parent');
            }
        }
    }

    class Origin extends androme.lib.base.extensions.Origin {
    }

    class Percent extends androme.lib.base.extensions.Percent {
    }

    var $enum$6 = androme.lib.enumeration;
    var $const$4 = androme.lib.constant;
    var $util$7 = androme.lib.util;
    class Sprite extends androme.lib.base.extensions.Sprite {
        processNode() {
            const node = this.node;
            const parent = this.parent;
            const image = node.data($const$4.EXT_NAME.SPRITE, 'image');
            let output = '';
            let container;
            if (image && image.uri && image.position) {
                container = new View(this.application.cacheProcessing.nextId, node.element, this.application.viewController.delegateNodeInit);
                container.siblingIndex = node.siblingIndex;
                container.nodeName = node.nodeName;
                container.inherit(node, 'initial', 'base', 'data', 'style', 'styleMap');
                container.setNodeType(NODE_ANDROID.FRAME);
                container.excludeResource |= $enum$6.NODE_RESOURCE.IMAGE_SOURCE;
                parent.replaceNode(node, container);
                container.render(parent);
                this.application.cacheProcessing.append(container, false);
                node.parent = container;
                node.nodeType = $enum$6.NODE_STANDARD.IMAGE;
                node.setNodeType(NODE_ANDROID.IMAGE);
                node.css({
                    position: 'static',
                    top: 'auto',
                    right: 'auto',
                    bottom: 'auto',
                    left: 'auto',
                    display: 'inline-block',
                    width: $util$7.formatPX(image.width),
                    height: $util$7.formatPX(image.height),
                    marginTop: $util$7.formatPX(image.position.y),
                    marginRight: '0px',
                    marginBottom: '0px',
                    marginLeft: $util$7.formatPX(image.position.x),
                    paddingTop: '0px',
                    paddingRight: '0px',
                    paddingBottom: '0px',
                    paddingLeft: '0px',
                    borderTopStyle: 'none',
                    borderRightStyle: 'none',
                    borderBottomStyle: 'none',
                    borderLeftStyle: 'none',
                    borderRadius: '0px',
                    backgroundPositionX: '0px',
                    backgroundPositionY: '0px',
                    backgroundColor: 'transparent'
                });
                node.excludeProcedure |= $enum$6.NODE_PROCEDURE.OPTIMIZATION;
                node.excludeResource |= $enum$6.NODE_RESOURCE.FONT_STYLE | $enum$6.NODE_RESOURCE.BOX_STYLE;
                node.android('src', `@drawable/${ResourceHandler.addImage({ mdpi: image.uri })}`);
                output = ViewController.getEnclosingTag(container.renderDepth, NODE_ANDROID.FRAME, container.id, `{:${container.id}}`);
            }
            return { output, parent: container, complete: true };
        }
    }

    var $const$5 = androme.lib.constant;
    var $util$8 = androme.lib.util;
    class Table extends androme.lib.base.extensions.Table {
        processNode() {
            const result = super.processNode();
            const node = this.node;
            const columnCount = $util$8.convertInt(node.android('columnCount'));
            if (columnCount > 1) {
                let requireWidth = !!node.data($const$5.EXT_NAME.TABLE, 'expand');
                node.each((item) => {
                    if (item.css('width') === '0px') {
                        item.android('layout_width', '0px');
                        item.android('layout_columnWeight', (item.element.colSpan || 1).toString());
                    }
                    else {
                        const expand = item.data($const$5.EXT_NAME.TABLE, 'expand');
                        const exceed = !!item.data($const$5.EXT_NAME.TABLE, 'exceed');
                        const downsized = !!item.data($const$5.EXT_NAME.TABLE, 'downsized');
                        if (typeof expand === 'boolean') {
                            if (expand) {
                                const percent = $util$8.convertFloat(item.data($const$5.EXT_NAME.TABLE, 'percent')) / 100;
                                if (percent > 0) {
                                    item.android('layout_width', '0px');
                                    item.android('layout_columnWeight', $util$8.trimEnd(percent.toFixed(3), '0'));
                                    requireWidth = true;
                                }
                            }
                            else {
                                item.android('layout_columnWeight', '0');
                            }
                        }
                        if (downsized) {
                            if (exceed) {
                                item.android('layout_columnWeight', '0.01');
                            }
                            else {
                                if (item.textElement) {
                                    item.android('maxLines', '1');
                                }
                                if (item.has('width') && item.toInt('width') < item.bounds.width) {
                                    item.android('layout_width', $util$8.formatPX(item.bounds.width));
                                }
                            }
                        }
                    }
                });
                if (requireWidth && !node.hasWidth) {
                    let widthParent = 0;
                    node.ascend().some(item => {
                        if (item.hasWidth) {
                            widthParent = item.bounds.width;
                            return true;
                        }
                        return false;
                    });
                    if (node.bounds.width >= widthParent) {
                        node.android('layout_width', 'match_parent');
                    }
                    else {
                        node.css('width', $util$8.formatPX(node.bounds.width));
                    }
                }
            }
            return result;
        }
        processChild() {
            const node = this.node;
            const rowSpan = $util$8.convertInt(node.data($const$5.EXT_NAME.TABLE, 'rowSpan'));
            const columnSpan = $util$8.convertInt(node.data($const$5.EXT_NAME.TABLE, 'colSpan'));
            const spaceSpan = $util$8.convertInt(node.data($const$5.EXT_NAME.TABLE, 'spaceSpan'));
            if (rowSpan > 1) {
                node.android('layout_rowSpan', rowSpan.toString());
            }
            if (columnSpan > 1) {
                node.android('layout_columnSpan', columnSpan.toString());
            }
            if (spaceSpan > 0) {
                const parent = this.parent;
                this.application.viewController.appendAfter(node.id, this.application.viewController.renderColumnSpace(parent.renderDepth + 1, 'wrap_content', 'wrap_content', spaceSpan));
            }
            return { output: '', complete: true };
        }
    }

    function autoClose() {
        const main = viewController.application;
        if (main.settings.autoCloseOnWrite && !main.loading && !main.closed) {
            main.finalize();
            return true;
        }
        return false;
    }
    let initialized = false;
    let application;
    let viewController;
    let resourceHandler;
    let settings$1;
    const framework = androme.lib.enumeration.APP_FRAMEWORK.ANDROID;
    const lib = {
        base: {
            View,
            Resource: ResourceHandler
        },
        enumeration,
        constant,
        util
    };
    const appBase = {
        lib,
        system: {
            customize(build, widget, options) {
                if (API_ANDROID[build]) {
                    const customizations = API_ANDROID[build].customizations;
                    if (customizations[widget] === undefined) {
                        customizations[widget] = {};
                    }
                    Object.assign(customizations[widget], options);
                }
            },
            addXmlNs(name, uri) {
                XMLNS_ANDROID[name] = uri;
            },
            writeLayoutAllXml(saveToDisk = false) {
                if (initialized) {
                    const main = viewController.application;
                    if (main.closed || autoClose()) {
                        return resourceHandler.file.layoutAllToXml(main.viewData, saveToDisk);
                    }
                }
                return '';
            },
            writeResourceAllXml(saveToDisk = false) {
                if (initialized) {
                    const main = viewController.application;
                    if (main.closed || autoClose()) {
                        return resourceHandler.file.resourceAllToXml(saveToDisk);
                    }
                }
                return '';
            },
            writeResourceStringXml(saveToDisk = false) {
                if (initialized) {
                    const main = viewController.application;
                    if (main.closed || autoClose()) {
                        return resourceHandler.file.resourceStringToXml(saveToDisk);
                    }
                }
                return '';
            },
            writeResourceArrayXml(saveToDisk = false) {
                if (initialized) {
                    const main = viewController.application;
                    if (main.closed || autoClose()) {
                        return resourceHandler.file.resourceStringArrayToXml(saveToDisk);
                    }
                }
                return '';
            },
            writeResourceFontXml(saveToDisk = false) {
                if (initialized) {
                    const main = viewController.application;
                    if (main.closed || autoClose()) {
                        return resourceHandler.file.resourceFontToXml(saveToDisk);
                    }
                }
                return '';
            },
            writeResourceColorXml(saveToDisk = false) {
                if (initialized) {
                    const main = viewController.application;
                    if (main.closed || autoClose()) {
                        return resourceHandler.file.resourceColorToXml(saveToDisk);
                    }
                }
                return '';
            },
            writeResourceStyleXml(saveToDisk = false) {
                if (initialized) {
                    const main = viewController.application;
                    if (main.closed || autoClose()) {
                        return resourceHandler.file.resourceStyleToXml(saveToDisk);
                    }
                }
                return '';
            },
            writeResourceDimenXml(saveToDisk = false) {
                if (initialized) {
                    const main = viewController.application;
                    if (main.closed || autoClose()) {
                        return resourceHandler.file.resourceDimenToXml(saveToDisk);
                    }
                }
                return '';
            },
            writeResourceDrawableXml(saveToDisk = false) {
                if (initialized) {
                    const main = viewController.application;
                    if (main.closed || autoClose()) {
                        return resourceHandler.file.resourceDrawableToXml(saveToDisk);
                    }
                }
                return '';
            }
        },
        create() {
            const EXT_NAME = androme.lib.constant.EXT_NAME;
            settings$1 = Object.assign({}, settings);
            const fileHandler = new FileHandler(settings$1);
            application = new androme.lib.base.Application(framework);
            viewController = new ViewController();
            resourceHandler = new ResourceHandler(fileHandler);
            application.registerController(viewController);
            application.registerResource(resourceHandler);
            application.nodeObject = View;
            application.builtInExtensions = {
                [EXT_NAME.EXTERNAL]: new External(EXT_NAME.EXTERNAL, framework),
                [EXT_NAME.ORIGIN]: new Origin(EXT_NAME.ORIGIN, framework),
                [EXT_NAME.CUSTOM]: new Custom(EXT_NAME.CUSTOM, framework),
                [EXT_NAME.ACCESSIBILITY]: new Accessibility(EXT_NAME.ACCESSIBILITY, framework),
                [EXT_NAME.SPRITE]: new Sprite(EXT_NAME.SPRITE, framework),
                [EXT_NAME.LIST]: new List(EXT_NAME.LIST, framework, ['UL', 'OL', 'DL', 'DIV']),
                [EXT_NAME.TABLE]: new Table(EXT_NAME.TABLE, framework, ['TABLE']),
                [EXT_NAME.GRID]: new Grid(EXT_NAME.GRID, framework, ['FORM', 'UL', 'OL', 'DL', 'DIV', 'TABLE', 'NAV', 'SECTION', 'ASIDE', 'MAIN', 'HEADER', 'FOOTER', 'P', 'ARTICLE', 'FIELDSET', 'SPAN']),
                [EXT_NAME.PERCENT]: new Percent(EXT_NAME.PERCENT, framework)
            };
            initialized = true;
            return {
                application,
                framework,
                settings: settings$1
            };
        },
        cached() {
            if (initialized) {
                return {
                    application,
                    framework,
                    settings: settings$1
                };
            }
            return appBase.create();
        }
    };

    return appBase;

}());

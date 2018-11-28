import { UserSettingsAndroid } from './types/module';

const settings: UserSettingsAndroid = {
    builtInExtensions: [
        'androme.external',
        'androme.origin',
        'androme.sprite',
        'androme.css-grid',
        'androme.flexbox',
        'androme.table',
        'androme.list',
        'androme.grid',
        'androme.percent',
        'androme.accessibility',
        'androme.whitespace',
        'android.constraint.guideline',
        'android.delegate.element',
        'android.delegate.radiogroup',
        'android.delegate.scrollbar',
        'android.delegate.verticalalign',
        'android.resource.includes',
        'android.resource.background',
        'android.resource.svg',
        'android.resource.strings',
        'android.resource.fonts',
        'android.resource.dimens',
        'android.resource.styles'
    ],
    targetAPI: 26,
    resolutionDPI: 160,
    supportRTL: true,
    renderInlineText: true,
    preloadImages: true,
    alwaysReevaluateResources: true,
    autoSizePaddingAndBorderWidth: true,
    ellipsisOnTextOverflow: true,
    supportNegativeLeftTop: true,
    floatOverlapDisabled: false,
    hideOffScreenElements: true,
    collapseUnattributedElements: true,
    customizationsOverwritePrivilege: true,
    showAttributes: true,
    convertPixels: 'dp',
    insertSpaces: 4,
    handleExtensionsAsync: true,
    autoCloseOnWrite: true,
    outputDirectory: 'app/src/main',
    outputMainFileName: 'activity_main.xml',
    outputArchiveFileType: 'zip',
    outputMaxProcessingTime: 30
};

export default settings;
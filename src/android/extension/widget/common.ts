export const enum FRAMEWORK {
    ANDROID = 2
}

export const enum WIDGET_NAME {
    FAB = 'android.widget.floatingactionbutton',
    MENU = 'android.widget.menu',
    COORDINATOR = 'android.widget.coordinator',
    TOOLBAR = 'android.widget.toolbar',
    DRAWER = 'android.widget.drawer',
    BOTTOM_NAVIGATION = 'android.widget.bottomnavigation'
}

export function getAppTheme(assets: FileAsset[]) {
    for (const theme of assets) {
        const match = /<style\s+name="([\w$]+)"\s+parent="Theme\.[\w$.]+"/.exec(theme.content);
        if (match) {
            return match[1];
        }
    }
    return '';
}
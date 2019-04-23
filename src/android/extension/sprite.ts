import { CONTAINER_ANDROID } from '../lib/constant';
import { CONTAINER_NODE } from '../lib/enumeration';

import Resource from '../resource';
import View from '../view';

import $Layout = androme.lib.base.Layout;

import $const = androme.lib.constant;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;

export default class <T extends View> extends androme.lib.extensions.Sprite<T> {
    public processNode(node: T, parent: T): ExtensionResult<T> {
        let output = '';
        let container: T | undefined;
        const mainData = <ImageAsset> node.data($const.EXT_NAME.SPRITE, 'mainData');
        if (mainData && mainData.uri && mainData.position && node.baseElement) {
            container = this.application.createNode(node.baseElement);
            container.inherit(node, 'initial', 'base', 'styleMap');
            container.setControlType(CONTAINER_ANDROID.FRAME);
            container.exclude({
                procedure: $enum.NODE_PROCEDURE.CUSTOMIZATION,
                resource: $enum.NODE_RESOURCE.IMAGE_SOURCE
            });
            parent.appendTry(node, container);
            this.application.processing.cache.append(container, false);
            node.setControlType(CONTAINER_ANDROID.IMAGE, CONTAINER_NODE.IMAGE);
            node.exclude({
                procedure: $enum.NODE_PROCEDURE.AUTOFIT,
                resource: $enum.NODE_RESOURCE.FONT_STYLE | $enum.NODE_RESOURCE.BOX_STYLE
            });
            node.cssApply({
                position: 'static',
                top: 'auto',
                right: 'auto',
                bottom: 'auto',
                left: 'auto',
                display: 'inline-block',
                width: $util.formatPX(mainData.width),
                height: $util.formatPX(mainData.height),
                marginTop: $util.formatPX(mainData.position.y),
                marginRight: '0px',
                marginBottom: '0px',
                marginLeft: $util.formatPX(mainData.position.x),
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
            node.unsetCache();
            node.android('src', `@drawable/${Resource.addImage({ mdpi: mainData.uri })}`);
            node.parent = container;
            const layout = new $Layout(
                parent,
                container,
                CONTAINER_NODE.FRAME,
                $enum.NODE_ALIGNMENT.SINGLE,
                1,
                container.children as T[]
            );
            output = this.application.renderLayout(layout);
        }
        return { output, parent: container, complete: true };
    }
}
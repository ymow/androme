import Extension from '../base/extension';
import Node from '../base/node';

import { deleteElementCache, getElementCache, getStyle, setElementCache } from '../lib/dom';

export default abstract class External<T extends Node> extends Extension<T> {
    public beforeInit(element: HTMLElement, internal = false) {
        if (internal || this.included(element)) {
            if (!getElementCache(element, 'andromeExternalDisplay')) {
                const display: string[] = [];
                let current: HTMLElement | null = <HTMLElement> element;
                while (current) {
                    display.push(getStyle(current).display as string);
                    current.style.display = 'block';
                    current = current.parentElement;
                }
                setElementCache(element, 'andromeExternalDisplay', display);
            }
        }
    }

    public init(element: HTMLElement) {
        if (this.included(element)) {
            this.application.parseElements.add(element);
        }
        return false;
    }

    public afterInit(element: HTMLElement, internal = false) {
        if (internal || this.included(element)) {
            const data = getElementCache(element, 'andromeExternalDisplay');
            if (data) {
                const display: string[] = data;
                let current: HTMLElement | null = element;
                let i = 0;
                while (current) {
                    current.style.display = display[i];
                    current = current.parentElement;
                    i++;
                }
                deleteElementCache(element, 'andromeExternalDisplay');
            }
        }
    }
}
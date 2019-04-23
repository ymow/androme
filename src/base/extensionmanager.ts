import Application from './application';
import Extension from './extension';
import Node from './node';

import { hasBit } from '../lib/util';

export default abstract class ExtensionManager<T extends Node> implements androme.lib.base.ExtensionManager<T> {
    protected constructor(public readonly application: Application<T>) {
    }

    public include(ext: Extension<T>) {
        const found = this.retrieve(ext.name);
        if (found) {
            if (Array.isArray(ext.tagNames)) {
                found.tagNames = ext.tagNames;
            }
            Object.assign(found.options, ext.options);
            return true;
        }
        else {
            if ((ext.framework === 0 || hasBit(ext.framework, this.application.framework)) && ext.dependencies.every(item => !!this.retrieve(item.name))) {
                ext.application = this.application;
                this.application.extensions.add(ext);
                return true;
            }
        }
        return false;
    }

    public exclude(ext: Extension<T>) {
        return this.application.extensions.delete(ext);
    }

    public retrieve(name: string): Extension<T> | null {
        return Array.from(this.application.extensions).find(item => item.name === name) || null;
    }

    public optionValue(name: string, attr: string) {
        const ext = this.retrieve(name);
        if (ext && typeof ext.options === 'object') {
            return ext.options[attr];
        }
        return undefined;
    }

    public optionValueAsObject(name: string, attr: string) {
        const value = this.optionValue(name, attr);
        if (typeof value === 'object') {
            return value as object;
        }
        return null;
    }

    public optionValueAsString(name: string, attr: string) {
        const value = this.optionValue(name, attr);
        return typeof value === 'string' ? value : '';
    }

    public optionValueAsNumber(name: string, attr: string) {
        const value = this.optionValue(name, attr);
        return typeof value === 'number' ? value : 0;
    }

    public optionValueAsBoolean(name: string, attr: string) {
        const value = this.optionValue(name, attr);
        return typeof value === 'boolean' ? value : false;
    }
}
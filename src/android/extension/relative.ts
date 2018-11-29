import View from '../view';

export default class <T extends View> extends androme.lib.extensions.Relative<T> {
    public readonly eventOnly = true;
}
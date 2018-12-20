import { flatMap } from '../lib/util';

export default class SvgAnimate implements androme.lib.base.SvgAnimate {
    public static toFractionList(value: string, delimiter = ';') {
        let previousFraction = -1;
        const result = flatMap(value.split(delimiter), segment => {
            const fraction = parseFloat(segment);
            if (!isNaN(fraction) && fraction <= 1 && (previousFraction === -1 || fraction > previousFraction)) {
                previousFraction = fraction;
                return fraction;
            }
            return -1;
        });
        return result.length > 1 && result.some(percent => percent !== -1) && result[0] === 0 ? result : [];
    }

    public static convertClockTime(value: string): [number, number] {
        let s = 0;
        let ms = 0;
        if (/\d+ms$/.test(value)) {
            ms = parseInt(value);
        }
        else if (/\d+s$/.test(value)) {
            s = parseInt(value);
        }
        else if (/\d+min$/.test(value)) {
            s = parseInt(value) * 60;
        }
        else if (/\d+(.\d+)?h$/.test(value)) {
            s = parseFloat(value) * 60 * 60;
        }
        else {
            const match = /^(?:(\d?\d):)?(?:(\d?\d):)?(\d?\d)\.?(\d?\d?\d)?$/.exec(value);
            if (match) {
                if (match[1]) {
                    s += parseInt(match[1]) * 60 * 60;
                }
                if (match[2]) {
                    s += parseInt(match[2]) * 60;
                }
                if (match[3]) {
                    s += parseInt(match[3]);
                }
                if (match[4]) {
                    ms = parseInt(match[4]) * (match[4].length < 3 ? Math.pow(10, 3 - match[4].length) : 1);
                }
            }
        }
        return [s, ms];
    }

    public attributeName = '';
    public from = '';
    public to = '';
    public by = '';
    public values: string[] = [];
    public keyTimes: number[] = [];
    public repeatDur: number | undefined;
    public repeatCount: number | undefined;
    public calcMode = '';
    public additive = false;
    public accumulate = false;
    public freeze = false;

    private _begin = 0;
    private _beginMS = 0;
    private _end = 0;
    private _endMS = 0;
    private _duration = 0;
    private _durationMS = 0;
    private _repeatDurationMS = 0;

    constructor(
        public element: SVGAnimateElement,
        public parentElement: SVGGraphicsElement)
    {
        this.build();
    }

    public build() {
        const element = this.element;
        const attributeName = element.attributes.getNamedItem('attributeName');
        if (attributeName) {
            this.attributeName = attributeName.value.trim();
        }
        const values = element.attributes.getNamedItem('values');
        if (values) {
            this.values.push(...flatMap(values.value.split(';'), value => value.trim()));
            if (this.values.length > 1) {
                this.from = this.values[0];
                this.to = this.values[this.values.length - 1];
                const keyTimes = element.attributes.getNamedItem('keyTimes');
                if (keyTimes) {
                    const times = SvgAnimate.toFractionList(keyTimes.value);
                    if (times.length === this.values.length) {
                        this.keyTimes.push(...times);
                    }
                }
            }
        }
        else {
            const to = element.attributes.getNamedItem('to');
            if (to) {
                const from = element.attributes.getNamedItem('from');
                if (from) {
                    this.from = from.value.trim();
                }
                this.to = to.value.trim();
                this.values.push(this.from, this.to);
                this.keyTimes.push(0, 1);
                const by = element.attributes.getNamedItem('by');
                if (by) {
                    this.by = by.value.trim();
                }
            }
        }
        const begin = element.attributes.getNamedItem('begin');
        const end = element.attributes.getNamedItem('end');
        const dur = element.attributes.getNamedItem('dur');
        const repeatDur = element.attributes.getNamedItem('repeatDur');
        const repeatCount = element.attributes.getNamedItem('repeatCount');
        if (begin) {
            if (begin.value === 'indefinite') {
                this._begin = -1;
            }
            else {
                [this._begin, this._beginMS] = SvgAnimate.convertClockTime(begin.value);
            }
        }
        if (end) {
            if (end.value === 'indefinite') {
                this._end = -1;
            }
            else {
                [this._end, this._endMS] = SvgAnimate.convertClockTime(end.value);
            }
        }
        if (dur) {
            if (dur.value === 'indefinite') {
                this._duration = -1;
            }
            else {
                [this._duration, this._durationMS] = SvgAnimate.convertClockTime(dur.value);
            }
        }
        if (repeatDur) {
            if (repeatDur.value === 'indefinite') {
                this.repeatDur = -1;
            }
            else {
                [this.repeatDur, this._repeatDurationMS] = SvgAnimate.convertClockTime(repeatDur.value);
            }
        }
        if (repeatCount) {
            if (repeatCount.value === 'indefinite') {
                this.repeatCount = -1;
            }
            else {
                const value = parseInt(repeatCount.value);
                if (!isNaN(value)) {
                    this.repeatCount = value;
                }
            }
        }
        const calcMode = element.attributes.getNamedItem('calcMode');
        if (calcMode) {
            switch (calcMode.value) {
                case 'discrete':
                case 'linear':
                case 'paced':
                case 'spline':
                    this.calcMode = calcMode.value;
                    break;
            }
        }
        const additive = element.attributes.getNamedItem('additive');
        if (additive) {
            this.additive = additive.value === 'sum';
        }
        const accumulate = element.attributes.getNamedItem('accumulate');
        if (accumulate) {
            this.accumulate = accumulate.value === 'sum';
        }
        const fill = element.attributes.getNamedItem('fill');
        if (fill) {
            this.freeze = fill.value === 'freeze';
        }
    }

    get duration() {
        return this._duration !== -1 ? this._duration * 1000 + this._durationMS : this._duration;
    }

    get begin() {
        return this._begin !== -1 ? this._begin * 1000 + this._beginMS : this._begin;
    }

    get end() {
        return this._end !== -1 ? this._end * 1000 + this._endMS : this._end;
    }

    get repeatDuration() {
        return this.repeatDur !== undefined && this.repeatDur !== -1 ? this.repeatDur * 1000 + this._repeatDurationMS : 0;
    }
}
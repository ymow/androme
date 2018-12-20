import SvgBuild from './svgbuild';

import { flatMap } from '../lib/util';

export default class SvgAnimate implements androme.lib.base.SvgAnimate {
    public attributeName = '';
    public from = '';
    public to = '';
    public by = '';
    public values: string[] = [];
    public keyTimes: number[] = [];
    public begin = 0;
    public beginMS = 0;
    public end = 0;
    public endMS = 0;
    public duration = 0;
    public durationMS = 0;
    public repeatDuration: number | undefined;
    public repeatDurationMS: number | undefined;
    public repeatCount: number | undefined;
    public calcMode = '';
    public additive = false;
    public accumulate = false;
    public freeze = false;

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
                    const times = SvgBuild.toFractionList(keyTimes.value);
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
                this.begin = -1;
            }
            else {
                [this.begin, this.beginMS] = SvgBuild.fromClockTime(begin.value);
            }
        }
        if (end) {
            if (end.value === 'indefinite') {
                this.end = -1;
            }
            else {
                [this.end, this.endMS] = SvgBuild.fromClockTime(end.value);
            }
        }
        if (dur) {
            if (dur.value === 'indefinite') {
                this.duration = -1;
            }
            else {
                [this.duration, this.durationMS] = SvgBuild.fromClockTime(dur.value);
            }
        }
        if (repeatDur) {
            if (repeatDur.value === 'indefinite') {
                this.repeatDuration = -1;
            }
            else {
                [this.repeatDuration, this.repeatDurationMS] = SvgBuild.fromClockTime(repeatDur.value);
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
}
import { IonContent, DomController } from '@ionic/angular';
import {
    Directive,
    ElementRef,
    Input,
    Renderer2,
    SimpleChanges,
    OnChanges
} from '@angular/core';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[scrollHide]'
})
export class ScrollHideDirective implements OnChanges {
    private contentHeight: number;
    private scrollHeight: number;
    private lastScrollPosition: number;
    private lastValue = 0;

    @Input('scrollHide')
    public config: ScrollHideConfig;

    // tslint:disable-next-line: no-input-rename
    @Input('scrollContent')
    public scrollContent: IonContent;

    constructor(
        private element: ElementRef,
        private renderer: Renderer2,
        private domCtrl: DomController
    ) {}

    private adjustElementOnScroll(ev) {
        if (ev) {
            this.domCtrl.write(async () => {
                const el = await this.scrollContent.getScrollElement();
                const scrollTop = el.scrollTop > 0 ? el.scrollTop : 0;
                const scrolldiff = scrollTop - this.lastScrollPosition;
                this.lastScrollPosition = scrollTop;
                let newValue = this.lastValue + scrolldiff;
                newValue = Math.max(
                    0,
                    Math.min(newValue, this.config.maxValue)
                );
                this.renderer.setStyle(
                    this.element.nativeElement,
                    this.config.cssProperty,
                    `-${newValue}px`
                );
                this.lastValue = newValue;
            });
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.scrollContent && this.config) {
            this.scrollContent.ionScrollStart.subscribe(async ev => {
                const el = await this.scrollContent.getScrollElement();
                this.contentHeight = el.offsetHeight;
                this.scrollHeight = el.scrollHeight;
                if (this.config.maxValue === undefined) {
                    this.config.maxValue = this.element.nativeElement.offsetHeight;
                }
                this.lastScrollPosition = el.scrollTop;
            });
            this.scrollContent.ionScroll.subscribe(ev =>
                this.adjustElementOnScroll(ev)
            );
            this.scrollContent.ionScrollEnd.subscribe(ev =>
                this.adjustElementOnScroll(ev)
            );
        }
    }
}
export interface ScrollHideConfig {
    cssProperty: string;
    maxValue: number;
}

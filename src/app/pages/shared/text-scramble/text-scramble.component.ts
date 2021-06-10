import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, AfterViewInit, ViewEncapsulation } from '@angular/core';
import * as $ from 'jquery';
import * as d3 from 'd3';
import {event as d3Event} from 'd3-selection';
import {zoom as d3Zoom} from 'd3-zoom';
import {drag as d3Drag} from 'd3-drag';
import {select as d3Select} from 'd3-selection';

@Component({
    selector: 'ngx-text-scramble',
    templateUrl: './text-scramble.component.html',
    styleUrls: ['./text-scramble.component.scss']
})
export class TextScrambleComponent implements OnInit, AfterViewInit {
    @ViewChild('cardScramble', { static: false }) private cardContainer: ElementRef;
    @Input() private data: Array<any>;
  
    public width: number;
    private height: number;
    private element: any;
    private card: any;
  
    private el: any;
    private chars: any;
    private resolve: any;
    private frame: any;
    private frameRequest: any;
    public queue: any;
  
    constructor() { }
  
    ngOnInit() {
    }
  
    ngAfterViewInit() {
        this.card = this.cardContainer.nativeElement;
        this.width = this.cardContainer.nativeElement.parentNode.parentNode.clientWidth;
        this.height = this.cardContainer.nativeElement.parentNode.parentNode.clientHeight;
        this.queue = []
        this.drawChart(this.card, this.data, this.height, this.width);
    }

    drawChart(element, data, height, width) {
        const phrases = data;
        this.TextScramble(element);
    
        let counter = 0
        const next = () => {
            this.setText(phrases[counter]).then(() => {
                setTimeout(next, 5000)
            })
            counter = (counter + 1) % phrases.length
        }
        next()
    }
  
    TextScramble(el) {
        this.el = el
        this.chars = '!<>-_\\/[]{}—=+*^?#________'
        this.update = this.update.bind(this)
    }
  
    setText(newText) {
        const oldText = this.el.innerText
        const length = Math.max(oldText.length, newText.length)
        const promise = new Promise((resolve) => this.resolve = resolve)
        this.queue = []
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || ''
            const to = newText[i] || ''
            const start = Math.floor(Math.random() * 40)
            const end = start + Math.floor(Math.random() * 40)
            this.queue.push({ from, to, start, end })
        }
        cancelAnimationFrame(this.frameRequest)
        this.frame = 0
        this.update()
        return promise
    }
  
    update() {
        let output = ''
        let complete = 0
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i]
            if (this.frame >= end) {
                complete++
                output += to
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar()
                    this.queue[i].char = char
                }
                output += `<span style="text-align: center; color: #737373;">${char}</span>`
            } else {
                output += from
            }
        }
        this.el.innerHTML = output
        if (complete === this.queue.length) {
            this.resolve()
        } else {
            this.frameRequest = requestAnimationFrame(this.update)
            this.frame++
        }
    }
  
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)]
    };
}

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface WordGroup {
  characters: string[];
  needsSpace: boolean;
}

@Component({
  selector: 'app-rotating-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rotating-text.html',
  styleUrl: './rotating-text.scss',
})
export class RotatingTextComponent implements OnInit, OnChanges, OnDestroy {
  @Input() texts: string[] = [];
  @Input() rotationInterval = 2000;
  @Input() staggerDuration = 0;
  @Input() staggerFrom: 'first' | 'last' | 'center' = 'first';
  @Input() loop = true;
  @Input() auto = true;
  @Input() mainClassName = '';
  @Input() splitLevelClassName = '';
  @Input() elementLevelClassName = '';

  /** Emitted with the current text index whenever the rotating text changes. */
  @Output() indexChange = new EventEmitter<number>();

  currentTextIndex = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private paused = false;

  ngOnInit(): void {
    this.startAutoRotate();
  }

  ngOnChanges(): void {
    this.startAutoRotate();
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private startAutoRotate(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    if (!this.auto || this.paused) return;
    this.intervalId = setInterval(() => this.next(), this.rotationInterval);
  }

  next(): void {
    const nextIndex = this.currentTextIndex === this.texts.length - 1 ? (this.loop ? 0 : this.currentTextIndex) : this.currentTextIndex + 1;
    this.currentTextIndex = nextIndex;
    this.indexChange.emit(this.currentTextIndex);
  }

  /**
   * Jump straight to a text, as if the rotation had landed on it. Used to drive
   * the pill from outside (e.g. hovering a viewer pin in the hero). The auto
   * timer is restarted so the next rotation is a full interval away rather than
   * whatever was left on the clock.
   */
  goTo(index: number): void {
    if (index < 0 || index >= this.texts.length || index === this.currentTextIndex) return;
    this.currentTextIndex = index;
    this.indexChange.emit(this.currentTextIndex);
    if (!this.paused) this.startAutoRotate();
  }

  /** Hold on the current text (while a pin is hovered, so it cannot rotate away). */
  pause(): void {
    this.paused = true;
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
  }

  /** Resume auto-rotation from whatever text is showing now. */
  resume(): void {
    if (!this.paused) return;
    this.paused = false;
    this.startAutoRotate();
  }

  get elements(): WordGroup[] {
    const currentText = this.texts[this.currentTextIndex] ?? '';
    const words = currentText.split(' ');
    return words.map((word, i) => ({
      characters: Array.from(word),
      needsSpace: i !== words.length - 1,
    }));
  }

  get totalChars(): number {
    return this.elements.reduce((sum, w) => sum + w.characters.length, 0);
  }

  previousCharsCount(wordIndex: number): number {
    return this.elements.slice(0, wordIndex).reduce((sum, w) => sum + w.characters.length, 0);
  }

  staggerDelay(index: number): number {
    const total = this.totalChars;
    if (this.staggerFrom === 'first') return index * this.staggerDuration;
    if (this.staggerFrom === 'last') return (total - 1 - index) * this.staggerDuration;
    const center = Math.floor(total / 2);
    return Math.abs(center - index) * this.staggerDuration;
  }
}

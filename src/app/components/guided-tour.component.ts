import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LegacyContentService } from '../services/legacy-content.service';
import { GuidedTourService } from '../services/guided-tour.service';
import { PrimaryButtonComponent } from './primary-button.component';

@Component({
  selector: 'ia-guided-tour',
  standalone: true,
  imports: [PrimaryButtonComponent],
  template: `
    @if (tour.active() && tour.currentStep(); as step) {
      <div class="guided-tour-layer">
        <div class="guided-tour-layer__scrim" aria-hidden="true"></div>
        <aside class="guided-tour" aria-live="polite" [class.guided-tour--pending]="tour.pending()">
          <div class="guided-tour__meta">
            <span>{{ step.accent }}</span>
            <strong>{{ tour.stepIndex() + 1 }}/{{ tour.totalSteps() }}</strong>
          </div>
          <div class="guided-tour__progress" aria-hidden="true">
            <span [style.width.%]="((tour.stepIndex() + 1) / tour.totalSteps()) * 100"></span>
          </div>

          <h2>{{ step.title }}</h2>
          <p>{{ step.text }}</p>

          <div class="guided-tour__actions">
            <button type="button" class="editorial-link editorial-link--plain" [disabled]="tour.pending()" (click)="tour.skip()">{{ t('angular.guidedTour.close', 'Chiudi tutorial') }}</button>

            <div class="guided-tour__buttons">
              @if (tour.stepIndex() > 0) {
                <ia-primary-button [label]="t('angular.guidedTour.back', 'Indietro')" tone="ghost" [disabled]="tour.pending()" (pressed)="goPrevious()" />
              }

              <ia-primary-button
                [label]="tour.stepIndex() === tour.totalSteps() - 1 ? t('angular.guidedTour.finish', 'Fine') : t('angular.guidedTour.next', 'Avanti')"
                [disabled]="tour.pending()"
                (pressed)="goNext()"
              />
            </div>
          </div>
        </aside>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuidedTourComponent {
  private readonly content = inject(LegacyContentService);
  readonly tour = inject(GuidedTourService);
  private readonly router = inject(Router);
  private highlightedElement: HTMLElement | null = null;
  private highlightAttemptToken = 0;

  readonly t = (path: string, fallback: string) => this.content.t(path, fallback);

  constructor() {
    effect(() => {
      const active = this.tour.active();
      const step = this.tour.currentStep();

      if (!active || !step) {
        this.highlightAttemptToken += 1;
        this.clearHighlight();
        return;
      }

      const token = ++this.highlightAttemptToken;
      requestAnimationFrame(() => this.highlightTarget(step.selector, token));
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const step = this.tour.currentStep();
      if (!this.tour.active() || !step) {
        this.highlightAttemptToken += 1;
        this.clearHighlight();
        return;
      }

      const token = ++this.highlightAttemptToken;
      setTimeout(() => this.highlightTarget(step.selector, token), 80);
    });
  }

  goNext(): void {
    void this.tour.next();
  }

  goPrevious(): void {
    void this.tour.previous();
  }

  private highlightTarget(selector: string, token: number, attempt = 0): void {
    if (token !== this.highlightAttemptToken) {
      return;
    }

    this.clearHighlight();

    const target = document.querySelector(selector);
    if (!(target instanceof HTMLElement)) {
      if (attempt < 10) {
        setTimeout(() => this.highlightTarget(selector, token, attempt + 1), 80);
      }
      return;
    }

    this.highlightedElement = target;
    this.highlightedElement.classList.add('tutorial-target--active');
    this.scrollTargetIntoView(this.highlightedElement);
  }

  private scrollTargetIntoView(target: HTMLElement): void {
    const rect = target.getBoundingClientRect();
    const viewportPadding = 16;
    const mobileBottomSheetOffset = window.matchMedia('(max-width: 640px)').matches ? 280 : 168;
    const isOutsideViewport =
      rect.top < viewportPadding ||
      rect.bottom > window.innerHeight - mobileBottomSheetOffset ||
      rect.left < viewportPadding ||
      rect.right > window.innerWidth - viewportPadding;

    if (!isOutsideViewport) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'center',
      inline: 'nearest'
    });
  }

  private clearHighlight(): void {
    if (!this.highlightedElement) {
      return;
    }

    this.highlightedElement.classList.remove('tutorial-target--active');
    this.highlightedElement = null;
  }
}

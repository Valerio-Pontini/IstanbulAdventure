import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PrimaryButtonComponent } from './primary-button.component';
import { GuidedTourService } from '../services/guided-tour.service';

@Component({
  selector: 'ia-guided-tour',
  standalone: true,
  imports: [PrimaryButtonComponent],
  template: `
    @if (tour.active() && tour.currentStep(); as step) {
      <aside class="guided-tour" aria-live="polite">
        <div class="guided-tour__meta">
          <span>{{ step.accent }}</span>
          <strong>{{ tour.stepIndex() + 1 }}/{{ tour.totalSteps() }}</strong>
        </div>

        <h2>{{ step.title }}</h2>
        <p>{{ step.text }}</p>

        <div class="guided-tour__actions">
          <button type="button" class="editorial-link editorial-link--plain" (click)="tour.skip()">Chiudi tutorial</button>

          <div class="guided-tour__buttons">
            @if (tour.stepIndex() > 0) {
              <ia-primary-button label="Indietro" tone="ghost" (pressed)="goPrevious()" />
            }

            <ia-primary-button [label]="tour.stepIndex() === tour.totalSteps() - 1 ? 'Fine' : 'Avanti'" (pressed)="goNext()" />
          </div>
        </div>
      </aside>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuidedTourComponent {
  readonly tour = inject(GuidedTourService);
  private readonly router = inject(Router);
  private highlightedElement: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const active = this.tour.active();
      const step = this.tour.currentStep();

      if (!active || !step) {
        this.clearHighlight();
        return;
      }

      queueMicrotask(() => this.highlightTarget(step.selector));
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const step = this.tour.currentStep();
      if (!this.tour.active() || !step) {
        this.clearHighlight();
        return;
      }

      setTimeout(() => this.highlightTarget(step.selector), 120);
    });
  }

  goNext(): void {
    void this.tour.next();
  }

  goPrevious(): void {
    void this.tour.previous();
  }

  private highlightTarget(selector: string): void {
    this.clearHighlight();

    const target = document.querySelector(selector);
    if (!(target instanceof HTMLElement)) {
      return;
    }

    this.highlightedElement = target;
    this.highlightedElement.classList.add('tutorial-target--active');
    this.highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  }

  private clearHighlight(): void {
    if (!this.highlightedElement) {
      return;
    }

    this.highlightedElement.classList.remove('tutorial-target--active');
    this.highlightedElement = null;
  }
}

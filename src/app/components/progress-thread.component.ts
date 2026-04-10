import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ia-progress-thread',
  standalone: true,
  templateUrl: './progress-thread.component.html',
  styleUrl: './progress-thread.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressThreadComponent {
  @Input() label = '';
  @Input() currentStep = 1;
  @Input() totalSteps = 1;
  @Input() progress: number | null = null;
  @Input() counter = '';

  get resolvedTotalSteps(): number {
    const fromCounter = this.parseCounter();
    if (fromCounter) {
      return fromCounter.total;
    }

    return Math.max(this.totalSteps, 1);
  }

  get resolvedCurrentStep(): number {
    const fromCounter = this.parseCounter();
    if (fromCounter) {
      return fromCounter.current;
    }

    if (this.progress !== null && Number.isFinite(this.progress) && this.resolvedTotalSteps > 1) {
      const normalized = Math.max(0, Math.min(100, this.progress));
      const step = Math.round((normalized / 100) * this.resolvedTotalSteps);
      return Math.min(Math.max(step, 1), this.resolvedTotalSteps);
    }

    return Math.min(Math.max(this.currentStep, 1), this.resolvedTotalSteps);
  }

  get steps(): number[] {
    return Array.from({ length: this.resolvedTotalSteps }, (_, index) => index + 1);
  }

  private parseCounter(): { current: number; total: number } | null {
    if (!this.counter) {
      return null;
    }

    const match = this.counter.match(/(\d+)\s*\/\s*(\d+)/);
    if (!match) {
      return null;
    }

    const current = Number.parseInt(match[1] ?? '1', 10);
    const total = Number.parseInt(match[2] ?? '1', 10);
    if (!Number.isFinite(current) || !Number.isFinite(total) || total < 1) {
      return null;
    }

    return {
      current: Math.min(Math.max(current, 1), total),
      total
    };
  }
}

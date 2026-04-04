import { Injectable, signal } from '@angular/core';

type ToastMessage = {
  text: string;
  tone: 'default' | 'success';
};

@Injectable({ providedIn: 'root' })
export class UiFeedbackService {
  private readonly toastSignal = signal<ToastMessage | null>(null);
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  readonly toast = this.toastSignal.asReadonly();

  show(text: string, tone: 'default' | 'success' = 'default'): void {
    this.toastSignal.set({ text, tone });

    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }

    this.hideTimer = setTimeout(() => {
      this.toastSignal.set(null);
      this.hideTimer = null;
    }, 2200);
  }
}

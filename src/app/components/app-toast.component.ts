import { Component, inject } from '@angular/core';
import { UiFeedbackService } from '../services/ui-feedback.service';

@Component({
  selector: 'ia-app-toast',
  standalone: true,
  template: `
    @if (feedback.toast(); as toast) {
      <div class="app-toast" [class.app-toast--success]="toast.tone === 'success'" aria-live="polite">
        {{ toast.text }}
      </div>
    }
  `
})
export class AppToastComponent {
  readonly feedback = inject(UiFeedbackService);
}

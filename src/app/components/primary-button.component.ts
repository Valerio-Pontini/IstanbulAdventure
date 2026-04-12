import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ia-primary-button',
  standalone: true,
  templateUrl: './primary-button.component.html',
  styleUrl: './primary-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryButtonComponent {
  @Input() label = '';
  @Input() tone: 'primary' | 'secondary' | 'ghost' = 'primary';
  @Input() disabled = false;
  @Input() buttonType: 'button' | 'submit' = 'button';

  @Output() readonly pressed = new EventEmitter<void>();

  private cooldownUntil = 0;

  onClick(): void {
    if (this.disabled) {
      return;
    }

    const now = Date.now();
    if (now < this.cooldownUntil) {
      return;
    }

    // Prevent accidental rapid multi-tap from firing concurrent flows.
    this.cooldownUntil = now + 180;
    this.pressed.emit();
  }
}

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
}

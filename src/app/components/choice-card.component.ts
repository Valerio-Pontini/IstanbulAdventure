import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ia-choice-card',
  standalone: true,
  templateUrl: './choice-card.component.html',
  styleUrl: './choice-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChoiceCardComponent {
  @Input() label = '';
  @Input() description = '';
  @Input() active = false;
  @Input() index?: number;

  @Output() readonly select = new EventEmitter<void>();
}

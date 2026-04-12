import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';
import { ChoiceOption } from '../models/narrative.models';
import { LegacyContentService } from '../services/legacy-content.service';
import { ChoiceCardComponent } from './choice-card.component';

@Component({
  selector: 'ia-choice-layer',
  standalone: true,
  imports: [ChoiceCardComponent],
  templateUrl: './choice-layer.component.html',
  styleUrl: './choice-layer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChoiceLayerComponent {
  private readonly content = inject(LegacyContentService);
  @Input() options: ChoiceOption[] = [];
  @Input() ariaLabel = this.content.t('angular.components.choiceLayerAria', 'Scelte disponibili');

  @Output() readonly picked = new EventEmitter<string>();

  @HostListener('keydown', ['$event'])
  onHostKeydown(event: KeyboardEvent): void {
    if (event.key >= '1' && event.key <= '4') {
      const index = Number.parseInt(event.key, 10) - 1;
      const option = this.options[index];
      if (option) {
        event.preventDefault();
        this.picked.emit(option.id);
      }
    }
  }

  pick(id: string): void {
    this.picked.emit(id);
  }
}

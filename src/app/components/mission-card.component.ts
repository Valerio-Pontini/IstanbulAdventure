import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MissionBundle } from '../models/app.models';
import { PrimaryButtonComponent } from './primary-button.component';
import { SymbolBadgeComponent } from './symbol-badge.component';

@Component({
  selector: 'ia-mission-card',
  standalone: true,
  imports: [RouterLink, PrimaryButtonComponent, SymbolBadgeComponent],
  templateUrl: './mission-card.component.html',
  styleUrl: './mission-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionCardComponent {
  @Input({ required: true }) mission!: MissionBundle;
  @Input() highlighted = false;
  @Input() saved = false;
  @Input() completed = false;
  @Output() readonly savedToggle = new EventEmitter<string>();
}

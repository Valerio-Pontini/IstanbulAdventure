import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../models/app.models';
import { SymbolBadgeComponent } from './symbol-badge.component';

@Component({
  selector: 'ia-personality-reveal',
  standalone: true,
  imports: [SymbolBadgeComponent, RouterLink],
  templateUrl: './personality-reveal.component.html',
  styleUrl: './personality-reveal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalityRevealComponent {
  @Input() category: Category | null = null;
  @Input() eyebrow = 'Profilo emerso';
}

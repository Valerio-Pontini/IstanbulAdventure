import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ia-symbol-badge',
  standalone: true,
  templateUrl: './symbol-badge.component.html',
  styleUrl: './symbol-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SymbolBadgeComponent {
  @Input() iconSrc?: string;
  @Input() label = '';
  @Input() sublabel = '';
  @Input() tone: 'default' | 'accent' = 'default';
}

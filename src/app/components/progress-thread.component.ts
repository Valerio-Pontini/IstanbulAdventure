import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ia-progress-thread',
  standalone: true,
  templateUrl: './progress-thread.component.html',
  styleUrl: './progress-thread.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressThreadComponent {
  @Input() progress = 0;
  @Input() label = '';
  @Input() counter = '';
}

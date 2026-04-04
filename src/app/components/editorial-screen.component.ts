import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ia-editorial-screen',
  standalone: true,
  templateUrl: './editorial-screen.component.html',
  styleUrl: './editorial-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorialScreenComponent {
  @Input() tone: 'default' | 'atlas' | 'reveal' = 'default';
}

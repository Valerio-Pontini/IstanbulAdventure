import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ia-scene-viewport',
  standalone: true,
  templateUrl: './scene-viewport.component.html',
  styleUrl: './scene-viewport.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SceneViewportComponent {
  @Input() tone: 'default' | 'atlas' | 'reveal' = 'default';
}

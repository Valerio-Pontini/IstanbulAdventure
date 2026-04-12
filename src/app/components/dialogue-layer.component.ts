import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DialogueRole } from '../models/narrative.models';

@Component({
  selector: 'ia-dialogue-layer',
  standalone: true,
  templateUrl: './dialogue-layer.component.html',
  styleUrl: './dialogue-layer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogueLayerComponent {
  @Input() text = '';
  @Input() speaker?: string;
  @Input() role: DialogueRole = 'narrator';
}

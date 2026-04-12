import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { buildPrologueScript } from '../content/prologue.narrative';
import { DialogueLayerComponent } from '../components/dialogue-layer.component';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { PrimaryButtonComponent } from '../components/primary-button.component';
import { ProgressThreadComponent } from '../components/progress-thread.component';
import { SceneViewportComponent } from '../components/scene-viewport.component';
import { isDialogueBeat } from '../models/narrative.models';
import { LegacyContentService } from '../services/legacy-content.service';
import { QuizSessionService } from '../services/quiz-session.service';
import { SceneRuntimeService } from '../services/scene-runtime.service';

@Component({
  selector: 'ia-story-page',
  standalone: true,
  imports: [
    EditorialScreenComponent,
    SceneViewportComponent,
    ProgressThreadComponent,
    DialogueLayerComponent,
    PrimaryButtonComponent
  ],
  template: `
    <ia-editorial-screen>
      <ia-scene-viewport [tone]="viewportTone()">
        <ia-progress-thread
          label=""
          [currentStep]="runtime.flatBeatIndex() + 1"
          [totalSteps]="runtime.totalBeats()"
        />

        @if (dialogue(); as line) {
          <ia-dialogue-layer [text]="line.text" [speaker]="line.speaker" [role]="line.role" />
        }

        <div class="editorial-actions story-actions">
          <ia-primary-button [label]="t('angular.common.back', 'Indietro')" tone="ghost" [disabled]="runtime.isAtStart()" (pressed)="prev()" />
          <ia-primary-button [label]="continueLabel()" (pressed)="next()" />
        </div>
      </ia-scene-viewport>
    </ia-editorial-screen>
  `,
  styles: [
    `
      .story-actions {
        margin-top: auto;
        padding-top: var(--space-4);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryPageComponent implements OnInit {
  private readonly content = inject(LegacyContentService);
  private readonly quiz = inject(QuizSessionService);
  private readonly router = inject(Router);
  readonly runtime = inject(SceneRuntimeService);

  readonly t = (path: string, fallback: string) => this.content.t(path, fallback);
  readonly dialogue = computed(() => {
    const beat = this.runtime.currentBeat();
    return isDialogueBeat(beat) ? beat : null;
  });

  readonly viewportTone = computed(() => this.runtime.currentScene()?.backgroundTone ?? 'default');

  readonly continueLabel = computed(() => (
    this.runtime.isAtEnd()
      ? this.t('angular.story.finish', 'Entra nella Missione 0')
      : this.t('angular.common.continue', 'Continua')
  ));

  ngOnInit(): void {
    this.runtime.loadScript(buildPrologueScript(this.quiz.storySlides));
  }

  prev(): void {
    this.runtime.previous();
  }

  next(): void {
    if (this.runtime.isAtEnd()) {
      this.quiz.startQuiz();
      void this.router.navigateByUrl('/quiz');
      return;
    }

    this.runtime.next();
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EditorialScreenComponent } from '../components/editorial-screen.component';
import { NarrativeCardComponent } from '../components/narrative-card.component';
import { PrimaryButtonComponent } from '../components/primary-button.component';
import { SectionHeaderComponent } from '../components/section-header.component';
import { MissionStateService } from '../services/mission-state.service';
import { QuizSessionService } from '../services/quiz-session.service';

@Component({
  selector: 'ia-landing-page',
  standalone: true,
  imports: [
    RouterLink,
    EditorialScreenComponent,
    SectionHeaderComponent,
    NarrativeCardComponent,
    PrimaryButtonComponent
  ],
  template: `
    <ia-editorial-screen tone="atlas">
      <ia-section-header
        eyebrow="Ingresso segreto"
        title="Apri Istanbul dal lato che ti osserva"
        description="Istanbul non si mostra a tutti allo stesso modo"
      >
        @if (state.homeUnlocked()) {
          <a class="editorial-link" routerLink="/home">Riapri il tuo archivio</a>
        }
      </ia-section-header>

      <div class="screen-grid screen-grid--hero">
        <ia-narrative-card eyebrow="Rituale di accesso">
          <div class="editorial-actions">
            <ia-primary-button label="Inizia il viaggio" (pressed)="startStory()" />
          </div>
        </ia-narrative-card>
      </div>
    </ia-editorial-screen>
  `
  ,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPageComponent {
  readonly state = inject(MissionStateService);
  private readonly quiz = inject(QuizSessionService);
  private readonly router = inject(Router);

  startStory(): void {
    this.quiz.reset();
    void this.router.navigateByUrl('/story');
  }
}

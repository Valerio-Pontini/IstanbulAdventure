import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { AllMissionsPageComponent } from './pages/all-missions-page.component';
import { ArchivePageComponent } from './pages/archive-page.component';
import { HomePageComponent } from './pages/home-page.component';
import { LandingPageComponent } from './pages/landing-page.component';
import { MissionDetailPageComponent } from './pages/mission-detail-page.component';
import { QuizPageComponent } from './pages/quiz-page.component';
import { ResultPageComponent } from './pages/result-page.component';
import { StoryPageComponent } from './pages/story-page.component';
import { MissionStateService } from './services/mission-state.service';
import { QuizSessionService } from './services/quiz-session.service';

const requireMissionZeroCompletion: CanActivateFn = () => {
  const state = inject(MissionStateService);
  const router = inject(Router);
  return state.homeUnlocked() ? true : router.createUrlTree(['/']);
};

const requireMissionZeroPending: CanActivateFn = () => {
  const state = inject(MissionStateService);
  const router = inject(Router);
  return state.homeUnlocked() ? router.createUrlTree(['/home']) : true;
};

const requireResultAvailability: CanActivateFn = () => {
  const state = inject(MissionStateService);
  const quiz = inject(QuizSessionService);
  const router = inject(Router);
  if (!state.homeUnlocked()) {
    return true;
  }
  return quiz.hasFreshResult() ? true : router.createUrlTree(['/home']);
};

export const routes: Routes = [
  { path: '', component: LandingPageComponent, title: 'Istanbul Adventure | Ingresso', canActivate: [requireMissionZeroPending] },
  { path: 'story', component: StoryPageComponent, title: 'Istanbul Adventure | Prologo', canActivate: [requireMissionZeroPending] },
  { path: 'quiz', component: QuizPageComponent, title: 'Istanbul Adventure | Missione 0', canActivate: [requireMissionZeroPending] },
  { path: 'result', component: ResultPageComponent, title: 'Istanbul Adventure | Esito', canActivate: [requireResultAvailability] },
  { path: 'home', component: HomePageComponent, title: 'Istanbul Adventure | Home', canActivate: [requireMissionZeroCompletion] },
  { path: 'missions', component: AllMissionsPageComponent, title: 'Istanbul Adventure | Tutte le missioni', canActivate: [requireMissionZeroCompletion] },
  { path: 'archive/:section', component: ArchivePageComponent, title: 'Istanbul Adventure | Archivio', canActivate: [requireMissionZeroCompletion] },
  { path: 'mission/:id', component: MissionDetailPageComponent, title: 'Istanbul Adventure | Missione', canActivate: [requireMissionZeroCompletion] },
  { path: '**', redirectTo: '' }
];

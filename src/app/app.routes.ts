import { Routes } from '@angular/router';
import { ArchivePageComponent } from './pages/archive-page.component';
import { HomePageComponent } from './pages/home-page.component';
import { LandingPageComponent } from './pages/landing-page.component';
import { MissionDetailPageComponent } from './pages/mission-detail-page.component';
import { QuizPageComponent } from './pages/quiz-page.component';
import { ResultPageComponent } from './pages/result-page.component';
import { StoryPageComponent } from './pages/story-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent, title: 'Istanbul Adventure | Ingresso' },
  { path: 'story', component: StoryPageComponent, title: 'Istanbul Adventure | Prologo' },
  { path: 'quiz', component: QuizPageComponent, title: 'Istanbul Adventure | Missione 0' },
  { path: 'result', component: ResultPageComponent, title: 'Istanbul Adventure | Esito' },
  { path: 'home', component: HomePageComponent, title: 'Istanbul Adventure | Home' },
  { path: 'archive/:section', component: ArchivePageComponent, title: 'Istanbul Adventure | Archivio' },
  { path: 'mission/:id', component: MissionDetailPageComponent, title: 'Istanbul Adventure | Missione' },
  { path: '**', redirectTo: '' }
];

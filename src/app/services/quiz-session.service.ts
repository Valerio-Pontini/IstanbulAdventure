import { Injectable, computed, signal } from '@angular/core';
import { LegacyContentService } from './legacy-content.service';
import { MissionStateService } from './mission-state.service';
import { Category, QuizAnswer, QuizQuestion } from '../models/app.models';

type FeedbackState = {
  text: string;
  nextId: string | null;
  completesQuiz: boolean;
};

@Injectable({ providedIn: 'root' })
export class QuizSessionService {
  private readonly storyIndexSignal = signal(0);
  private readonly currentQuestionIdSignal = signal<string | null>(null);
  private readonly completedPrimaryCountSignal = signal(0);
  private readonly categoryScoresSignal = signal<Record<string, number>>({});
  private readonly categoryTrailSignal = signal<string[]>([]);
  private readonly questionsById: Map<string, QuizQuestion>;
  private readonly resultCategoryIdSignal: ReturnType<typeof signal<string | null>>;
  private readonly freshResultSignal = signal(false);
  private readonly feedbackSignal = signal<FeedbackState | null>(null);
  readonly storySlides: string[];

  readonly storyIndex = this.storyIndexSignal.asReadonly();
  readonly feedback = this.feedbackSignal.asReadonly();
  readonly currentQuestion = computed<QuizQuestion | null>(() => {
    const id = this.currentQuestionIdSignal();
    return id ? this.questionsById.get(id) ?? null : null;
  });
  readonly questionProgress = computed(() => {
    const total = this.content.quiz.primaryQuestionIds.length || 1;
    return Math.min(100, (this.completedPrimaryCountSignal() / total) * 100);
  });
  readonly questionCounter = computed(() => {
    const currentId = this.currentQuestionIdSignal();
    const ids = this.content.quiz.primaryQuestionIds;
    const currentIndex = currentId && currentId.startsWith('p') ? ids.indexOf(currentId) + 1 : this.completedPrimaryCountSignal();
    return `${Math.max(currentIndex, 1)} / ${ids.length}`;
  });
  readonly resultCategory = computed<Category | null>(() => {
    const categoryId = this.resultCategoryIdSignal();
    return categoryId ? this.content.categories[categoryId] ?? null : null;
  });
  readonly hasFreshResult = this.freshResultSignal.asReadonly();

  constructor(
    private readonly content: LegacyContentService,
    private readonly state: MissionStateService
  ) {
    this.questionsById = new Map(this.content.quiz.questions.map((question) => [question.id, question]));
    this.resultCategoryIdSignal = signal<string | null>(this.state.categoryId());
    this.storySlides = this.content.story.slides;
  }

  reset(): void {
    if (this.state.homeUnlocked()) {
      this.resultCategoryIdSignal.set(this.state.categoryId());
      this.currentQuestionIdSignal.set(null);
      this.feedbackSignal.set(null);
      this.freshResultSignal.set(false);
      return;
    }

    this.storyIndexSignal.set(0);
    this.currentQuestionIdSignal.set(null);
    this.completedPrimaryCountSignal.set(0);
    this.categoryScoresSignal.set({});
    this.categoryTrailSignal.set([]);
    this.feedbackSignal.set(null);
    this.resultCategoryIdSignal.set(this.state.categoryId());
    this.freshResultSignal.set(false);
  }

  startQuiz(): void {
    if (this.state.homeUnlocked()) {
      this.currentQuestionIdSignal.set(null);
      this.feedbackSignal.set(null);
      this.resultCategoryIdSignal.set(this.state.categoryId());
      this.freshResultSignal.set(false);
      return;
    }

    this.completedPrimaryCountSignal.set(0);
    this.categoryScoresSignal.set({});
    this.categoryTrailSignal.set([]);
    this.feedbackSignal.set(null);
    this.currentQuestionIdSignal.set(this.content.quiz.startQuestionId);
    this.freshResultSignal.set(false);
  }

  consumeFreshResult(): void {
    this.freshResultSignal.set(false);
  }

  nextStory(): void {
    const nextIndex = Math.min(this.storyIndexSignal() + 1, this.storySlides.length - 1);
    this.storyIndexSignal.set(nextIndex);
  }

  previousStory(): void {
    const nextIndex = Math.max(this.storyIndexSignal() - 1, 0);
    this.storyIndexSignal.set(nextIndex);
  }

  answer(answer: QuizAnswer): void {
    const currentId = this.currentQuestionIdSignal();
    if (!currentId) {
      return;
    }

    if (currentId.startsWith('p')) {
      this.completedPrimaryCountSignal.update((count) => count + 1);
    }

    if (answer.categoryId) {
      this.categoryScoresSignal.update((scores) => ({
        ...scores,
        [answer.categoryId as string]: (scores[answer.categoryId as string] ?? 0) + 1
      }));
      this.categoryTrailSignal.update((trail) => [...trail, answer.categoryId as string]);
    }

    if (answer.feedback) {
      this.feedbackSignal.set({
        text: answer.feedback,
        nextId: answer.nextId ?? null,
        completesQuiz: !answer.nextId
      });
      return;
    }

    if (answer.nextId) {
      this.goToNextOrComplete(answer.nextId);
      return;
    }

    this.completeQuiz();
  }

  dismissFeedback(): void {
    const feedback = this.feedbackSignal();
    this.feedbackSignal.set(null);

    if (!feedback) {
      return;
    }

    if (feedback.nextId) {
      this.goToNextOrComplete(feedback.nextId);
      return;
    }

    if (feedback.completesQuiz) {
      this.completeQuiz();
    }
  }

  private completeQuiz(): void {
    const categoryId = this.resolveCategoryId();
    this.resultCategoryIdSignal.set(categoryId);
    this.currentQuestionIdSignal.set(null);
    this.freshResultSignal.set(true);
    this.state.markHomeUnlocked(categoryId);
  }

  private goToNextOrComplete(nextId: string): void {
    if (this.questionsById.has(nextId)) {
      this.currentQuestionIdSignal.set(nextId);
      return;
    }

    this.completeQuiz();
  }

  private resolveCategoryId(): string | null {
    const validIds = Object.keys(this.content.categories);
    const scores = this.categoryScoresSignal();
    const candidates = Object.entries(scores).filter(([categoryId]) => validIds.includes(categoryId));

    if (!candidates.length) {
      return this.state.categoryId() ?? validIds[0] ?? null;
    }

    const topScore = Math.max(...candidates.map(([, score]) => score));
    const tied = candidates.filter(([, score]) => score === topScore).map(([categoryId]) => categoryId);
    const trail = this.categoryTrailSignal();

    for (let index = trail.length - 1; index >= 0; index -= 1) {
      if (tied.includes(trail[index])) {
        return trail[index];
      }
    }

    return tied[0] ?? null;
  }
}

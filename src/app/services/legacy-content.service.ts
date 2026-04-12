import { Injectable } from '@angular/core';
import {
  Category,
  HomeCopy,
  MissionItem,
  QuizAnswer,
  QuizContent,
  QuizQuestion,
  ResultContent,
  StoryContent
} from '../models/app.models';

declare global {
  interface Window {
    APP_TEXT?: {
      it?: {
        ui?: Record<string, unknown>;
        content?: {
          app?: { storySlides?: string[] };
          quiz?: { tapToContinueLabel?: string; completion?: { title?: string; text?: string }; questionsById?: Record<string, unknown> };
          result?: ResultContent;
          home?: HomeCopy;
        };
      };
    };
    QUIZ_CONTENT?: { startQuestionId?: string; tapToContinueLabel?: string; completion?: { title?: string; text?: string }; questions?: unknown[] };
    QUIZ_FLOW?: { primary?: string[] };
    MISSION_ZERO_RESULT_CONTENT?: ResultContent;
    MISSION_HOME_CONTENT?: {
      categories?: Record<string, Omit<Category, 'id'>>;
      missions?: {
        all?: MissionItem[];
        general?: MissionItem[];
        locations?: MissionItem[];
        byCategory?: Record<string, MissionItem[]>;
      };
      missionIndex?: Record<string, MissionItem>;
      sections?: HomeCopy['sections'];
      detailView?: HomeCopy['detailView'];
      missionDetail?: HomeCopy['missionDetail'];
      statusLabel?: string;
      hero?: HomeCopy['hero'];
      profileCard?: HomeCopy['profileCard'];
      overview?: HomeCopy['overview'];
    };
  }
}

@Injectable({ providedIn: 'root' })
export class LegacyContentService {
  readonly ui = window.APP_TEXT?.it?.ui ?? {};

  // Keep technical authoring notes out of the user experience.
  readonly story: StoryContent = {
    slides: window.APP_TEXT?.it?.content?.app?.storySlides ?? []
  };

  readonly result: ResultContent = {
    kicker: window.MISSION_ZERO_RESULT_CONTENT?.kicker ?? window.APP_TEXT?.it?.content?.result?.kicker ?? this.t('angular.shellHeader.outcome', 'Esito'),
    title: window.MISSION_ZERO_RESULT_CONTENT?.title ?? window.APP_TEXT?.it?.content?.result?.title ?? 'Il viaggio ha trovato il tuo sguardo',
    text: window.MISSION_ZERO_RESULT_CONTENT?.text ?? '',
    cardNote: '',
    homeButtonLabel: window.MISSION_ZERO_RESULT_CONTENT?.homeButtonLabel ?? this.t('actions.openHome', 'Apri la home')
  };

  readonly homeCopy: HomeCopy = {
    ...(window.MISSION_HOME_CONTENT ?? {}),
    detailView: window.MISSION_HOME_CONTENT?.detailView ?? {},
    missionDetail: window.MISSION_HOME_CONTENT?.missionDetail ?? {}
  };

  readonly categories = Object.entries(window.MISSION_HOME_CONTENT?.categories ?? {}).reduce<Record<string, Category>>(
    (accumulator, [id, category]) => {
      accumulator[id] = { id, ...category };
      return accumulator;
    },
    {}
  );

  readonly quiz: QuizContent = this.buildQuizContent();

  readonly missions = {
    all: window.MISSION_HOME_CONTENT?.missions?.all ?? [],
    general: window.MISSION_HOME_CONTENT?.missions?.general ?? [],
    locations: window.MISSION_HOME_CONTENT?.missions?.locations ?? [],
    byCategory: window.MISSION_HOME_CONTENT?.missions?.byCategory ?? {},
    index: window.MISSION_HOME_CONTENT?.missionIndex ?? {}
  };

  t(path: string, fallback: string): string {
    const segments = path.split('.').filter(Boolean);
    let current: unknown = this.ui;

    for (const segment of segments) {
      if (!current || typeof current !== 'object') {
        return fallback;
      }
      current = (current as Record<string, unknown>)[segment];
    }

    return typeof current === 'string' && current.trim() ? current : fallback;
  }

  private buildQuizContent(): QuizContent {
    const categories = new Set(Object.keys(this.categories));
    const rawQuestionsById =
      window.APP_TEXT?.it?.content?.quiz?.questionsById ??
      Object.fromEntries(
        (window.QUIZ_CONTENT?.questions ?? []).map((question) => {
          const typedQuestion = question as { id?: string };
          return [typedQuestion.id ?? '', question];
        })
      );

    const questions = Object.entries(rawQuestionsById)
      .filter(([id]) => Boolean(id))
      .map(([id, rawQuestion]) => this.normalizeQuestion(id, rawQuestion, categories));

    return {
      startQuestionId: window.QUIZ_CONTENT?.startQuestionId ?? 'p1',
      primaryQuestionIds:
        window.QUIZ_FLOW?.primary ?? questions.filter((question) => question.id.startsWith('p')).map((question) => question.id),
      tapToContinueLabel: window.QUIZ_CONTENT?.tapToContinueLabel ?? this.t('angular.common.continue', 'Continua'),
      completion: window.QUIZ_CONTENT?.completion,
      questions
    };
  }

  private normalizeQuestion(questionId: string, rawQuestion: unknown, categoryIds: Set<string>): QuizQuestion {
    const source = rawQuestion as { text?: string; prompt?: string; answers?: unknown[]; feedback?: string | null; nextId?: string | null };
    const answers = (source.answers ?? []).map((answer) =>
      this.normalizeAnswer(answer, categoryIds, source.feedback ?? null, source.nextId ?? null)
    );

    return {
      id: questionId,
      text: source.prompt ?? source.text ?? '',
      answers: this.compactContinuationAnswers(answers)
    };
  }

  private normalizeAnswer(
    rawAnswer: unknown,
    categoryIds: Set<string>,
    inheritedFeedback: string | null,
    inheritedNextId: string | null
  ): QuizAnswer {
    if (typeof rawAnswer === 'string') {
      return this.createAnswer(rawAnswer, inheritedNextId, inheritedFeedback, null, categoryIds);
    }

    const source = rawAnswer as { label?: string; nextId?: string | null; feedback?: string | null; categoryId?: string | null };
    const derivedNextId = source.nextId ?? (this.isQuestionId(source.label) ? source.label ?? null : inheritedNextId);
    const derivedLabel = this.isQuestionId(source.label) && !source.nextId
      ? this.t('angular.common.continue', 'Continua')
      : source.label ?? '';

    return this.createAnswer(
      derivedLabel,
      derivedNextId,
      source.feedback ?? inheritedFeedback,
      source.categoryId ?? null,
      categoryIds
    );
  }

  private createAnswer(
    label: string,
    nextId: string | null,
    feedback: string | null,
    categoryId: string | null,
    categoryIds: Set<string>
  ): QuizAnswer {
    const prefix = nextId?.split('_')[0] ?? null;
    return {
      label,
      nextId,
      feedback,
      categoryId: categoryId ?? (prefix && categoryIds.has(prefix) ? prefix : null)
    };
  }

  private compactContinuationAnswers(answers: QuizAnswer[]): QuizAnswer[] {
    if (!answers.length) {
      return answers;
    }

    const allAreContinuationButtons = answers.every((answer) => answer.label === 'Continua' && !!answer.nextId);
    if (!allAreContinuationButtons) {
      return answers;
    }

    const unique = new Map<string, QuizAnswer>();
    answers.forEach((answer) => {
      const key = `${answer.label}|${answer.nextId}|${answer.feedback ?? ''}`;
      if (!unique.has(key)) {
        unique.set(key, answer);
      }
    });

    return [...unique.values()];
  }

  private isQuestionId(value?: string): boolean {
    return typeof value === 'string' && /^(p\d+|[a-z]+_\d+)$/i.test(value);
  }
}

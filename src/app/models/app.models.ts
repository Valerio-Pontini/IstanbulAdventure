export type SectionKey = 'general' | 'locations' | 'personal';

export type QuizAnswer = {
  label: string;
  nextId?: string | null;
  feedback?: string | null;
  categoryId?: string | null;
};

export type QuizQuestion = {
  id: string;
  text: string;
  answers: QuizAnswer[];
};

export type QuizAnswerReview = {
  questionId: string;
  questionText: string;
  answerLabel: string;
  feedbackText: string | null;
};

export type QuizContent = {
  startQuestionId: string;
  primaryQuestionIds: string[];
  tapToContinueLabel: string;
  completion?: {
    title?: string;
    text?: string;
  };
  questions: QuizQuestion[];
};

export type StoryContent = {
  slides: string[];
};

export type ResultContent = {
  kicker: string;
  title: string;
  text: string;
  cardNote?: string;
  homeButtonLabel?: string;
};

export type Category = {
  id: string;
  title: string;
  shortLabel: string;
  description: string;
  iconSrc?: string;
  iconAlt?: string;
};

export type MissionSequence = {
  isSequential: boolean;
  isStandalone: boolean;
  name: string | null;
  nextMissionId: string | null;
  hasPrevious: boolean;
  hasNext: boolean;
  isStart: boolean;
  isEnd: boolean;
  statusLabel: string;
};

export type MissionFilterValues = {
  place: string;
  type: string;
  theme: string;
  difficulty: string;
  budget: string;
  duration: string;
};

export type MissionFilterLabels = MissionFilterValues;

export type MissionItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  locationLabel: string;
  typeLabel: string;
  groupText: string;
  discovery: string;
  information: string;
  completionMode: string;
  completionLabel: string;
  theme: string;
  themeLabel: string;
  secondaryThemes: string[];
  secondaryThemeLabels: string[];
  keywords: string[];
  difficulty: number;
  difficultyLabel: string;
  points: number;
  durationMin: number;
  durationLabel: string;
  budgetTry: number;
  budgetLabel: string;
  sectionKey: 'general' | 'locations';
  availableForCategoryIds: string[];
  highlightForCategoryIds: string[];
  isPersonalized: boolean;
  sequence: MissionSequence;
  validationType: string | null;
  validationCriteria: string[];
  sortPriority: number;
  filterValues: MissionFilterValues;
  filterLabels: MissionFilterLabels;
  searchIndex: string;
  meta: string;
  iconSrc: string;
  iconAlt: string;
};

export type MissionObjective = {
  id: string;
  title: string;
  description: string;
  discovery: string;
  validationCriteria: string[];
  completionLabel: string;
  points: number;
};

export type MissionBundle = {
  id: string;
  slug: string;
  title: string;
  description: string;
  context: string;
  locationLabel: string;
  typeLabel: string;
  themeLabel: string;
  secondaryThemeLabels: string[];
  difficulty: number;
  difficultyLabel: string;
  durationMin: number;
  durationLabel: string;
  budgetTry: number;
  budgetLabel: string;
  meta: string;
  iconSrc: string;
  iconAlt: string;
  searchIndex: string;
  filterValues: MissionFilterValues;
  filterLabels: MissionFilterLabels;
  availableForCategoryIds: string[];
  highlightForCategoryIds: string[];
  sortPriority: number;
  isSequential: boolean;
  isStandalone: boolean;
  sequenceName: string | null;
  objectiveCount: number;
  missionIds: string[];
  objectives: MissionObjective[];
};

export type UserMissionState = {
  completedMissionIds: string[];
  savedMissionIds: string[];
  hiddenMissionIds: string[];
  personality?: string;
};

export type MissionFilterState = {
  search: string;
  place: string;
  type: string;
  theme: string;
  difficulty: string;
  budget: string;
  duration: string;
};

export type FilterOption = {
  value: string;
  label: string;
  count: number;
};

export type HomeCopy = {
  statusLabel?: string;
  hero?: {
    kicker?: string;
    title?: string;
    text?: string;
  };
  profileCard?: {
    kicker?: string;
    fallbackTitle?: string;
    fallbackText?: string;
  };
  overview?: {
    title?: string;
    text?: string;
    stats?: {
      totalLabel?: string;
      generalLabel?: string;
      locationLabel?: string;
      personalLabel?: string;
    };
  };
  detailView?: {
    backLabel?: string;
    filterTitle?: string;
    emptyTitle?: string;
    emptyText?: string;
  };
  missionDetail?: Record<string, string | undefined>;
  sections?: Partial<Record<SectionKey, { kicker?: string; title?: string; text?: string; detailTitle?: string; anchorLabel?: string }>>;
};

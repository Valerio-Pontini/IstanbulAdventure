export type UserMissionState = {
  completedMissionIds: string[];
  savedMissionIds: string[];
  hiddenMissionIds?: string[];
  personality?: string;
};

export type MissionAudience =
  | { mode: "all"; categoryIds: []; label: string }
  | { mode: "include" | "exclude"; categoryIds: string[]; label: string };

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

export type MissionFilterLabels = {
  place: string;
  type: string;
  theme: string;
  difficulty: string;
  budget: string;
  duration: string;
};

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
  sectionKey: "general" | "locations";
  audience: MissionAudience;
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

export type MissionFilterState = {
  search: string;
  personality: string;
  place: string;
  type: string;
  theme: string;
  difficulty: string;
  budget: string;
  duration: string;
};

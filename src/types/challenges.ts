export interface ChallengeContainerProps {
  challengeId: string;
  title: string;
  description: string;
  theme: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimit?: number;
  requiredSkills: string[];
  onComplete: (result: ChallengeResult) => void;
  onHint: (hintLevel: number) => void;
  children: React.ReactNode;
}

export interface ChallengeState {
  currentChallenge: number;
  score: number;
  timeSpent: number;
  attempts: number;
  hints: number;
  completed: boolean;
  mistakes: string[];
  startTime: number;
}

export interface ScoreCalculation {
  basePoints: number;
  timeBonus: number;
  accuracyBonus: number;
  hintPenalty: number;
  mistakePenalty: number;
  difficultyMultiplier: number;
  finalScore: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked?: boolean;
  unlockedAt?: Date;
}

export interface UserStats {
  totalChallengesCompleted: number;
  averageScore: number;
  totalTimeSpent: number;
  perfectScores: number;
  hintsUsed: number;
  mistakesMade: number;
  speedRecords: number[];
}

export interface DifficultyModifier {
  timeLimit: number;
  numberOfOptions: number;
  distractorComplexity: 'low' | 'medium' | 'high';
  hintAvailability: boolean;
  multipleAttempts: boolean;
}

export interface FeedbackMessage {
  type: 'success' | 'error' | 'hint' | 'encouragement';
  title: string;
  message: string;
  actionable: boolean;
  nextSteps?: string[];
}

export interface ChallengeDashboard {
  totalChallengesCompleted: number;
  averageScore: number;
  timeSpent: number;
  achievements: Achievement[];
  strongAreas: string[];
  improvementAreas: string[];
}

export interface Recipe {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: RecipeStep[];
  timeLimit: number;
  description: string;
}

export interface RecipeStep {
  id: string;
  instruction: string;
  order: number;
  category: 'prep' | 'cook' | 'combine' | 'serve';
  icon: string;
}

export interface VariableBox {
  id: string;
  name: string;
  value: any;
  type: string;
  locked: boolean;
}

export interface DataClue {
  id: string;
  value: any;
  correctType: string;
  category: string;
  difficulty: number;
}

export interface OperationChain {
  id: string;
  steps: OperationStep[];
  expectedResult: any;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface OperationStep {
  id: string;
  operation: string;
  operands: any[];
  result?: any;
  operator: '+' | '-' | '*' | '/' | '%' | '**' | '==' | '!=' | '<' | '>' | 'and' | 'or' | 'not';
}

// Extended Challenge System Interfaces
export interface ChallengeResult {
  score: number;
  timeSpent: number;
  hintsUsed: number;
  efficiency: number;
  accuracy: number;
  completed: boolean;
  solutions: any[];
  perfectSolution?: boolean;
}

export interface TestCase {
  input: any;
  expectedOutput: any;
  description: string;
  points: number;
  hidden?: boolean;
}

export interface SubChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  testCases: TestCase[];
  starterCode?: string;
  hints: HintLevel[];
  maxScore: number;
}

export interface HintLevel {
  level: number;
  type: 'conceptual' | 'methodological' | 'implementation' | 'solution';
  content: string;
  penaltyPercent: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  theme: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  prerequisites: string[];
  skills: string[];
  completionRate?: number;
  averageScore?: number;
  userStatus: 'locked' | 'available' | 'in-progress' | 'completed';
  subChallenges: SubChallenge[];
  maxScore: number;
}

export interface UserProgress {
  challengesCompleted: number;
  totalChallenges: number;
  currentLevel: number;
  experience: number;
  nextLevelExp: number;
  skills: SkillProgress;
  achievements: Achievement[];
}

export interface SkillProgress {
  listCreation: SkillLevel;
  dataManipulation: SkillLevel;
  algorithmicThinking: SkillLevel;
  problemSolving: SkillLevel;
}

export interface SkillLevel {
  level: number;
  experience: number;
  nextLevelExp: number;
  capabilities: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

export interface PerformanceMetrics {
  executionTime: number;
  memoryUsage: number;
  complexity: string;
  efficiency: number;
}

export interface ChallengeSession {
  challengeId: string;
  startTime: Date;
  endTime?: Date;
  attempts: number;
  hintsUsed: number;
  currentSubChallenge: number;
  solutions: { [subChallengeId: string]: string };
  progress: { [subChallengeId: string]: boolean };
}

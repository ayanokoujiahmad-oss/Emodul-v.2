export type UserRole = 'guru' | 'siswa';

export interface UserProfile {
  uid: string;
  role: UserRole;
  displayName: string;
  username?: string;
  guruId?: string; // links student to teacher
  avatarEmoji?: string;
  avatar?: string; // fallback alias for student avatar
  createdAt: any;
  email?: string;
  classId?: string;
  lastLogin?: any;
  isPenguji?: boolean; // flags examiner/dosen accounts to unlock all topics
}

export interface StudentAccount {
  id: string;
  username: string;
  passwordHash: string;
  password?: string; // simple unhashed password for print cards
  guruId: string;
  studentUid?: string;
  linkedUid?: string;
  createdAt: any;
  status?: string;
  displayName?: string;
  classId?: string;
}

export interface Classroom {
  id: string;
  name: string;
  guruId: string;
  createdAt: any;
}

export type TopicStepType =
  | 'tujuan'
  | 'kata-kunci'
  | 'peta-materi'
  | 'bersiap-belajar'
  | 'tantangan-awal'
  | 'yuk-belajar'
  | 'ayo-memahami'
  | 'ayo-mengamati'
  | 'ayo-bereksplorasi'
  | 'uji-pemahaman'
  | 'refleksi'
  | 'custom-komitmen'
  | 'ayo-cari-tahu'
  | 'mc';

export interface Question {
  id: string;
  type: 'mc' | 'essay' | 'reflective';
  question: string;
  options?: { id: string; text: string; isCorrect?: boolean }[];
  correctAnswer?: string;
  points: number;
  imageUrl?: string;
  context?: string;
  explanation?: string;
}

export interface TopicStep {
  type: TopicStepType;
  title: string;
  content: string;
  id?: string;
  question?: string;
  options?: { id: string; text: string; isCorrect?: boolean }[];
  points?: number;
  questions?: Question[];
  simulationId?: string;
  instruction?: string;
  exampleInput?: string;
  isGradable?: boolean;
  rubricCriteria?: RubricCriterion[];
  passage?: string; // Cerita pengantar untuk kuis/latihan
  mediaType?: 'none' | 'image' | 'youtube';
  mediaUrl?: string;
  mediaLayout?: 'above' | 'below' | 'side';
  comics?: string[];
}

export interface Topic {
  id: string; // 'topik-1'
  number: number; // 1
  title: string;
  description: string;
  icon: string;
  color: string;
  steps: TopicStep[];
  badgeId: string;
  backgroundImageUrl?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
}

export interface StudentProgress {
  id: string;
  uid?: string;
  studentUid: string;
  moduleId: string;
  topicId: string;
  currentStep: number; // 0-9
  status: 'locked' | 'active' | 'completed';
  score: number;
  finalScore?: number;
  quizScore?: number;
  quizCorrect?: number;
  quizTotal?: number;
  scoreStatus?: 'pending_teacher' | 'final';
  submissionStatus?: 'draft' | 'submitted';
  badges: string[];
  startedAt?: any;
  completedAt?: any;
  submittedAt?: any;
  gradedAt?: any;
  badgeEarned?: boolean; // added for dashboard mapping
  timeSpentSeconds?: number;
}

export interface StudentTopicResponse {
  id: string;
  studentUid: string;
  topicId: string;
  moduleId: string;
  step: number;
  answers: Record<string, string | string[]>;
  simulationResult?: SimulationResult;
  lastSaved: any;
  isDraft: boolean;

  // Added for teacher grading compatibility
  uid?: string; // student uid
  mcAnswers?: { correct: boolean; answer: string }[];
  textAnswers?: { answer: string }[];
  simulationScore?: number;
  quizScore?: number;
  quizCorrect?: number;
  quizTotal?: number;
  submittedAt?: any;
}

export interface SimulationResult {
  simulationId: string;
  score: number;
  maxScore: number;
  decisions: { scenarioId: string; choice: string; isCorrect: boolean }[];
  completedAt: any;
}

export type RubricLevel = 'sangat-baik' | 'baik' | 'cukup' | 'perlu-bimbingan';

export interface RubricCriterion {
  id: string;
  name: string;
  description?: string;
  weight: number; // percentage
  levels?: Record<number, string>;
}

export interface RubricScore {
  criterionId: string;
  level: RubricLevel;
  numericValue: number; // 4, 3, 2, 1
}

export interface RubricCriteria {
  id: string;
  name: string;
  weight: number;
  score: number;
  levels?: Record<number, string>;
}

export interface TopicGrade {
  id?: string;
  uid: string;
  studentUid?: string;
  studentName?: string;
  topicId: string;
  guruId?: string;
  gradedBy?: string;
  rubric: RubricCriteria[];
  rubricScores?: RubricScore[];
  finalScore: number;
  feedback: string;
  gradedAt: any;
  activityGrades?: Record<number, { scores: Record<string, number>; feedback?: string }>;
  manualOverrideScore?: number;
}

export interface ModuleGrade {
  id: string;
  studentUid: string;
  moduleId: string;
  preTestScore: number;
  postTestScore: number;
  totalScore: number; // added for Recharts grade distribution
  nGainScore: number;
  completedAt: any;
  nGain?: number; // alias
}

export interface ModuleSettings {
  guruId: string;
  topicLocks: Record<string, boolean>; // topicId -> locked
  updatedAt: any;
}

export type TeacherSettings = ModuleSettings; // alias

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  imageUrl?: string;
  videoUrl?: string;
  color: string;
  topicId?: string;
  requirement: string;
}

export interface GalleryItem {
  id: string;
  uid?: string;
  studentUid?: string; // compatibility
  guruId?: string;
  displayName?: string;
  studentName?: string; // compatibility
  avatar?: string;
  topicId: string;
  topicTitle: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: 'text' | 'image' | 'video';
  thumbsUp?: string[];
  hearts?: string[];
  comments?: GalleryComment[];
  sharedAt: any;
  createdAt?: any;
  appreciations?: {
    thumbs: number;
    hearts: number;
    comments: number;
  };
  likedBy?: string[];
  heartedBy?: string[];
  thumbsBy?: string[];
  heartsBy?: string[];
  status?: 'pending' | 'approved' | 'rejected';
  campaignTitle?: string;
  workLink?: string;
}

export type GalleryEntry = GalleryItem;

export interface GalleryComment {
  id: string;
  uid?: string;
  authorUid?: string;
  displayName?: string;
  authorName?: string;
  avatar?: string;
  text: string;
  createdAt: any;
}

export interface OfflineQueueItem {
  id: string;
  collection: string;
  docId: string;
  data: Record<string, unknown>;
  operation: 'set' | 'update';
  timestamp: number;
}

export interface ActivityLog {
  id: string;
  studentName: string;
  action: string;
  topicTitle: string;
  timestamp: any;
  studentUid?: string;
  guruId?: string;
}

export interface LearningObjective {
  id: string;
  text: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface RoadmapStep {
  id: string;
  number: number;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
}

export interface MCQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  imageUrl?: string;
  context?: string;
}

export interface EssayQuestion {
  id: string;
  question: string;
  maxScore?: number;
  rubricHints?: string[];
  imageUrl?: string;
  context?: string;
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
}

export interface CaseStudy {
  title: string;
  scenario: string;
  questions: string[];
  imageUrl?: string;
}

export interface SimulationInfo {
  type: string;
  title: string;
  description: string;
}

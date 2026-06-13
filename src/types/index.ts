export interface QuizAnswers {
  skills: string[];
  dreamRole: string;
  targetCompany: string;
  studyHours: number;
  currentYear: string;
}

export interface RoadmapWeek {
  week: number;
  topic: string;
  resources: string;
  estimatedHours: number;
}

export interface Roadmap {
  skillGaps: string[];
  weeks: RoadmapWeek[];
}

export interface DSAQuestion {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  leetcodeUrl: string;
}

export interface LearningResource {
  name: string;
  learn: string;
  isFree: boolean;
  url: string;
  category: 'dsa' | 'aiml' | 'web' | 'app';
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  targetRole: string;
  roadmapProgress: number;
  dsaSolved: number;
  streakDays: number;
}

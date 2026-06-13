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

export interface RoadmapMilestone {
  title: string;
  description: string;
  estimatedHours: number;
}

export interface RoadmapProject {
  name: string;
  description: string;
  estimatedHours: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface RoadmapResource {
  type: 'video' | 'article' | 'course';
  title: string;
  url?: string;
}

export interface EnhancedRoadmapWeek extends RoadmapWeek {
  milestones?: RoadmapMilestone[];
  projects?: RoadmapProject[];
  resources?: RoadmapResource[];
  keyTopics?: string[];
}

export interface EnhancedRoadmap extends Roadmap {
  weeks: EnhancedRoadmapWeek[];
}

export interface GithubProfile {
  username: string;
  repositories: number;
  stars: number;
  followers: number;
  languages: string[];
}

export interface LinkedInProfile {
  profileUrl: string;
  headline: string;
  skills: string[];
  endorsements: Record<string, number>;
}

export interface SkillGap {
  skill: string;
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  requiredLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  priority: 'Must' | 'Should' | 'Nice';
  suggestedResources: RoadmapResource[];
  timelineWeeks: number;
}

export interface ProfileAnalysisResult {
  github?: GithubProfile;
  linkedin?: LinkedInProfile;
  skillGaps: SkillGap[];
  recommendations: string[];
  overallScore: number;
  strengthAreas: string[];
  improvementAreas: string[];
}

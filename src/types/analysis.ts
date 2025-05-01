
export interface ResumeImprovement {
  section: string;
  suggestions: string[];
}

export interface LearningResource {
  title: string;
  provider: string;
  link: string;
  duration: string;
}

export interface LearningPath {
  skill: string;
  resources: LearningResource[];
}

export interface AnalysisData {
  matchingSkills: string[];
  missingSkills: string[];
  irrelevantSkills: string[];
  resumeImprovements: ResumeImprovement[];
  learningPaths: LearningPath[];
  loading: boolean;
}

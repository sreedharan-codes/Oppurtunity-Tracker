export type UserRole = 'student' | 'admin';

export type OpportunityType = 'Internship' | 'Hackathon' | 'Workshop' | 'Certification' | 'Competition';

export type OpportunityMode = 'Online' | 'Offline' | 'Hybrid';

export type OpportunityDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type OpportunityPublishStatus = 'published' | 'draft' | 'archived';

export type ApplicationStatus = 'Interested' | 'Applied' | 'Shortlisted' | 'Completed';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  college: string;
  course: string;
  year: string;
  skills: string[];
  targetSkills?: string[]; // Skills the student is willing to learn next
  achievements?: string[]; // Awards, hackathon placements, certifications
  interests: string[];
  preferredTypes: OpportunityType[];
  preferredMode: OpportunityMode | 'Any';
  role: UserRole;
  leaderboardScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardStudent {
  id: string;
  name: string;
  photoURL?: string;
  college: string;
  course: string;
  year: string;
  skills: string[];
  achievements: string[];
  score: number;
  rank?: number;
  badge?: string;
  completedCount: number;
  appliedCount: number;
  isCurrentUser?: boolean;
}

export interface UniversityLeaderboard {
  rank: number;
  university: string;
  logo?: string;
  totalScore: number;
  activeStudents: number;
  topSkills: string[];
  totalAchievements: number;
}

export interface CourseRecommendation {
  id: string;
  title: string;
  provider: string; // e.g., 'YouTube', 'Coursera', 'Google Cloud', 'freeCodeCamp', 'AWS'
  type: 'youtube' | 'certified';
  skillsCovered: string[];
  targetSkillMatch?: string; // which skill this fulfills
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  reviewCount: number;
  url: string;
  thumbnailUrl: string;
  instructor?: string;
  certificateOffered: boolean;
  free: boolean;
  description: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  organizationLogo: string;
  description: string;
  type: OpportunityType;
  skills: string[];
  eligibility: string;
  location: string;
  mode: OpportunityMode;
  difficulty: OpportunityDifficulty;
  deadline: string; // ISO date string YYYY-MM-DD
  applicationUrl: string;
  postedAt: string;
  status: OpportunityPublishStatus;
  stipendOrPrize?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  bookmarkCount?: number;
}

export interface Application {
  id: string;
  userId: string;
  opportunityId: string;
  status: ApplicationStatus;
  notes?: string;
  appliedDate?: string;
  createdAt: string;
  updatedAt: string;
  opportunity?: Opportunity;
}

export interface Bookmark {
  id: string;
  userId: string;
  opportunityId: string;
  createdAt: string;
  opportunity?: Opportunity;
}

export interface MatchScore {
  percentage: number;
  reason: string;
  matchedSkills: string[];
  scoreType: 'high' | 'medium' | 'moderate' | 'low';
}

export interface FilterState {
  searchQuery: string;
  types: OpportunityType[];
  skills: string[];
  deadlineRange: 'all' | 'today' | 'this_week' | 'this_month' | 'later';
  mode: 'all' | OpportunityMode;
  difficulty: 'all' | OpportunityDifficulty;
  sortBy: 'deadline' | 'newest' | 'bookmarked' | 'recommended';
}

import { LeaderboardStudent, UniversityLeaderboard, UserProfile, Application, Bookmark } from '../types';

export const INITIAL_UNIVERSITY_LEADERBOARD: UniversityLeaderboard[] = [
  {
    rank: 1,
    university: 'Stanford University',
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&auto=format&fit=crop&q=80',
    totalScore: 28450,
    activeStudents: 42,
    topSkills: ['AI/ML', 'Python', 'React', 'TypeScript', 'System Design'],
    totalAchievements: 118,
  },
  {
    rank: 2,
    university: 'Massachusetts Institute of Technology (MIT)',
    logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&auto=format&fit=crop&q=80',
    totalScore: 27900,
    activeStudents: 38,
    topSkills: ['Quantum Computing', 'Deep Learning', 'Rust', 'Algorithms', 'Robotics'],
    totalAchievements: 124,
  },
  {
    rank: 3,
    university: 'UC Berkeley',
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100&auto=format&fit=crop&q=80',
    totalScore: 24320,
    activeStudents: 35,
    topSkills: ['Cloud Infrastructure', 'Go', 'Kubernetes', 'Web3', 'Data Science'],
    totalAchievements: 95,
  },
  {
    rank: 4,
    university: 'Carnegie Mellon University (CMU)',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&auto=format&fit=crop&q=80',
    totalScore: 23150,
    activeStudents: 31,
    topSkills: ['Cybersecurity', 'C++', 'Computer Vision', 'Distributed Systems'],
    totalAchievements: 88,
  },
  {
    rank: 5,
    university: 'Harvard University',
    logo: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=100&auto=format&fit=crop&q=80',
    totalScore: 21800,
    activeStudents: 29,
    topSkills: ['Bioinformatics', 'Python', 'NLP', 'Data Ethics'],
    totalAchievements: 82,
  },
  {
    rank: 6,
    university: 'Georgia Institute of Technology',
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&auto=format&fit=crop&q=80',
    totalScore: 19450,
    activeStudents: 26,
    topSkills: ['DevOps', 'AWS', 'Machine Learning', 'Linux'],
    totalAchievements: 74,
  },
  {
    rank: 7,
    university: 'University of Washington',
    logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&auto=format&fit=crop&q=80',
    totalScore: 18200,
    activeStudents: 24,
    topSkills: ['Cloud Computing', 'TypeScript', 'React', 'Large Language Models'],
    totalAchievements: 68,
  },
  {
    rank: 8,
    university: 'IIT Bombay',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&auto=format&fit=crop&q=80',
    totalScore: 17950,
    activeStudents: 25,
    topSkills: ['Algorithms', 'C++', 'System Architecture', 'AI/ML'],
    totalAchievements: 71,
  },
];

export const INITIAL_STUDENT_LEADERBOARD: LeaderboardStudent[] = [
  {
    id: 'student-1',
    name: 'Elena Rostova',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    college: 'Massachusetts Institute of Technology (MIT)',
    course: 'M.S. in Artificial Intelligence',
    year: 'Graduate',
    skills: ['Python', 'Deep Learning', 'PyTorch', 'Rust', 'Transformers', 'CUDA'],
    achievements: [
      'NeurIPS 2025 Best Student Workshop Paper',
      'Google DeepMind Fellowship Awardee',
      '1st Place MIT Hackathon 2025',
      'Published 2 Open-Source LLM Toolkits',
    ],
    score: 4950,
    badge: 'Legendary Scholar 🏆',
    completedCount: 5,
    appliedCount: 8,
  },
  {
    id: 'student-2',
    name: 'Devon Vance',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    college: 'UC Berkeley',
    course: 'B.S. in Electrical Engineering & CS',
    year: '4th Year',
    skills: ['Go', 'Kubernetes', 'Docker', 'React', 'Distributed Systems', 'gRPC'],
    achievements: [
      'CalHacks 11.0 Grand Winner ($25k)',
      'CNCF Kubernetes Contributor Badge',
      'AWS Certified Solutions Architect',
    ],
    score: 4680,
    badge: 'Grandmaster Architect ⚡',
    completedCount: 4,
    appliedCount: 7,
  },
  {
    id: 'student-3',
    name: 'Priya Sharma',
    photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    college: 'Stanford University',
    course: 'B.S. in Computer Science',
    year: '3rd Year',
    skills: ['TypeScript', 'Next.js', 'PostgreSQL', 'Tailwind CSS', 'GraphQL', 'System Design'],
    achievements: [
      'TreeHacks 2026 AI Track 1st Place',
      'Open Source Lead (15k GitHub Stars project)',
      'Stanford Women in Tech Fellowship',
    ],
    score: 4420,
    badge: 'Pioneer Vanguard 💎',
    completedCount: 4,
    appliedCount: 6,
  },
  {
    id: 'student-4',
    name: 'Marcus Sterling',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    college: 'Carnegie Mellon University (CMU)',
    course: 'B.S. in Information Security',
    year: '4th Year',
    skills: ['Cybersecurity', 'C++', 'Linux Kernel', 'Reverse Engineering', 'Cryptography'],
    achievements: [
      'DEFCON CTF Top 10 Team Member',
      'Published CVE in Open-Source Protocol',
      'Offensive Security Certified Professional (OSCP)',
    ],
    score: 4210,
    badge: 'Cyber Titan 🛡️',
    completedCount: 3,
    appliedCount: 5,
  },
  {
    id: 'student-5',
    name: 'Chloe Zhang',
    photoURL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    college: 'Harvard University',
    course: 'B.A. in Computer Science & Statistics',
    year: '3rd Year',
    skills: ['Python', 'SQL', 'R', 'Data Science', 'Tableau', 'Bioinformatics'],
    achievements: [
      'Harvard Data Venture Fellow',
      'Published in Computational Biology Journal',
      'Broad Institute Research Intern',
    ],
    score: 3980,
    badge: 'Elite Analyst 📊',
    completedCount: 3,
    appliedCount: 5,
  },
  {
    id: 'student-6',
    name: 'Rohan Mehta',
    photoURL: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    college: 'IIT Bombay',
    course: 'B.Tech in Computer Science',
    year: '4th Year',
    skills: ['C++', 'Competitive Programming', 'Algorithms', 'Machine Learning'],
    achievements: [
      'ICPC Regional Contest Gold Medalist',
      'Codeforces International Grandmaster',
      'Smart India Hackathon Finalist',
    ],
    score: 3840,
    badge: 'Code Dynamo 🚀',
    completedCount: 3,
    appliedCount: 4,
  },
  {
    id: 'student-7',
    name: 'Amina Al-Mansoor',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    college: 'Georgia Institute of Technology',
    course: 'B.S. in Computer Science',
    year: '2nd Year',
    skills: ['Java', 'Cloud Computing', 'AWS', 'Spring Boot', 'Docker'],
    achievements: [
      'AWS Certified Cloud Practitioner',
      'HackGT Most Innovative Cloud Architecture',
    ],
    score: 3510,
    badge: 'Cloud Pioneer ☁️',
    completedCount: 2,
    appliedCount: 4,
  },
  {
    id: 'student-8',
    name: 'Liam O\'Connor',
    photoURL: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    college: 'University of Washington',
    course: 'B.S. in Human-Centered Design & CS',
    year: '3rd Year',
    skills: ['React', 'Figma', 'UI/UX', 'TypeScript', 'Web Accessibility'],
    achievements: [
      'Apple Design Student Showcase Finalist',
      'Built Accessibility Extension with 10k users',
    ],
    score: 3340,
    badge: 'Design Innovator ✨',
    completedCount: 2,
    appliedCount: 3,
  },
];

/**
 * Calculates a dynamic leaderboard score for the current user based on:
 * - Verified skills: +120 pts each
 * - Target skills added (willingness to learn): +60 pts each
 * - Achievements & awards: +300 pts each
 * - Completed opportunities: +350 pts each
 * - Active applications: +180 pts each
 * - Saved bookmarks: +40 pts each
 */
export function computeUserLeaderboardScore(
  user: UserProfile | null,
  applications: Application[] = [],
  bookmarks: Bookmark[] = []
): { score: number; breakdown: { label: string; points: number; count: number }[] } {
  if (!user) {
    return {
      score: 1250,
      breakdown: [
        { label: 'Guest Discovery Points', points: 1250, count: 1 },
      ],
    };
  }

  const skillsCount = user.skills?.length || 0;
  const skillsPts = skillsCount * 120;

  const targetSkillsCount = user.targetSkills?.length || 0;
  const targetSkillsPts = targetSkillsCount * 60;

  const achievementsCount = user.achievements?.length || 0;
  const achievementsPts = achievementsCount * 300;

  const completedCount = applications.filter((a) => a.status === 'Completed').length;
  const completedPts = completedCount * 350;

  const activeAppsCount = applications.filter((a) => a.status === 'Applied' || a.status === 'Shortlisted').length;
  const activeAppsPts = activeAppsCount * 180;

  const bookmarksCount = bookmarks.length;
  const bookmarksPts = bookmarksCount * 40;

  // Base onboarding platform points
  const basePts = 500;

  const total = basePts + skillsPts + targetSkillsPts + achievementsPts + completedPts + activeAppsPts + bookmarksPts;

  return {
    score: total,
    breakdown: [
      { label: 'Verified Skills Expertise', points: skillsPts, count: skillsCount },
      { label: 'Skills Willing to Learn', points: targetSkillsPts, count: targetSkillsCount },
      { label: 'Achievements & Awards', points: achievementsPts, count: achievementsCount },
      { label: 'Completed Opportunities', points: completedPts, count: completedCount },
      { label: 'Active Applications Submitted', points: activeAppsPts, count: activeAppsCount },
      { label: 'Opportunity Bookmarks', points: bookmarksPts, count: bookmarksCount },
      { label: 'Base Platform Verification', points: basePts, count: 1 },
    ],
  };
}

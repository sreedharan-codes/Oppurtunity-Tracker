import { CourseRecommendation } from '../types';

export const RECOMMENDED_COURSES: CourseRecommendation[] = [
  // 1. YouTube Video Courses
  {
    id: 'course-yt-nextjs',
    title: 'Next.js 15 & React Full Course - Build Modern Web Apps',
    provider: 'freeCodeCamp (YouTube)',
    type: 'youtube',
    skillsCovered: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Server Components'],
    duration: '11 hours 40 mins',
    level: 'Intermediate',
    rating: 4.9,
    reviewCount: 42100,
    url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    instructor: 'freeCodeCamp / John Smilga',
    certificateOffered: false,
    free: true,
    description: 'Master Next.js App Router, React Server Components, Server Actions, authentication with Auth.js, and deployment on Vercel from scratch.',
  },
  {
    id: 'course-yt-ai-agents',
    title: 'Build Autonomous AI Agents with Python & LangChain',
    provider: 'DeepLearning.AI / YouTube',
    type: 'youtube',
    skillsCovered: ['AI/ML', 'Python', 'Generative AI', 'LangChain', 'OpenAI API'],
    duration: '4 hours 30 mins',
    level: 'Advanced',
    rating: 4.95,
    reviewCount: 28400,
    url: 'https://www.youtube.com/watch?v=aywZrzNaKjs',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80',
    instructor: 'Harrison Chase & Andrew Ng',
    certificateOffered: false,
    free: true,
    description: 'Hands-on guide to building multi-agent collaborative workflows, reasoning loops, memory structures, and function calling tools.',
  },
  {
    id: 'course-yt-system-design',
    title: 'System Design Interview - An Insider\'s Guide & Architecture',
    provider: 'NeetCode (YouTube)',
    type: 'youtube',
    skillsCovered: ['System Design', 'Distributed Systems', 'Caching', 'Load Balancing', 'Microservices'],
    duration: '6 hours 15 mins',
    level: 'Advanced',
    rating: 4.92,
    reviewCount: 65200,
    url: 'https://www.youtube.com/watch?v=i53Gi_K3o7I',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    instructor: 'Alex Xu & NeetCode',
    certificateOffered: false,
    free: true,
    description: 'Deconstruct real scalable systems: URL shortener, rate limiters, distributed key-value stores, chat applications, and YouTube video processing pipelines.',
  },
  {
    id: 'course-yt-kubernetes',
    title: 'Kubernetes & Docker Full Bootcamp for Beginners to Pro',
    provider: 'TechWorld with Nana (YouTube)',
    type: 'youtube',
    skillsCovered: ['Kubernetes', 'Docker', 'DevOps', 'Cloud Computing', 'CI/CD'],
    duration: '5 hours 50 mins',
    level: 'Beginner',
    rating: 4.88,
    reviewCount: 51200,
    url: 'https://www.youtube.com/watch?v=X48VuDVv0do',
    thumbnailUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&auto=format&fit=crop&q=80',
    instructor: 'Nana Janashia',
    certificateOffered: false,
    free: true,
    description: 'Complete hands-on journey from containerizing simple applications with Docker to orchestrating multi-pod microservices with Kubernetes clusters.',
  },
  {
    id: 'course-yt-rust',
    title: 'Rust Programming Language Complete Course - Memory & Concurrency',
    provider: 'Traversy Media (YouTube)',
    type: 'youtube',
    skillsCovered: ['Rust', 'Systems Programming', 'Concurrency', 'Memory Safety'],
    duration: '8 hours 20 mins',
    level: 'Intermediate',
    rating: 4.85,
    reviewCount: 19800,
    url: 'https://www.youtube.com/watch?v=MsocPEZBd-M',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    instructor: 'Brad Traversy & Trevor Sullivan',
    certificateOffered: false,
    free: true,
    description: 'Learn borrow checker, ownership principles, pattern matching, async programming, and build high-performance CLI tools in Rust.',
  },
  {
    id: 'course-yt-dsa',
    title: 'Data Structures & Algorithms in Python - Visualized',
    provider: 'freeCodeCamp (YouTube)',
    type: 'youtube',
    skillsCovered: ['Algorithms', 'Python', 'Data Structures', 'Competitive Programming'],
    duration: '12 hours 45 mins',
    level: 'Beginner',
    rating: 4.93,
    reviewCount: 88400,
    url: 'https://www.youtube.com/watch?v=pkYVOmU3MgA',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516116211227-bbc67ebc9735?w=600&auto=format&fit=crop&q=80',
    instructor: 'Aakash N S',
    certificateOffered: false,
    free: true,
    description: 'Comprehensive walkthrough of arrays, linked lists, binary trees, graph traversals, dynamic programming, and complexity analysis.',
  },

  // 2. Certified Web Courses
  {
    id: 'course-cert-deeplearning',
    title: 'Deep Learning Specialization (5-Course Professional Certificate)',
    provider: 'Coursera / DeepLearning.AI',
    type: 'certified',
    skillsCovered: ['Machine Learning', 'Deep Learning', 'Python', 'PyTorch', 'Neural Networks', 'AI/ML'],
    duration: '3 months (5 hrs/week)',
    level: 'Intermediate',
    rating: 4.9,
    reviewCount: 145000,
    url: 'https://www.coursera.org/specializations/deep-learning',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600&auto=format&fit=crop&q=80',
    instructor: 'Andrew Ng, Younes Bensouda Mourri, Kian Katanforoosh',
    certificateOffered: true,
    free: false,
    description: 'The premier industry benchmark for deep learning: Convolutional networks, sequence models, transformers, hyperparameter tuning, and real-world project deployment.',
  },
  {
    id: 'course-cert-aws-solutions',
    title: 'AWS Certified Solutions Architect - Associate Official Pathway',
    provider: 'AWS Skill Builder',
    type: 'certified',
    skillsCovered: ['AWS', 'Cloud Computing', 'System Architecture', 'DevOps', 'Security'],
    duration: '6 weeks (4 hrs/week)',
    level: 'Intermediate',
    rating: 4.86,
    reviewCount: 76000,
    url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    instructor: 'Amazon Web Services Training & Certification',
    certificateOffered: true,
    free: false,
    description: 'Learn to design resilient, high-performing, secure, and cost-optimized architectures on Amazon Web Services. Includes official practice exams.',
  },
  {
    id: 'course-cert-google-ml',
    title: 'Google Cloud Professional Machine Learning Engineer Certificate',
    provider: 'Google Cloud Skills Boost',
    type: 'certified',
    skillsCovered: ['Google Cloud', 'Machine Learning', 'AI/ML', 'TensorFlow', 'Vertex AI', 'MLOps'],
    duration: '2 months',
    level: 'Advanced',
    rating: 4.88,
    reviewCount: 39000,
    url: 'https://cloud.google.com/learn/certification/machine-learning-engineer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=600&auto=format&fit=crop&q=80',
    instructor: 'Google Cloud Certified Instructors',
    certificateOffered: true,
    free: false,
    description: 'Design, build, and productionize machine learning models using Vertex AI, BigQuery ML, and automated continuous training pipelines.',
  },
  {
    id: 'course-cert-meta-frontend',
    title: 'Meta Front-End Developer Professional Certificate',
    provider: 'Coursera / Meta',
    type: 'certified',
    skillsCovered: ['React', 'JavaScript', 'HTML/CSS', 'TypeScript', 'UI/UX', 'Jest'],
    duration: '7 months (6 hrs/week)',
    level: 'Beginner',
    rating: 4.78,
    reviewCount: 92000,
    url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
    instructor: 'Meta Staff Engineers',
    certificateOffered: true,
    free: false,
    description: 'Created by the creators of React. Learn responsive UI, component state management with hooks, accessible design patterns, and unit testing.',
  },
  {
    id: 'course-cert-cs50',
    title: 'CS50\'s Introduction to Computer Science & Software Engineering',
    provider: 'Harvard University / edX',
    type: 'certified',
    skillsCovered: ['C', 'Python', 'SQL', 'Algorithms', 'Data Structures', 'Web Development'],
    duration: '12 weeks (8 hrs/week)',
    level: 'Beginner',
    rating: 4.96,
    reviewCount: 220000,
    url: 'https://www.edx.org/cs50',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&auto=format&fit=crop&q=80',
    instructor: 'Prof. David J. Malan',
    certificateOffered: true,
    free: true,
    description: 'Harvard University\'s legendary introduction to the intellectual enterprises of computer science and the art of programming.',
  },
  {
    id: 'course-cert-stanford-blockchain',
    title: 'Stanford Online: Cryptography & Blockchain Technology',
    provider: 'Stanford Online',
    type: 'certified',
    skillsCovered: ['Cryptography', 'Blockchain', 'Smart Contracts', 'Web3', 'Rust', 'Security'],
    duration: '4 weeks',
    level: 'Advanced',
    rating: 4.89,
    reviewCount: 16400,
    url: 'https://online.stanford.edu/courses/soe-xblockchain-blockchain-and-cryptocurrency',
    thumbnailUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&auto=format&fit=crop&q=80',
    instructor: 'Prof. Dan Boneh',
    certificateOffered: true,
    free: false,
    description: 'Delve into zero-knowledge proofs, consensus mechanisms, smart contract security audits, and decentralized application architecture.',
  },
];

/**
 * Recommends courses based on:
 * 1. Skills the user is willing to learn next (targetSkills) -> HIGHEST PRIORITY
 * 2. Skills the user already has -> for advancement/mastery
 */
export function getRecommendedCourses(
  userSkills: string[] = [],
  userTargetSkills: string[] = []
): { courses: (CourseRecommendation & { recommendationReason: string; matchType: 'target' | 'existing' | 'trending' })[] } {
  const targetLower = userTargetSkills.map((s) => s.toLowerCase().trim());
  const existingLower = userSkills.map((s) => s.toLowerCase().trim());

  const scoredCourses = RECOMMENDED_COURSES.map((course) => {
    const courseSkills = course.skillsCovered.map((s) => s.toLowerCase().trim());

    // Check target skills match
    const matchedTarget = targetLower.filter((target) =>
      courseSkills.some((cs) => cs === target || cs.includes(target) || target.includes(cs))
    );

    // Check existing skills match
    const matchedExisting = existingLower.filter((skill) =>
      courseSkills.some((cs) => cs === skill || cs.includes(skill) || skill.includes(cs))
    );

    let matchType: 'target' | 'existing' | 'trending' = 'trending';
    let recommendationReason = 'Trending industry curriculum recommended for top engineering roles.';
    let priorityScore = 10;

    if (matchedTarget.length > 0) {
      matchType = 'target';
      priorityScore = 100 + matchedTarget.length * 20;
      recommendationReason = `Directly matches your target skill to learn: ${matchedTarget.map((t) => t.toUpperCase()).join(', ')}`;
    } else if (matchedExisting.length > 0) {
      matchType = 'existing';
      priorityScore = 50 + matchedExisting.length * 10;
      recommendationReason = `Advanced mastery track for your current skill in: ${matchedExisting.slice(0, 2).join(' & ')}`;
    }

    return {
      ...course,
      priorityScore,
      matchType,
      recommendationReason,
      targetSkillMatch: matchedTarget[0] || matchedExisting[0] || course.skillsCovered[0],
    };
  });

  scoredCourses.sort((a, b) => b.priorityScore - a.priorityScore);

  return { courses: scoredCourses };
}

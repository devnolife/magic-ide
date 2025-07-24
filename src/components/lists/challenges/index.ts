export { ChallengeContainer } from './ChallengeContainer';
export { ChallengeSelection } from './ChallengeSelection';
export { Challenge1ListMaster } from './Challenge1ListMaster';
export { ChallengeResults } from './ChallengeResults';

// Challenge data
import { Challenge } from '@/types/challenges';

export const challengesData: Challenge[] = [
  {
    id: 'list-master',
    title: 'List Master Academy',
    description: 'Master list creation, basic operations, and understanding list structure',
    theme: 'Data Collection Academy',
    difficulty: 'beginner',
    estimatedTime: 45,
    prerequisites: ['lesson1', 'lesson2'],
    skills: ['List Creation', 'Data Types', 'Basic Operations'],
    completionRate: 92,
    averageScore: 850,
    userStatus: 'available',
    subChallenges: [], // Will be populated by the component
    maxScore: 1200
  },
  {
    id: 'data-sorter',
    title: 'Data Sorter Extraordinaire',
    description: 'Master sorting, filtering, and organizing list data',
    theme: 'Digital Library Organizer',
    difficulty: 'intermediate',
    estimatedTime: 60,
    prerequisites: ['lesson1', 'lesson2', 'lesson3', 'list-master'],
    skills: ['Sorting', 'Filtering', 'Data Organization'],
    completionRate: 78,
    averageScore: 720,
    userStatus: 'locked',
    subChallenges: [],
    maxScore: 1500
  },
  {
    id: 'index-detective',
    title: 'Index Detective Agency',
    description: 'Master indexing, slicing, and data access patterns',
    theme: 'Digital Forensics Lab',
    difficulty: 'intermediate',
    estimatedTime: 50,
    prerequisites: ['lesson4', 'data-sorter'],
    skills: ['Indexing', 'Slicing', 'Data Access'],
    completionRate: 85,
    averageScore: 780,
    userStatus: 'locked',
    subChallenges: [],
    maxScore: 1400
  },
  {
    id: 'list-manipulator',
    title: 'List Manipulator Pro',
    description: 'Master advanced list operations and method chaining',
    theme: 'Data Processing Factory',
    difficulty: 'advanced',
    estimatedTime: 75,
    prerequisites: ['lesson5', 'index-detective'],
    skills: ['Advanced Methods', 'Method Chaining', 'Optimization'],
    completionRate: 71,
    averageScore: 680,
    userStatus: 'locked',
    subChallenges: [],
    maxScore: 1800
  },
  {
    id: 'real-world-apps',
    title: 'Real-World Applications Master',
    description: 'Apply list skills to practical, real-world scenarios',
    theme: 'Innovation Lab',
    difficulty: 'advanced',
    estimatedTime: 90,
    prerequisites: ['list-manipulator'],
    skills: ['Problem Solving', 'System Design', 'Real Applications'],
    completionRate: 64,
    averageScore: 620,
    userStatus: 'locked',
    subChallenges: [],
    maxScore: 2000
  }
];

import { User, Course, FeedbackForm, FeedbackResponse, FeedbackSummary, ActionItem } from '../types';

export const users: User[] = [
  {
    id: '1',
    name: 'Siddharth Bhatt',
    email: 'siddharth.bhatt@university.edu',
    role: 'faculty',
    department: 'Computer Science',
    avatar: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '2',
    name: 'Dr. Michael Johnson',
    email: 'michael.johnson@university.edu',
    role: 'faculty',
    department: 'Mathematics',
    avatar: 'https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '3',
    name: 'Prof. Sarah Williams',
    email: 'sarah.williams@university.edu',
    role: 'faculty',
    department: 'Physics',
    avatar: 'https://images.pexels.com/photos/5212339/pexels-photo-5212339.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '4',
    name: 'Admin User',
    email: 'admin@university.edu',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/5212340/pexels-photo-5212340.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '5',
    name: 'Student One',
    email: 'student1@university.edu',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/5212342/pexels-photo-5212342.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
];

export const courses: Course[] = [
  {
    id: '1',
    code: 'CS101',
    name: 'Introduction to Computer Science',
    facultyId: '1',
    semester: 'Fall',
    year: 2025,
    department: 'Computer Science'
  },
  {
    id: '2',
    code: 'MATH201',
    name: 'Advanced Calculus',
    facultyId: '2',
    semester: 'Spring',
    year: 2025,
    department: 'Mathematics'
  },
  {
    id: '3',
    code: 'PHYS301',
    name: 'Quantum Mechanics',
    facultyId: '3',
    semester: 'Fall',
    year: 2025,
    department: 'Physics'
  },
  {
    id: '4',
    code: 'CS202',
    name: 'Data Structures and Algorithms',
    facultyId: '1',
    semester: 'Spring',
    year: 2025,
    department: 'Computer Science'
  }
];

export const feedbackForms: FeedbackForm[] = [
  {
    id: '1',
    title: 'Mid-semester Feedback for CS101',
    description: 'Please provide your feedback on the course content and teaching methodology.',
    courseId: '1',
    questions: [
      {
        id: 'q1',
        text: 'How would you rate the clarity of lectures?',
        type: 'rating',
        required: true
      },
      {
        id: 'q2',
        text: 'How would you rate the usefulness of assignments?',
        type: 'rating',
        required: true
      },
      {
        id: 'q3',
        text: 'What aspects of the course do you enjoy the most?',
        type: 'text',
        required: false
      },
      {
        id: 'q4',
        text: 'What improvements would you suggest?',
        type: 'text',
        required: false
      },
      {
        id: 'q5',
        text: 'Which topics would you like to explore further?',
        type: 'multiple-choice',
        required: true,
        options: ['Algorithms', 'Programming Paradigms', 'Data Structures', 'Software Engineering']
      }
    ],
    createdAt: '2025-02-15T00:00:00.000Z',
    deadline: '2025-03-15T00:00:00.000Z',
    isActive: true,
    isAnonymous: true
  },
  {
    id: '2',
    title: 'End of Semester Evaluation for MATH201',
    description: 'Please evaluate the overall course experience and instructor effectiveness.',
    courseId: '2',
    questions: [
      {
        id: 'q1',
        text: 'How would you rate the overall course content?',
        type: 'rating',
        required: true
      },
      {
        id: 'q2',
        text: 'How would you rate the instructor\'s teaching effectiveness?',
        type: 'rating',
        required: true
      },
      {
        id: 'q3',
        text: 'What aspects of the course were most beneficial?',
        type: 'text',
        required: true
      },
      {
        id: 'q4',
        text: 'Would you recommend this course to other students?',
        type: 'yes-no',
        required: true
      }
    ],
    createdAt: '2025-04-01T00:00:00.000Z',
    deadline: '2025-05-15T00:00:00.000Z',
    isActive: true,
    isAnonymous: false
  }
];

export const feedbackResponses: FeedbackResponse[] = [
  {
    id: 'r1',
    formId: '1',
    studentId: '5',
    submittedAt: '2025-02-28T00:00:00.000Z',
    answers: [
      {
        questionId: 'q1',
        answer: 4
      },
      {
        questionId: 'q2',
        answer: 5
      },
      {
        questionId: 'q3',
        answer: 'The practical coding assignments are excellent for learning.'
      },
      {
        questionId: 'q4',
        answer: 'More code examples during lectures would be helpful.'
      },
      {
        questionId: 'q5',
        answer: ['Data Structures', 'Algorithms']
      }
    ]
  },
  {
    id: 'r2',
    formId: '1',
    submittedAt: '2025-03-01T00:00:00.000Z',
    answers: [
      {
        questionId: 'q1',
        answer: 3
      },
      {
        questionId: 'q2',
        answer: 4
      },
      {
        questionId: 'q3',
        answer: 'The group projects help in understanding complex concepts.'
      },
      {
        questionId: 'q4',
        answer: 'The pace of the course could be slower for difficult topics.'
      },
      {
        questionId: 'q5',
        answer: ['Software Engineering']
      }
    ]
  }
];

export const feedbackSummaries: FeedbackSummary[] = [
  {
    formId: '1',
    courseId: '1',
    responseCount: 25,
    averageRating: 4.2,
    sentimentScore: 0.75,
    topComments: [
      'Excellent course structure and content.',
      'The instructor explains complex concepts very clearly.',
      'More practical examples would enhance understanding.'
    ],
    strengthAreas: ['Teaching methodology', 'Course content', 'Assignments'],
    improvementAreas: ['More examples', 'Slower pace for complex topics']
  },
  {
    formId: '2',
    courseId: '2',
    responseCount: 18,
    averageRating: 3.8,
    sentimentScore: 0.65,
    topComments: [
      'The course is challenging but rewarding.',
      'More practice problems would be helpful.',
      'Office hours are very beneficial.'
    ],
    strengthAreas: ['Challenging content', 'Office hours availability'],
    improvementAreas: ['More practice problems', 'Additional resources for difficult topics']
  }
];

export const actionItems: ActionItem[] = [
  {
    id: 'a1',
    formId: '1',
    facultyId: '1',
    description: 'Include more code examples in lectures for complex topics',
    status: 'in-progress',
    createdAt: '2025-03-05T00:00:00.000Z',
    updatedAt: '2025-03-10T00:00:00.000Z'
  },
  {
    id: 'a2',
    formId: '1',
    facultyId: '1',
    description: 'Develop additional practice problems for algorithm section',
    status: 'pending',
    createdAt: '2025-03-05T00:00:00.000Z',
    updatedAt: '2025-03-05T00:00:00.000Z'
  },
  {
    id: 'a3',
    formId: '2',
    facultyId: '2',
    description: 'Create supplementary materials for challenging topics',
    status: 'completed',
    createdAt: '2025-05-20T00:00:00.000Z',
    updatedAt: '2025-06-01T00:00:00.000Z'
  }
];

// Current user for demo purposes
export const currentUser: User = users[0]; // Faculty member - Siddharth Bhatt
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty' | 'student';
  department?: string;
  avatar?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  facultyId: string;
  semester: string;
  year: number;
  department: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'rating' | 'text' | 'multiple-choice' | 'yes-no';
  required: boolean;
  options?: string[];
}

export interface FeedbackForm {
  id: string;
  title: string;
  description: string;
  courseId: string;
  questions: Question[];
  createdAt: string;
  deadline: string;
  isActive: boolean;
  isAnonymous: boolean;
}

export interface FeedbackResponse {
  id: string;
  formId: string;
  studentId?: string;
  submittedAt: string;
  answers: {
    questionId: string;
    answer: string | number | string[];
  }[];
}

export interface FeedbackSummary {
  formId: string;
  courseId: string;
  responseCount: number;
  averageRating: number;
  sentimentScore?: number;
  topComments: string[];
  strengthAreas: string[];
  improvementAreas: string[];
}

export interface ActionItem {
  id: string;
  formId: string;
  facultyId: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}
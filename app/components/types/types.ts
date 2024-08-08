export interface CourseInterface {
  id: string;
  title: string;
  materials: object[];
  averageRating: number;
  skills: string[];
  enrollments: object[];
  difficulty: string;
  thumbnailUrl: string;
}

export interface NavbarInterface {
  isLoggedIn: boolean;
  activePage?: string;
}

export interface CardInterface {
  courseTitle: string;
  totalChapters: number;
  rating: number;
  skills: string[];
  totalEnrolled: number;
  difficulty: string;
  thumbnailURL: string;
  className?: string;
  onClick?: () => void;
}

export interface CourseDetailsInterface {
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  instructor: string;
  whatYoullLearn: string[]; // Array of strings
  syllabus: string[]; // Array of strings
  price?: number; // Optional field
  averageRating?: number; // Optional field
  isLogin?: boolean; // Optional field
}
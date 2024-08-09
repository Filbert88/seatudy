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
export interface MaterialInterface {
  id: string;
  courseId: string;
  bucketId: string;
  title: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseDetailsInterface {
  id: string;
  title: string;
  description: string;
  syllabus: string[];
  thumbnailUrl: string;
  skills: string[];
  instructorId: string;
  createdAt: string;
  updatedAt: string;
  averageRating: number;
  difficulty: string;
  price: number;
  enrollments: object[];
  materials: MaterialInterface[];
  categories: object[];
  transactions: object[];
}

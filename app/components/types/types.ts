export interface CourseInterface {
  id: string;
  instructorId: string;
  createdAt: string;
  updatedAt: string;
  price: string;
  categories: string[];
  transaction: object[];
  title: string;
  description: string;
  materials: MaterialInterface[];
  assignments?: AssignmentInterface[];
  averageRating: number;
  skills: string[];
  enrollments: object[];
  difficulty: string;
  thumbnailUrl: string;
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

export interface AssignmentInterface {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDateOffset: number;
}

export interface NavbarInterface {
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

export interface UserInterface {
  id: string;
  email: string;
  password: string;
  phoneNumber: string;
  campus: string;
  role: any;
  createdAt: any;
  updatedAt: any;
  balance: number;
  profileUrl: string;
}

export interface SideBarDataInterface {
  materialData: string[];
  assignmentData: string[];
}

export interface CourseSidebarInterface {
  title: string;
  materials: string[];
  assignments: string[];
  active: { type: string; index: number };
}

export interface TransactionInterface {
  id: string;
  amount: string;
  cardNumber: string;
  expirationDate: string;
  cvc: string;
  cardHolderName: string;
}

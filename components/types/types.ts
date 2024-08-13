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
  accesses: AccessesInterface[];
}

export interface AccessesInterface {
  id: string;
  userId: string;
  courseMaterialId: string;
  accessedAt: string;
}

export interface AssignmentInterface {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDateOffset: number;
  course: AssignmentCourseInterface;
  submissions: AsgSubmissionInterface[];
}

export interface AssignmentCourseInterface {
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
  price: string;
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

export interface instructorInterface {
  fullName: string;
}

export interface CourseDetailCardProps {
  thumbnailUrl: string;
  price: string;
  isLogin: boolean;
  averageRating: number;
  syllabus: string[];
  courseId: string;
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
  assignments: AssignmentInterface[];
  transactions: object[];
  instructor: instructorInterface;
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
  materialData: MaterialInterface[];
  assignmentData: AssignmentInterface[];
  titleData: string;
}

export interface CourseSidebarInterface {
  title: string;
  materials: MaterialInterface[];
  assignments: AssignmentInterface[];
  active: { type: string; id: string };
}

export interface TransactionInterface {
  id: string;
  amount: string;
  cardNumber: string;
  expirationDate: string;
  cvc: string;
  cardHolderName: string;
}

export interface ForumPostInterface {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
  };
  _count: {
    comments: number;
  };
}

export interface AsgSubmissionInterface {
  id: string;
  title: string;
  description: string;
  dueDateOffset: number;
  courseId: string;
}

export interface AssignmentSubmissionInterface {
  id: string;
  title: string;
  content: string;
  dueDateOffset: number;
  courseId: string;
  grade: number | null;
}

export interface StudentSubmissionInterface {
  id: string;
  fullName: string;
  email: string;
}

export interface SubmissionInterface {
  id: string;
  content: string;
  createdAt: string;
  assignmentId: string;
  studentId: string;
  grade: number;
  assignment: AssignmentSubmissionInterface;
  student: StudentSubmissionInterface;
}

export interface UserInterfaces {
  id: string;
  fullName: string;
}

export interface ForumCommentInterface {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  userId: string;
  user: UserInterfaces;
}

enum NotificationType {
  ASSIGNMENT_SUBMISSION,
  COURSE_PURCHASE,
}

export interface NotificationInterface {
  id: string;
  userId: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  read: boolean;
}

export interface SubmissionDataInterface {
  id: string;
  content: string;
  createdAt: string;
  assignmentId: string;
  studentId: string;
  grade: number;
  assignment: AssignmentSubmissionInterface;
  student: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface StudentEnrollmentInterface {
  id: string;
  userId: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    fullName: string;
    profileUrl: string;
  };
  progress: { progressPct: string }[];
}

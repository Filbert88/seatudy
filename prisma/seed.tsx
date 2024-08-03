import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      password: 'password1',
      phoneNumber: '1234567890',
      campus: 'Main Campus',
      role: 'USER',  
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      password: 'password2',
      phoneNumber: '0987654321',
      campus: 'Main Campus',
      role: 'INSTRUCTOR',  
    },
  });

  const course1 = await prisma.course.create({
    data: {
      title: 'Course 1',
      description: 'Description for Course 1',
      syllabus: 'Syllabus for Course 1',
      instructor: { connect: { id: user2.id } },
      difficulty: 'BEGINNER',  
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Course 2',
      description: 'Description for Course 2',
      syllabus: 'Syllabus for Course 2',
      instructor: { connect: { id: user2.id } },
      difficulty: 'INTERMEDIATE', 
    },
  });

  await prisma.courseEnrollment.create({
    data: {
      user: { connect: { id: user1.id } },
      course: { connect: { id: course1.id } },
    },
  });

  const assignment1 = await prisma.assignment.create({
    data: {
      title: 'Assignment 1',
      description: 'Description for Assignment 1',
      dueDate: new Date('2024-08-10'),
      course: { connect: { id: course1.id } },
    },
  });

  await prisma.submission.create({
    data: {
      content: 'Submission content for Assignment 1',
      assignment: { connect: { id: assignment1.id } },
      student: { connect: { id: user1.id } },
    },
  });

  await prisma.review.create({
    data: {
      content: 'Great course!',
      rating: 5,
      course: { connect: { id: course1.id } },
      user: { connect: { id: user1.id } },
    },
  });

  await prisma.notification.create({
    data: {
      user: { connect: { id: user1.id } },
      message: 'You have a new assignment submission',
      type: 'ASSIGNMENT_SUBMISSION', 
    },
  });

  await prisma.transaction.create({
    data: {
      user: { connect: { id: user1.id } },
      course: { connect: { id: course1.id } },
      amount: 100.0,
      type: 'PURCHASE',  
    },
  });

  console.log('Database seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

"use client";

import { useRouter } from 'next/navigation';
import SeatudyLogo from './assets/seatudy-logo';
import CoursesCard from './components/courses-card';
import Navbar from "./components/navbar";

export default function Home() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  }

  const handleRegisterClick = () => {
    router.push('/register');
  }

  return (
    <main className="flex min-h-screen flex-col bg-primary font-nunito">
      <Navbar isLoggedIn={false} />
      <div className="w-full h-[20rem] bg-cover bg-[url('/assets/home_loggedout.png')] flex flex-col text-white mt-20">
        <div className="flex-grow flex justify-end">
          <div className="w-[40%] h-full items-center flex flex-col justify-center">
            <span className="font-bold text-4xl p-3">Elevate your skills with</span>
            <div className="flex p-3">
              <SeatudyLogo className="h-10 w-10 mx-2"/>
              <span className="font-bold text-3xl">seatudy</span>
            </div>
            <div className="flex p-3">
              <a onClick={handleRegisterClick} className="bg-transparent hover:cursor-pointer border border-white rounded-md px-10 py-1.5 font-semibold mx-4">Join for free</a>
              <a onClick={handleLoginClick} className="bg-white hover:cursor-pointer rounded-md px-5 py-1.5 text-secondary font-semibold mx-4">I have an account</a>
            </div>
            
          </div>
        </div>
      </div>
      <div className="flex-grow mx-20 my-5">
        <div className="font-bold text-2xl mb-5">Explore our courses</div>
        <div className="flex">
        <CoursesCard
          courseTitle='Introduction to Flutter'
          totalChapters={10}
          rating={4.1}
          skills={['Dart', 'Flutter', 'Android Studio']}
          totalEnrolled={8960}
          difficulty='Intermediate'
          thumbnailURL='https://imgur.com/pIn9tcd.png'
          className="mr-5"
        />
        <CoursesCard
          courseTitle='Introduction to SQL'
          totalChapters={8}
          rating={4.6}
          skills={['MySQL', 'Microsoft SSMS']}
          totalEnrolled={12555}
          difficulty='Beginner'
          thumbnailURL='https://imgur.com/mB6wcMq.png'
          className="mr-5"
        />
        <CoursesCard
          courseTitle='Data Structure and Algorithm'
          totalChapters={12}
          rating={4.9}
          skills={['Advanced C', 'Data structure']}
          totalEnrolled={36925}
          difficulty='Intermediate'
          thumbnailURL='https://imgur.com/xL4wiRB.png'
          className="mr-5"
        />
        <CoursesCard
          courseTitle='Introduction to JavaScript'
          totalChapters={4}
          rating={4.8}
          skills={['JavaScript', 'DOM Manipulation']}
          totalEnrolled={19569}
          difficulty='Beginner'
          thumbnailURL='https://imgur.com/O1gDMZb.png'
          className="mr-5"
        />
        </div>
        
      </div>
    </main>
  );
}

"use client";

import Image from "next/image";
import { StudentEnrollmentInterface } from "../types/types";

interface StudentBarProps {
  students: StudentEnrollmentInterface[];
}

const StudentBar: React.FC<StudentBarProps> = ({ students = [] }) => {
  const autoFormatName = (name: string) => {
    const nameArr = name.split(" ");
    if (nameArr.length > 2) {
      return nameArr[0] + " " + nameArr[1] + " " + nameArr[2].charAt(0) + "...";
    } else if (nameArr.length === 2) {
      return nameArr[0] + " " + nameArr[1];
    } else {
      return nameArr[0];
    }
  };

  const dummyImage =
    "https://res.cloudinary.com/dl2cqncwz/image/upload/v1723449492/pmswrzvs7sh2u5wzgnjx.jpg";

  console.log(students);
  return (
    <div className="fixed top-20 max-w-[20rem] min-w-[20rem] h-screen font-nunito left-0 bg-secondary text-white">
      <div className="text-2xl font-extrabold p-5">Enrolled Students</div>
      <div className="font-semibold text-1xl px-5 py-1">
        {students.length > 0 ? (
          <ul className="font-nunito font-semibold text-white text-1xl">
            {students.map((student) => (
              <li key={student.id}>
                <div className="flex items-center p-2">
                  <Image
                    src={student.user.profileUrl ?? dummyImage}
                    alt="profile"
                    className="w-10 h-10 rounded-full bg-white"
                  />
                  <div className="flex flex-col ml-4">
                    <div className="font-normal">
                      {autoFormatName(student.user.fullName)}
                    </div>
                    {student.progress.length > 0 ? (
                      <div className="text-xs font-light">
                        {
                          student.progress[student.progress.length - 1]
                            .progressPct
                        }
                      </div>
                    ) : (
                      <div className="text-xs font-light">0%</div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No students enrolled...</p>
        )}
      </div>
    </div>
  );
};

export default StudentBar;

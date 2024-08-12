"use client"

import { StudentEnrollmentInterface } from "../types/types";

interface StudentBarProps {
    students: StudentEnrollmentInterface[];
}

const dummyStudents = [
    { id: 1, fullName: "Hans William Christianto Wijaya", progress: 42, profileUrl: "https://res.cloudinary.com/dl2cqncwz/image/upload/v1723449492/pmswrzvs7sh2u5wzgnjx.jpg"},
    { id: 2, fullName: "William Theodorus", progress: 100, profileUrl: "https://res.cloudinary.com/dl2cqncwz/image/upload/v1723449492/pmswrzvs7sh2u5wzgnjx.jpg"},
] // Dummy data before fetching from API

const autoFormatName = (name: string) => {
    const nameArr = name.split(" ");
    if (nameArr.length > 2){
        return nameArr[0] + " " + nameArr[1] + " " + nameArr[2].charAt(0) + "...";
    }
    else if(nameArr.length === 2){
        return nameArr[0] + " " + nameArr[1];
    }
    else{
        return nameArr[0];
    }
}

const StudentBar:React.FC<StudentBarProps> = ({students = []}) => {
    return (
        <div className = "fixed top-20 max-w-[20rem] min-w-[20rem] h-screen font-nunito left-0 bg-secondary text-white">
                <div className = "text-2xl font-extrabold p-5">
                    Enrolled Students
                </div>
            <div className = "font-semibold text-1xl px-5 py-1">
                {students.length > 0 ? (
                    <ul className = "font-nunito font-semibold text-white text-1xl">
                        {   // Kalau API dah jalan, ganti dummyStudents jadi students
                            dummyStudents.map((student) => (
                                <li key = {student.id} >
                                    <div className = "flex items-center p-2">
                                        <img src = {student.profileUrl} alt = "profile" className = "w-10 h-10 rounded-full"/>
                                        <div className = "flex flex-col ml-4">
                                            <div className = "font-normal">{autoFormatName(student.fullName)}</div>
                                            <div className = "text-xs font-light">{student.progress}%</div>
                                        </div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                ):(<p>No students enrolled...</p>)} 
            </div>
        </div>
    )
}

export default StudentBar;
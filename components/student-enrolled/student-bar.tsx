"use client"

import { StudentEnrollmentInterface } from "../types/types";

interface StudentBarProps {
    students: StudentEnrollmentInterface[];
}

const StudentBar:React.FC<StudentBarProps> = ({students = []}) => {
    return (
        <div className = "fixed top-20 max-w-[20rem] min-w-[20rem] h-screen font-nunito left-0 bg-secondary">
            <div className = "text-white font-semibold text-1xl p-5">
                {students.length > 0 ? (
                    <ul className = "font-nunito font-semibold text-white text-1xl">

                    </ul>
                ):(<p>No students enrolled</p>)} 
            </div>
        </div>
    )
}

export default StudentBar;
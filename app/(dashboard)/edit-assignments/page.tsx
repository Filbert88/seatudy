"use client"

import { useState } from "react";

const EditAssignmentPage = () => {
    const [assignmentTitle, setAssignmentTitle] = useState<string>("");
    const [assignmentDescription, setAssignmentDescription] = useState<string>("");

    return (
        <div className = "pt-32 px-12">
        <h1 className = "font-nunito font-bold text-3xl mb-4">Editing an Assignment</h1>
        <hr className = "border-t-4 border-secondary w-full"/>
        <div className = "flex flex-col my-5">
        <form className = "form-content items-center justify-center">
        <div className="font-semibold text-black mb-1 text-lg">
              Title
        </div>
            <div className="form-group pb-5 w-full">
              <input
                type="text"
                placeholder="Enter assignment title.."
                className="p-3 rounded-md bg-white w-full h-8"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
              />
            </div>
        <div className="font-semibold text-black mb-1 text-lg">
              Description
        </div>
            <div className="form-group pb-5 w-full">
              <textarea
                placeholder="Enter assignment title.."
                className="p-3 rounded-md bg-white w-full h-40"
                value={assignmentDescription}
                onChange={(e) => setAssignmentDescription(e.target.value)}
              />
            </div>
        </form>
        <button type = "button" className = "flex items-center justify-center text-white font-nunito font-bold bg-fourth rounded-md max-w-40 px-1 py-1">
            Save Changes
        </button>
        </div>
        </div>
    );
}

export default EditAssignmentPage;
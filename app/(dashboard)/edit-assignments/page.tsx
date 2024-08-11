"use client"

import LoadingBouncer from "@/components/loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditAssignmentPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [assignmentId, setAssignmentId] = useState<string>("");
    const [assignmentTitle, setAssignmentTitle] = useState<string>("");
    const [assignmentDescription, setAssignmentDescription] = useState<string>("");

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get("id");
        if (id) {
            setAssignmentId(id);
        }

        const fetchAssignment = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/assignment/${assignmentId}`, {
                    method: "GET",
                    headers: {
                        accept: "application/json"
                    },
                })
                const data = await response.json();
                setAssignmentTitle(data.data.title);
                setAssignmentDescription(data.data.description);
            }
            catch (error) {
                alert("Error fetching assignment");
                console.error(error);
                router.push("/instructor-dashboard")
            }
            finally {
                setIsLoading(false);
            }
        }
        if(assignmentId){
            fetchAssignment();
        }
    }, [assignmentId]);

    const handleChanges = async () => {
        if (!assignmentTitle || !assignmentDescription) {
            alert("Please fill in all fields");
            return;
        }
        try{
            setIsLoading(true);
            const response = await fetch(`/api/assignment/${assignmentId}/update`, {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: assignmentTitle,
                    description: assignmentDescription,
                }),
            })
            const data = await response.json();
            console.log(data);
            if(data.message === "Success"){
                alert("Assignment updated successfully");
                router.back();
            }
        }catch(error){
            alert("Error updating assignment");
            console.error(error);
        }
        finally{
            setIsLoading(false);
        }
    }

    if(isLoading){
        return <LoadingBouncer/>
    }

    return (
        <div className = "pt-32 px-12">
        <h1 className = "font-nunito font-bold text-3xl mb-4">Editing an Assignment</h1>
        <hr className = "border-t-2 border-grays w-full"/>
        <div className = "flex flex-col my-5">
        <form className = "form-content items-center justify-center">
        <div className="font-semibold text-black mb-1 text-lg">
              Title
        </div>
            <div className="form-group pb-5 w-full">
              <input
                type="text"
                placeholder="Enter new assignment's title.."
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
                placeholder="Enter new assignment's descriptions.."
                className="p-3 rounded-md bg-white w-full h-40"
                value={assignmentDescription}
                onChange={(e) => setAssignmentDescription(e.target.value)}
              />
            </div>
        </form>
        <button onClick={handleChanges} className ="flex items-center justify-center text-white font-nunito font-semibold bg-fourth rounded-md w-fit px-5 py-2 hover:shadow-md">
            Save Changes
        </button>
        </div>
        </div>
    );
}

export default EditAssignmentPage;
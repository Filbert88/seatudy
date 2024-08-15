"use client";
import { useEffect, useState } from "react";
import CoursesBar from "@/components/assignments/course-bar";
import Instructions from "@/components/assignments/instructions";
import {
  AssignmentInterface,
} from "@/components/types/types";
import LoadingBouncer from "./loading";
import { useToast } from "@/components/ui/use-toast";
import { FaStar } from "react-icons/fa6";

const ReviewPage = () => {
  const [tempRating, setTempRating] = useState(0);
  const [rating, setRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [courseId, setCourseId] = useState<string>("");
  const [assignmentData, setAssignmentData] = useState<AssignmentInterface>();
  const { toast } = useToast();

  const getAssignmentById = async (assignmentId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/assignment/${assignmentId}`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });
      const data = await response.json();
      setAssignmentData(data.data);
      console.log(assignmentData);
      if (data.message !== "Success") {
        toast({
          title: "Failed to load material",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to load material",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const response = await fetch("/api/review/create", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: courseId,
          rating: rating,
          content: comment,
        }),
      });
      if (response.ok) {
        toast({
          title: "Review submitted successfully",
          description: "Thank you for your feedback!",
        });
        setRating(0);
        setComment("");
      } else {
        toast({
          title: "Failed to submit review",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    const id = param.get("id");
    setCourseId(id ?? "");
    const assignmentId = param.get("assignmentId");
    
    if (assignmentId) {
      getAssignmentById(assignmentId);
    }
    
  }, []); // eslint-disable-line

  useEffect(() => {
    if (comment.length === 0 && rating > 0) {
      toast({
        title: "A few more steps",
        description: "Let's leave some feedback for the instructor",
      });
    }
  }, [rating]); // eslint-disable-line

  if (isLoading) {
    return <LoadingBouncer />;
  }

  return (
    <div className="flex flex-row py-20 pl-[20rem] font-nunito text-secondary">
      <CoursesBar
        active={{ type: "review", id: "review-course" }}
      />
      <div className="flex flex-col ">
        <div className="pt-10 font-semibold text-3xl">
          {"Help Us Make Seatudy Even Better!"}
        </div>
        <div className="pt-10 font-normal text-2xl">
          <Instructions>{`Your feedback is incredibly valuable to us. We would love to hear your thoughts on the "**${localStorage.getItem("title")}**" course. Please share your honest ratings and reviews to help us continue improving and provide the best learning experience possible. Thank you for being a part of our community!`}</Instructions>
        </div>
        <div className="flex mt-[5vh] items-center">
          <button
            onClick={() => setRating(1)}
            onMouseEnter={() => setTempRating(1)}
            onMouseLeave={() => setTempRating(0)}
            className="hover:bg-transparent pr-[1vh]"
          >
            <FaStar
              color={`${tempRating > 0 || rating > 0 ? "#ffb900" : "gray"}`}
              size={50}
            />
          </button>
          <button
            onClick={() => setRating(2)}
            onMouseEnter={() => setTempRating(2)}
            onMouseLeave={() => setTempRating(0)}
            className="hover:bg-transparent pr-[1vh]"
          >
            <FaStar
              color={`${tempRating > 1 || rating > 1 ? "#ffb900" : "gray"}`}
              size={50}
            />
          </button>
          <button
            onClick={() => setRating(3)}
            onMouseEnter={() => setTempRating(3)}
            onMouseLeave={() => setTempRating(0)}
            className="hover:bg-transparent pr-[1vh]"
          >
            <FaStar
              color={`${tempRating > 2 || rating > 2 ? "#ffb900" : "gray"}`}
              size={50}
            />
          </button>
          <button
            onClick={() => setRating(4)}
            onMouseEnter={() => setTempRating(4)}
            onMouseLeave={() => setTempRating(0)}
            className="hover:bg-transparent pr-[1vh]"
          >
            <FaStar
              color={`${tempRating > 3 || rating > 3 ? "#ffb900" : "gray"}`}
              size={50}
            />
          </button>
          <button
            onClick={() => setRating(5)}
            onMouseEnter={() => setTempRating(5)}
            onMouseLeave={() => setTempRating(0)}
            className="hover:bg-transparent pr-[1vh]"
          >
            <FaStar
              color={`${tempRating > 4 || rating > 4 ? "#ffb900" : "gray"}`}
              size={50}
            />
          </button>
          <div className="text-2xl ml-3 mt-1 font-semibold">{`${
            rating || tempRating
          } / 5`}</div>
        </div>
        <textarea
          name="comments"
          className="mt-10 p-3 rounded-md min-h-40 border border-grays"
          placeholder="Your feedback.."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {rating > 0 && comment.length > 0 && (
          <button
            disabled={submitting}
            onClick={handleSubmit}
            className={`${
              submitting ? "bg-gray-400" : "bg-fourth"
            } text-white font-semibold px-10 py-2 rounded-lg mt-10 w-fit`}
          >
            {submitting ? "Submitting..." : "Submit review"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;

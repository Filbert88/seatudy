"use client";
/* eslint-disable */

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import CoursesBar from "@/components/assignments/course-bar";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import "react-quill/dist/quill.snow.css";
import "./custom-quill.css";


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const ViewForumPage = () => {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    const id = param.get("id");
    setCourseId(id);

  }, []);

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch("/api/forum/create", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: courseId,
          postTitle: title,
          postContent: content,
        }),
      });
      if (response.ok) {
        toast({
          title: "Forum thread created successfully",
        });
        router.push(`/view-forum?id=${courseId}`);
      } else {
        toast({
          title: "Error creating forum thread",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to create forum thread",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-row bg-primary text-secondary font-nunito">
      <CoursesBar
        active={{ type: "forum", id: "new-thread" }}
      />
      {!isLoading && (
        <div className="flex flex-col h-screen pl-[18rem] pt-[6rem] w-full pr-20 pb-10 scroll overflow-hidden">
          <div className="my-5 font-nunito font-bold text-3xl">
            {`Create a new forum thread`}
          </div>
          <div className="text-xl font-semibold mb-3">{"Title"}</div>
          <input
            type="text"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            value={title}
            className="w-full h-10 rounded-lg px-3 mb-10 border border-grays"
            placeholder="Your thread title.."
            name="title"
            required
          />
          <div className="text-xl font-semibold mb-3">{"Content"}</div>
          <div className="min-h-60 w-full bg-white rounded-lg border border-grays">
            <ReactQuill
              value={content}
              onChange={handleContentChange}
              className="h-full"
              style={{ height: "calc(30vh - 40px)" }}
            />
          </div>
          <div>
            <button
              onClick={async () => await handleSubmit()}
              className="bg-fourth text-white font-semibold px-10 py-2 rounded-lg mt-10"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewForumPage;

"use client";
import { useEffect, useState } from "react";
import CoursesBar from "@/components/assignments/coursesBar";
import React from "react";
import {
  CourseInterface,
  ForumCommentInterface,
  ForumPostInterface,
  SideBarDataInterface,
} from "@/components/types/types";
import {
  getCourses,
  getSideBarDataFromLocalStorage,
} from "@/components/worker/local-storage-handler";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import LoadingBouncer from "./loading";
import { useToast } from "@/components/ui/use-toast";

const ViewForumPage = () => {
  const [index, setIndex] = useState<number>(0);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courseData, setCourseData] = useState<CourseInterface>();
  const [forumData, setForumData] = useState<ForumPostInterface[]>();
  const [commentData, setCommentData] = useState<ForumCommentInterface[]>([]);
  const [postId, setPostId] = useState<string>("");
  const [commentFieldValue, setCommentFieldValue] = useState<string>("");
  const [sideBarData, setSideBarData] = useState<
    SideBarDataInterface | undefined
  >();
  const [isMaterialAvailable, setIsMaterialAvailable] = useState<boolean>(true);

  const { toast } = useToast();

  const getForumData = async (courseId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/forum?courseId=${courseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch forum data");
      }
      const data = await response.json();
      setForumData(data.posts);
    } catch (error) {
      console.error("Error fetching forum data:", error);
      toast({
        title: "Failed to load forum data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCommentData = async (postId: string) => {
    try {
      const response = await fetch(
        `/api/forum/forum-comment?postId=${postId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch forum comments");
      }
      const data = await response.json();
      setCommentData(data);
    } catch (error) {
      console.error("Error fetching forum comments:", error);
      toast({
        title: "Failed to load comments",
        variant: "destructive",
      });
    }
  };

  const postForumComment = async (postId: string) => {
    if (commentFieldValue.length === 0) {
      toast({
        title: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch("/api/forum/forum-comment/create", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: postId,
          content: commentFieldValue,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to post comment");
      }
      setCommentFieldValue("");
      toast({
        title: "Comment posted successfully",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    const id = param.get("id");
    const index = param.get("index");
    setIndex(parseInt(index ?? "0"));
    setCourseId(id);
    setIsLoading(true);
    if (id !== null) {
      getForumData(id);
    }

    const sideBarDataFromLocalStorage = getSideBarDataFromLocalStorage(id);

    if (sideBarDataFromLocalStorage) {
      setSideBarData(sideBarDataFromLocalStorage);
    }

    getCourses(id)
      .then((data) => {
        setCourseData(data);
        if (!sideBarDataFromLocalStorage) {
          const newSideBarData = {
            materialData: data.materials.map((material: any) => material.title),
            assignmentData: data.assignments.map(
              (assignment: any) => assignment.title
            ),
          };
          setSideBarData(newSideBarData);
        }
        if (data.materials.length === 0) {
          setIsMaterialAvailable(false);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching course data:", error);
        toast({
          title: "Failed to load course data",
          variant: "destructive",
        });
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <LoadingBouncer />;
  }
  return (
    <>
      <div className="min-h-screen w-screen flex flex-row bg-primary text-secondary font-nunito">
        <CoursesBar
          title={courseData?.title || ""}
          materials={sideBarData?.materialData || []}
          assignments={sideBarData?.assignmentData || []}
          active={{ type: "forum", index: 1 }}
        />
        {!isLoading && isMaterialAvailable && (
          <div className="flex flex-col h-screen pl-[18rem] pt-[6rem] w-full pr-20">
            <div className="my-5 font-nunito font-bold text-3xl">
              {`Forum Discussions`}
            </div>
            {forumData &&
              forumData.map((post: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col bg-white shadow-lg rounded-md my-3 p-3 justify-between"
                  >
                    <div className="flex justify-between mb-1">
                      <div className="text-sm font-semibold">
                        {post.user.fullName}
                      </div>
                      <div className="text-sm font-semibold ml-auto">
                        {new Date(post.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-lg font-bold underline mb-1">
                      {post.title}
                    </div>
                    <div
                      dangerouslySetInnerHTML={{ __html: post.content }}
                      className="text-current pl-2"
                    />
                    {postId === post.id ? (
                      <>
                        <div
                          onClick={() => {
                            setCommentData([]);
                            setPostId("");
                          }}
                          className="flex pl-2 mt-2 mb-1 items-center hover:cursor-pointer w-fit"
                        >
                          <FaAngleUp />
                          <div className="ml-1 text-sm font-bold">{`Hide ${post._count.comments} replies`}</div>
                        </div>
                        <div className="my-2 ml-2 bg-primary p-2 pt-1 rounded-md w-[40%]">
                          <div>Reply to this thread</div>
                          <textarea
                            value={commentFieldValue}
                            onChange={(e) => {
                              setCommentFieldValue(e.target.value);
                            }}
                            className="mt-1 py-1 px-2 rounded-md h-10 w-full"
                          />
                          {commentFieldValue.length > 0 && (
                            <button
                              onClick={async () => {
                                if (courseId) {
                                  await postForumComment(post.id).then(() => {
                                    getForumData(courseId).then(() => {
                                      getCommentData(post.id);
                                    });
                                  });
                                }
                              }}
                              className="mt-2 bg-fourth text-white text-sm rounded-md py-1 px-3"
                            >
                              Reply
                            </button>
                          )}
                        </div>
                        <div className="mt-1 ml-2">
                          {commentData.map((comment: any, index: number) => {
                            return (
                              <div
                                key={index}
                                className="flex flex-col border-t-2 p-3 justify-between"
                              >
                                <div className="text-sm font-semibold mb-1">
                                  {new Date(comment.createdAt).toLocaleString()}{" "}
                                  - {comment.user.fullName}
                                </div>
                                <div className="text-sm">{comment.content}</div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div
                        onClick={() => {
                          setPostId(post.id);
                          setCommentFieldValue("");
                          getCommentData(post.id);
                        }}
                        className="flex pl-2 mt-2 mb-1 items-center hover:cursor-pointer w-fit"
                      >
                        <FaAngleDown />
                        <div className="ml-1 text-sm font-bold">{`View ${post._count.comments} replies`}</div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </>
  );
};

export default ViewForumPage;

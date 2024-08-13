"use client";
import { useEffect, useState } from "react";
import CoursesBar from "@/components/assignments/coursesBar";
import React from "react";
import {
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
import { Session } from "next-auth";

const ViewForumPage = ({ session }: { session: Session | null }) => {
  //   console.log(session.user.id);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [forumData, setForumData] = useState<ForumPostInterface[]>();
  const [commentData, setCommentData] = useState<{
    [key: string]: ForumCommentInterface[];
  }>({});
  const [postId, setPostId] = useState<string>("");
  const [commentFieldValue, setCommentFieldValue] = useState<string>("");
  const [sideBarData, setSideBarData] = useState<
    SideBarDataInterface | undefined
  >();
  const [isForumAvailable, setIsForumAvailable] = useState<boolean>(true);
  const [isPosting, setIsPosting] = useState<boolean>(false); // Separate loading state for posting

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
    if (commentData[postId]) return;
  
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
  
      const transformedData = data.map((comment: ForumCommentInterface) => {
        if (comment.userId === session?.user.id) {
          return {
            ...comment,
            user: {
              ...comment.user,
              fullName: "You",
            },
          };
        }
        return comment;
      });
  
      setCommentData((prev) => ({ ...prev, [postId]: transformedData }));
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

    setIsPosting(true);

    const tempCommentId = Math.random().toString(36).substr(2, 9);

    const newComment: ForumCommentInterface = {
      id: tempCommentId,
      postId,
      content: commentFieldValue,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(), 
      userId: session?.user?.id || "unknown",
      user: {
        id: session?.user?.id || "unknown",
        fullName: "You", 
      },
    };

    setCommentData((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    setCommentFieldValue("");

    try {
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

      const returnedComment = await response.json();

      // Replace the temporary comment with the returned comment
      setCommentData((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === tempCommentId
            ? {
                ...returnedComment,
                user: {
                  ...returnedComment.user,
                  fullName:
                    returnedComment.userId === session?.user.id
                      ? "You"
                      : returnedComment.user.fullName,
                },
              }
            : comment
        ),
      }));
    } catch (error) {
      setCommentData((prev) => ({
        ...prev,
        [postId]: prev[postId].filter(
          (comment) => comment.id !== tempCommentId
        ),
      }));

      console.error("Error posting comment:", error);
      toast({
        title: "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false); 
    }
  };

  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    const id = param.get("id");
    setCourseId(id);
    setIsLoading(true);
    if (id !== null) {
      getForumData(id);
    }

    const sideBarDataFromLocalStorage = getSideBarDataFromLocalStorage(id);

    if (sideBarDataFromLocalStorage) {
      setSideBarData(sideBarDataFromLocalStorage);
      setIsLoading(false);
    }
    else {
      console.log("Fetching course data from server");
      getCourses(id, session?.user.id)
      .then((data) => {
        const newSideBarData = {
          materialData: data.materials,
          assignmentData: data.assignments,
          titleData: data.title,
        };
        setSideBarData(newSideBarData);
      })
      .catch((error) => {
        console.error("Error fetching course data:", error);
        setIsForumAvailable(false);
        toast({
          title: "Course not found",
          variant: "destructive",
        });
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, []);

  if (isLoading) {
    return <LoadingBouncer />;
  }
  return (
    <div className="min-h-screen w-screen flex flex-row bg-primary text-secondary font-nunito">
      <CoursesBar
        title={""}
        materials={sideBarData?.materialData || []}
        assignments={sideBarData?.assignmentData || []}
        active={{ type: "forum", id: "view-forum" }}
      />
      {!isLoading && isForumAvailable && (
        <div className="flex flex-col h-screen pl-[18rem] pt-[6rem] w-full pr-20">
          <div className="my-5 font-nunito font-bold text-3xl">
            {`Forum Discussions`}
          </div>
          {forumData &&
            forumData.map((post: ForumPostInterface, index: number) => {
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
                          setPostId("");
                        }}
                        className="flex pl-2 mt-2 mb-1 items-center hover:cursor-pointer w-fit"
                      >
                        <FaAngleUp />
                        <div className="ml-1 text-sm font-bold">{`Hide ${post._count.comments} replies`}</div>
                      </div>
                      <div className="my-2 ml-2 bg-primary shadow-sm shadow-grays p-2 pt-1 w-[40%]">
                        <div>Reply to this thread</div>
                        <textarea
                          value={commentFieldValue}
                          onChange={(e) => {
                            setCommentFieldValue(e.target.value);
                          }}
                          className="mt-1 py-1 px-2 rounded-md h-10 w-full border border-grays"
                        />
                        {commentFieldValue.length > 0 && (
                          <button
                            onClick={async () => {
                              if (courseId) {
                                await postForumComment(post.id);
                              }
                            }}
                            className="mt-2 bg-fourth hover:shadow-md text-white text-sm rounded-md py-1 px-3"
                            disabled={isPosting} // Disable button while posting
                          >
                            {isPosting ? "Posting..." : "Reply"}
                          </button>
                        )}
                      </div>
                      <div className="mt-1 ml-2">
                        {commentData[post.id]?.map(
                          (comment: ForumCommentInterface, index: number) => {
                            return (
                              <div
                                key={index}
                                className="flex flex-col border-t-2 p-3 justify-between"
                              >
                                <div className="text-sm font-semibold mb-1">
                                  {new Date(
                                    comment.createdAt
                                  ).toLocaleString()}{" "}
                                  -{" "}
                                  {comment.user.fullName === "You"
                                    ? "You"
                                    : comment.user.fullName}
                                </div>
                                <div className="text-sm">
                                  {comment.content}
                                </div>
                              </div>
                            );
                          }
                        )}
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
  );
};

export default ViewForumPage;

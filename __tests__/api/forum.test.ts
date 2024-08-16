import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { GET as getForum } from "@/app/api/forum/route";
import { POST as createForumPost } from "@/app/api/forum/create/route";
import { GET as getComments } from "@/app/api/forum/forum-comment/route";
import { POST as createComment } from "@/app/api/forum/forum-comment/create/route";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    forum: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    forumPost: {
      create: jest.fn(),
    },
    forumComment: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

describe("GET /api/forum", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should return 401 if the user is not authenticated", async () => {
      const req = new NextRequest("http://localhost:3000/api/forum");
  
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);
  
      const res = await getForum(req);
      expect(res.status).toBe(401);
  
      const json = await res.json();
      expect(json.message).toBe("Not authenticated");
    });
  
    it("should return 400 if courseId is missing", async () => {
      const session = { user: { role: "STUDENT" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
  
      const req = new NextRequest("http://localhost:3000/api/forum");
  
      const res = await getForum(req);
      expect(res.status).toBe(400);
  
      const json = await res.json();
      expect(json.message).toBe("Course ID is required");
    });
  
    it("should return 404 if the forum is not found", async () => {
      const session = { user: { role: "STUDENT" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
      (prisma.forum.findFirst as jest.Mock).mockResolvedValueOnce(null);
  
      const req = new NextRequest("http://localhost:3000/api/forum?courseId=course1");
  
      const res = await getForum(req);
      expect(res.status).toBe(404);
  
      const json = await res.json();
      expect(json.message).toBe("Forum not found");
    });
  
    it("should return 200 and the forum data if the forum is found", async () => {
      const session = { user: { role: "STUDENT" } };
      const forum = {
        id: "forum1",
        posts: [
          {
            id: "post1",
            title: "Post Title",
            content: "Post Content",
            createdAt: new Date(),
            updatedAt: new Date(),
            user: { id: "user1", fullName: "John Doe" },
            _count: { comments: 2 },
          },
        ],
      };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
      (prisma.forum.findFirst as jest.Mock).mockResolvedValueOnce(forum);
  
      const req = new NextRequest("http://localhost:3000/api/forum?courseId=course1");
  
      const res = await getForum(req);
      expect(res.status).toBe(200);
  
      const json = await res.json();
      expect(json).toEqual(forum);
    });
  
    it("should return 500 if there is an internal server error", async () => {
      const session = { user: { role: "STUDENT" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
      (prisma.forum.findFirst as jest.Mock).mockRejectedValueOnce(new Error("Database error"));
  
      const req = new NextRequest("http://localhost:3000/api/forum?courseId=course1");
  
      const res = await getForum(req);
      expect(res.status).toBe(500);
  
      const json = await res.json();
      expect(json.message).toBe("Internal Server Error");
    });
  });
  
  describe("POST /api/forum/create", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should return 401 if the user is not authenticated", async () => {
      const req = new NextRequest("http://localhost:3000/api/forum/create", {
        method: "POST",
      });
  
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);
  
      const res = await createForumPost(req);
      expect(res.status).toBe(401);
  
      const json = await res.json();
      expect(json.message).toBe("Not authenticated");
    });
  
    it("should return 400 if courseId, postTitle, or postContent is missing", async () => {
      const session = { user: { id: "user1" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
  
      const req = new NextRequest("http://localhost:3000/api/forum/create", {
        method: "POST",
        body: JSON.stringify({}),
      });
  
      const res = await createForumPost(req);
      expect(res.status).toBe(400);
  
      const json = await res.json();
      expect(json.message).toBe("Course ID, post title, and post content are required");
    });
  
    it("should create a new forum if it does not exist", async () => {
      const session = { user: { id: "user1" } };
      const newForum = { id: "forum1", courseId: "course1" };
      const newPost = {
        id: "post1",
        title: "Post Title",
        content: "Post Content",
        createdAt: new Date(),
        user: { id: "user1", fullName: "John Doe" },
      };
  
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
      (prisma.forum.findFirst as jest.Mock).mockResolvedValueOnce(null);
      (prisma.forum.create as jest.Mock).mockResolvedValueOnce(newForum);
      (prisma.forumPost.create as jest.Mock).mockResolvedValueOnce(newPost);
  
      const req = new NextRequest("http://localhost:3000/api/forum/create", {
        method: "POST",
        body: JSON.stringify({
          courseId: "course1",
          postTitle: "Post Title",
          postContent: "Post Content",
        }),
      });
  
      const res = await createForumPost(req);
  
      expect(prisma.forum.create).toHaveBeenCalledWith({
        data: { courseId: "course1" },
      });
  
      expect(prisma.forumPost.create).toHaveBeenCalledWith({
        data: {
          title: "Post Title",
          content: "Post Content",
          userId: session.user.id,
          forumId: newForum.id,
          courseId: "course1",
        },
        include: { user: { select: { id: true, fullName: true } } },
      });
  
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({
        forumId: newForum.id,
        postId: newPost.id,
        title: newPost.title,
        content: newPost.content,
        createdAt: newPost.createdAt,
        user: newPost.user,
      });
    });
  
    it("should return 500 if there is an internal server error", async () => {
      const session = { user: { id: "user1" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
      (prisma.forum.create as jest.Mock).mockRejectedValueOnce(new Error("Database error"));
  
      const req = new NextRequest("http://localhost:3000/api/forum/create", {
        method: "POST",
        body: JSON.stringify({
          courseId: "course1",
          postTitle: "Post Title",
          postContent: "Post Content",
        }),
      });
  
      const res = await createForumPost(req);
      expect(res.status).toBe(500);
  
      const json = await res.json();
      expect(json.message).toBe("Internal Server Error");
    });
  });

  describe("GET /api/forum/forum-comment", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should return 400 if postId is missing", async () => {
      const req = new NextRequest("http://localhost:3000/api/forum/comments");
  
      const res = await getComments(req);
      expect(res.status).toBe(400);
  
      const json = await res.json();
      expect(json.message).toBe("Post ID is required");
    });
  
    it("should return 200 and the comments for the post", async () => {
      const comments = [
        {
          id: "2e4343d5-9ae2-4f4e-b228-6b6e4b018473",
          content: "Halo",
          createdAt: new Date(),
          user: { id: "d15a9663-c457-4ea4-a5e9-d0b6a830ea66", fullName: "Amano Hina" },
        },
      ];
      (prisma.forumComment.findMany as jest.Mock).mockResolvedValueOnce(comments);
  
      const req = new NextRequest("http://localhost:3000/api/forum/comments?postId=post1");
  
      const res = await getComments(req);
      expect(res.status).toBe(200);
  
      const json = await res.json();
      expect(json).toEqual(comments);
    });
  
    it("should return 500 if there is an internal server error", async () => {
      (prisma.forumComment.findMany as jest.Mock).mockRejectedValueOnce(new Error("Database error"));
  
      const req = new NextRequest("http://localhost:3000/api/forum/comments?postId=post1");
  
      const res = await getComments(req);
      expect(res.status).toBe(500);
  
      const json = await res.json();
      expect(json.message).toBe("Internal Server Error");
    });
  });
  

  describe("POST /api/forum/forum-comment/create", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should return 401 if the user is not authenticated", async () => {
      const req = new NextRequest("http://localhost:3000/api/forum/comments/create", {
        method: "POST",
      });
  
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);
  
      const res = await createComment(req);
      expect(res.status).toBe(401);
  
      const json = await res.json();
      expect(json.message).toBe("Not authenticated");
    });
  
    it("should return 400 if content is missing", async () => {
      const session = { user: { id: "user1" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
  
      const req = new NextRequest("http://localhost:3000/api/forum/comments/create", {
        method: "POST",
        body: JSON.stringify({}),
      });
  
      const res = await createComment(req);
      expect(res.status).toBe(400);
  
      const json = await res.json();
      expect(json.message).toBe("Content is required for the comment");
    });
  
    it("should create a new comment", async () => {
      const session = { user: { id: "user1" } };
      const newComment = {
        id: "comment1",
        content: "Comment Content",
        createdAt: new Date(),
        postId: "post1",
        userId: "user1",
      };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
      (prisma.forumComment.create as jest.Mock).mockResolvedValueOnce(newComment);
  
      const req = new NextRequest("http://localhost:3000/api/forum/comments/create", {
        method: "POST",
        body: JSON.stringify({ postId: "post1", content: "Comment Content" }),
      });
  
      const res = await createComment(req);
      expect(res.status).toBe(200);
  
      const json = await res.json();
      expect(json).toEqual(newComment);
    });
  
    it("should return 500 if there is an internal server error", async () => {
      const session = { user: { id: "user1" } };
      (getServerSession as jest.Mock).mockResolvedValueOnce(session);
      (prisma.forumComment.create as jest.Mock).mockRejectedValueOnce(new Error("Database error"));
  
      const req = new NextRequest("http://localhost:3000/api/forum/comments/create", {
        method: "POST",
        body: JSON.stringify({ postId: "post1", content: "Comment Content" }),
      });
  
      const res = await createComment(req);
      expect(res.status).toBe(500);
  
      const json = await res.json();
      expect(json.message).toBe("Internal Server Error");
    });
  });
  
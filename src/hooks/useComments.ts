import { useState, useEffect, useCallback, useRef } from "react";
import type { Comment } from "../types";

const STORAGE_KEY = "comments-app-data";

export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const isLoadingRef = useRef(false);

  // Load comments from localStorage on mount
  useEffect(() => {
    isLoadingRef.current = true;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const commentsWithDates = parsed.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt),
          replies: comment.replies.map((reply: any) => ({
            ...reply,
            createdAt: new Date(reply.createdAt),
          })),
        }));
        setComments(commentsWithDates);
      } catch (error) {
        console.error("Failed to parse stored comments:", error);
      }
    }
    isLoadingRef.current = false;
  }, []);

  // Save comments to localStorage whenever comments change (but not during initial load)
  useEffect(() => {
    if (isLoadingRef.current) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  }, [comments]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Only handle storage events from other tabs (not our own dispatched events)
      if (
        e.key === STORAGE_KEY &&
        e.newValue &&
        e.storageArea === localStorage
      ) {
        try {
          const parsed = JSON.parse(e.newValue);
          const commentsWithDates = parsed.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt),
            replies: comment.replies.map((reply: any) => ({
              ...reply,
              createdAt: new Date(reply.createdAt),
            })),
          }));
          setComments(commentsWithDates);
        } catch (error) {
          console.error("Failed to parse storage event data:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addComment = useCallback((text: string, parentId?: string) => {
    const newComment: Comment = {
      id: crypto.randomUUID(),
      text: text.trim(),
      createdAt: new Date(),
      parentId,
      replies: [],
    };

    setComments((prevComments) => {
      if (!parentId) {
        // Top-level comment
        return [...prevComments, newComment];
      } else {
        // Reply to existing comment
        return prevComments.map((comment) =>
          addReplyToComment(comment, newComment, parentId),
        );
      }
    });
  }, []);

  const deleteComment = useCallback((id: string) => {
    setComments((prevComments) =>
      prevComments
        .filter((comment) => comment.id !== id)
        .map((comment) => removeReplyFromComment(comment, id)),
    );
  }, []);

  return {
    comments,
    addComment,
    deleteComment,
  };
};

// Helper function to add a reply to a comment recursively
const addReplyToComment = (
  comment: Comment,
  newReply: Comment,
  parentId: string,
): Comment => {
  if (comment.id === parentId) {
    return {
      ...comment,
      replies: [...comment.replies, newReply],
    };
  }

  return {
    ...comment,
    replies: comment.replies.map((reply) =>
      addReplyToComment(reply, newReply, parentId),
    ),
  };
};

// Helper function to remove a reply from a comment recursively
const removeReplyFromComment = (comment: Comment, replyId: string): Comment => {
  return {
    ...comment,
    replies: comment.replies
      .filter((reply) => reply.id !== replyId)
      .map((reply) => removeReplyFromComment(reply, replyId)),
  };
};

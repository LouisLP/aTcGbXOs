import { useState, useEffect, useCallback, useRef } from "react";
import type { Comment, SerializedComment } from "../types";

const STORAGE_KEY = "comments-app-data";

export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const isLoadingRef = useRef(false);

  // Helper function to convert serialized comment to Comment with Date objects
  const deserializeComment = useCallback(
    (serialized: SerializedComment): Comment => ({
      ...serialized,
      createdAt: new Date(serialized.createdAt),
      replies: serialized.replies.map(deserializeComment),
    }),
    [],
  );

  // Helper function to parse and validate stored comments
  const parseStoredComments = useCallback(
    (stored: string): Comment[] => {
      const parsed: SerializedComment[] = JSON.parse(stored);
      return parsed.map(deserializeComment);
    },
    [deserializeComment],
  );

  // Load comments from localStorage on mount
  useEffect(() => {
    isLoadingRef.current = true;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const commentsWithDates = parseStoredComments(stored);
        setComments(commentsWithDates);
      } catch (error) {
        console.error("Failed to parse stored comments:", error);
      }
    }
    isLoadingRef.current = false;
  }, [parseStoredComments]);

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
          const commentsWithDates = parseStoredComments(e.newValue);
          setComments(commentsWithDates);
        } catch (error) {
          console.error("Failed to parse storage event data:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [parseStoredComments]);

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

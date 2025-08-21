import { useState, useEffect, useCallback } from "react";
import type { Comment, ApiComment } from "../types";
import { commentsApi, ApiError } from "../services/api";

export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert API comment to internal Comment type
  const apiToComment = useCallback(
    (apiComment: ApiComment): Comment => ({
      ...apiComment,
      createdAt: new Date(apiComment.createdAt),
      replies: apiComment.replies.map(apiToComment),
    }),
    [],
  );

  // Load comments from API
  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const apiComments = await commentsApi.getAll();
      const commentsWithDates = apiComments.map(apiToComment);
      setComments(commentsWithDates);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? `Failed to load comments: ${err.message}`
          : "Failed to load comments";
      setError(message);
      console.error("Error loading comments:", err);
    } finally {
      setLoading(false);
    }
  }, [apiToComment]);

  // Load comments on mount
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const addComment = useCallback(
    async (text: string, parentId?: string) => {
      try {
        setError(null);
        const newApiComment = await commentsApi.add(text, parentId);
        const newComment = apiToComment(newApiComment);

        setComments((prevComments) => {
          if (!parentId) {
            // Top-level comment
            return [...prevComments, newComment];
          } else {
            // Reply to existing comment - rebuild tree from API
            loadComments();
            return prevComments;
          }
        });
      } catch (err) {
        const message =
          err instanceof ApiError
            ? `Failed to add comment: ${err.message}`
            : "Failed to add comment";
        setError(message);
        console.error("Error adding comment:", err);
      }
    },
    [apiToComment, loadComments],
  );

  const deleteComment = useCallback(async (id: string) => {
    try {
      setError(null);
      await commentsApi.delete(id);

      // Remove from local state
      setComments((prevComments) =>
        prevComments
          .filter((comment) => comment.id !== id)
          .map((comment) => removeReplyFromComment(comment, id)),
      );
    } catch (err) {
      const message =
        err instanceof ApiError
          ? `Failed to delete comment: ${err.message}`
          : "Failed to delete comment";
      setError(message);
      console.error("Error deleting comment:", err);
    }
  }, []);

  return {
    comments,
    loading,
    error,
    addComment,
    deleteComment,
    refetch: loadComments,
  };
};

// Helper to remove a reply from a comment recursively
const removeReplyFromComment = (comment: Comment, replyId: string): Comment => {
  return {
    ...comment,
    replies: comment.replies
      .filter((reply) => reply.id !== replyId)
      .map((reply) => removeReplyFromComment(reply, replyId)),
  };
};

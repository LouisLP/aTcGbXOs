import { useState } from "react";
import type { Comment } from "../types";
import { CommentForm } from "./CommentForm";

interface CommentItemProps {
  comment: Comment;
  onReply: (text: string, parentId: string) => void;
  onDelete: (id: string) => void;
  depth?: number;
}

export const CommentItem = ({
  comment,
  onReply,
  onDelete,
  depth = 0,
}: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const handleReply = (text: string) => {
    onReply(text, comment.id);
    setShowReplyForm(false);
  };

  // Styling classes based on depth (but let's not go too crazy)
  const getDepthStyling = (depth: number) => {
    const styles = [
      {
        margin: "",
        background: "bg-white",
        border: "border-gray-200",
        leftBorder: "",
      }, // depth 0
      {
        margin: "ml-2",
        background: "bg-blue-50/50",
        border: "border-blue-200",
        leftBorder: "border-l-4 border-l-blue-400/50",
      }, // depth 1
      {
        margin: "ml-4",
        background: "bg-green-50/50",
        border: "border-green-200",
        leftBorder: "border-l-4 border-l-green-400",
      }, // depth 2
      {
        margin: "ml-6",
        background: "bg-purple-50/50",
        border: "border-purple-200",
        leftBorder: "border-l-4 border-l-purple-400",
      }, // depth 3
      {
        margin: "ml-8",
        background: "bg-orange-50/50",
        border: "border-orange-200",
        leftBorder: "border-l-4 border-l-orange-400",
      }, // depth 4
      {
        margin: "ml-10",
        background: "bg-pink-50/50",
        border: "border-pink-200",
        leftBorder: "border-l-4 border-l-pink-400",
      }, // depth 5
      {
        margin: "ml-12",
        background: "bg-indigo-50/50",
        border: "border-indigo-200",
        leftBorder: "border-l-4 border-l-indigo-400",
      }, // depth 6+
    ];

    // Cap at maximum depth to prevent excessive nesting
    const cappedDepth = Math.min(depth, styles.length - 1);
    return styles[cappedDepth];
  };

  const styling = getDepthStyling(depth);

  return (
    <div className={`space-y-3 ${styling.margin}`}>
      <div
        className={`${styling.background} ${styling.border} ${styling.leftBorder} rounded-lg border p-4 shadow-lg`}
      >
        {/* Comment header */}
        <div className="flex items-center justify-between mb-2">
          {/* Time posted (shortened) */}
          <span className="text-sm text-gray-500">
            {comment.createdAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {/* Delete button */}
          <button
            onClick={() => onDelete(comment.id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Delete
          </button>
        </div>

        {/* Comment text */}
        <p className="text-gray-800 mb-3 whitespace-pre-wrap">{comment.text}</p>

        {/* Action buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showReplyForm ? "Cancel" : "Reply"}
          </button>

          {comment.replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              {showReplies ? "Hide" : "Show"} {comment.replies.length}{" "}
              {comment.replies.length === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>

        {/* Reply form */}
        {showReplyForm && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <CommentForm
              onSubmit={handleReply}
              placeholder="Write a reply..."
              buttonText="Reply"
            />
          </div>
        )}
      </div>

      {/* Nested replies */}
      {showReplies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

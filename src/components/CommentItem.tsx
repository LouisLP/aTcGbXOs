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

  // Styling Tailwind classes based on depth (but not going too deep)
  const getDepthStyling = (depth: number) => {
    const styles = [
      {
        margin: "",
        background: "bg-gray-800",
        border: "border-gray-700",
        leftBorder: "",
      }, // depth 0
      {
        margin: "ml-2",
        background: "bg-blue-900/40",
        border: "border-blue-700",
        leftBorder: "border-l-4 border-l-blue-500",
      }, // depth 1
      {
        margin: "ml-4",
        background: "bg-green-900/40",
        border: "border-green-700",
        leftBorder: "border-l-4 border-l-green-500",
      }, // depth 2
      {
        margin: "ml-6",
        background: "bg-purple-900/40",
        border: "border-purple-700",
        leftBorder: "border-l-4 border-l-purple-500",
      }, // depth 3
      {
        margin: "ml-8",
        background: "bg-orange-900/40",
        border: "border-orange-700",
        leftBorder: "border-l-4 border-l-orange-500",
      }, // depth 4
      {
        margin: "ml-10",
        background: "bg-pink-900/40",
        border: "border-pink-700",
        leftBorder: "border-l-4 border-l-pink-500",
      }, // depth 5
      {
        margin: "ml-12",
        background: "bg-indigo-900/40",
        border: "border-indigo-700",
        leftBorder: "border-l-4 border-l-indigo-500",
      }, // depth 6+
    ];

    // Cap at maximum depth to prevent excessive nesting
    const cappedDepth = Math.min(depth, styles.length - 1);
    return styles[cappedDepth];
  };

  const styling = getDepthStyling(depth);

  return (
    <div id={`comment-${comment.id}`} className={`space-y-3 ${styling.margin}`}>
      <div
        className={`${styling.background} ${styling.border} ${styling.leftBorder} rounded-lg border p-4 shadow-lg`}
      >
        {/* Comment header */}
        <div className="flex items-center justify-between mb-2">
          {/* Time posted (shortened) */}
          <span className="text-sm text-gray-400">
            {comment.createdAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {/* Delete button */}
          <button
            onClick={() => onDelete(comment.id)}
            className="text-red-300 hover:text-red-200 text-sm font-medium bg-red-900 rounded-md p-2 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
            </svg>
          </button>
        </div>

        {/* Comment text */}
        <p className="text-gray-100 mb-3 whitespace-pre-wrap">{comment.text}</p>

        {/* Action buttons */}
        <div className="flex items-center space-x-3 align-middle">
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-blue-300 hover:text-blue-200 text-sm font-medium bg-blue-900 rounded-md p-2 transition-all"
          >
            {showReplyForm ? "Cancel" : "Reply"}
          </button>

          {comment.replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 text-sm font-medium"
            >
              {showReplies ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="flex-shrink-0"
                  >
                    <path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z"></path>
                  </svg>
                  <span>
                    Hide {comment.replies.length}{" "}
                    {comment.replies.length === 1 ? "reply" : "replies"}
                  </span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="flex-shrink-0"
                  >
                    <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
                  </svg>
                  <span>
                    Show {comment.replies.length}{" "}
                    {comment.replies.length === 1 ? "reply" : "replies"}
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Reply form */}
        {showReplyForm && (
          <div className="mt-3 pt-3 border-t border-gray-600">
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

import type { Comment } from "../types";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  onReply: (text: string, parentId: string) => void;
  onDelete: (id: string) => void;
}

export const CommentList = ({
  comments,
  onReply,
  onDelete,
}: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={onReply}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

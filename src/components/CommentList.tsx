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
      <div className="text-center py-8 text-gray-400">
        <p>
          No comments yet.{" "}
          <span className="font-semibold">
            Be the change you wish to see in the world.
          </span>
        </p>
      </div>
    );
  }

  return (
    <article id="comment-list" className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={onReply}
          onDelete={onDelete}
        />
      ))}
    </article>
  );
};

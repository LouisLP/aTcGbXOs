import type { DbComment } from "../db/index.js";
import type { Comment, ApiComment } from "../types/index.js";

// Convert flat DB comments to nested structure
export function buildCommentTree(dbComments: DbComment[]): Comment[] {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // 1st pass: create all comment objects
  dbComments.forEach((dbComment) => {
    const comment: Comment = {
      id: dbComment.id,
      text: dbComment.text,
      createdAt: new Date(dbComment.created_at),
      parentId: dbComment.parent_id || undefined,
      replies: [],
    };
    commentMap.set(comment.id, comment);
  });

  // 2nd pass: build the tree structure
  dbComments.forEach((dbComment) => {
    const comment = commentMap.get(dbComment.id) as Comment;

    if (dbComment.parent_id) {
      const parent = commentMap.get(dbComment.parent_id);
      if (parent) {
        parent.replies.push(comment);
      }
    } else {
      rootComments.push(comment);
    }
  });

  return rootComments;
}

// Convert Comment to ApiComment (serialize dates)
export function commentToApi(comment: Comment): ApiComment {
  return {
    id: comment.id,
    text: comment.text,
    createdAt: comment.createdAt.toISOString(),
    parentId: comment.parentId,
    replies: comment.replies.map(commentToApi),
  };
}

// Convert ApiComment to Comment (deserialize dates)
export function apiToComment(apiComment: ApiComment): Comment {
  return {
    id: apiComment.id,
    text: apiComment.text,
    createdAt: new Date(apiComment.createdAt),
    parentId: apiComment.parentId,
    replies: apiComment.replies.map(apiToComment),
  };
}

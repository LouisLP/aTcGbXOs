export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  parentId?: string;
  replies: Comment[];
}

export interface CommentStore {
  comments: Comment[];
  addComment: (text: string, parentId?: string) => void;
  deleteComment: (id: string) => void;
}

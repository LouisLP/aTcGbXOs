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

export interface SerializedComment {
  id: string;
  text: string;
  createdAt: string; // Date as regular string when serialized
  parentId?: string;
  replies: SerializedComment[];
}

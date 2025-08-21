export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  parentId?: string;
  replies: Comment[];
}

export interface ApiComment {
  id: string;
  text: string;
  createdAt: string;
  parentId?: string;
  replies: ApiComment[];
}

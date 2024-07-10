export type Todo = {
  id: number;
  task: string;
  completed?: boolean;
  // email: string;
};

export interface User {
  id: string;
  username: string;
  email: string;
  profileName: string;
  profilePicture: string;
  isPremium: boolean;
  accessToken: string;
  timestamp: number;
}

export type Post = {
  id: string;
  content: string;
  author: User;
  authorId: string;
  createdAt: number;
  updatedAT: number;
};

export type Comment = {
  id: string;
  content: string;
  author: User;
  post: Post;
  authorId: string;
  postId: string;
  createdAt: number;
  updatedAT: number;
};

export type Like = {
  id: string;
  user: User;
  userId: string;
  post?: Post;
  postId?: string;
  comment?: Comment;
  commentId?: string;
  createdAt: number;
};

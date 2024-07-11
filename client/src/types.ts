export type Todo = {
  id: number;
  task: string;
  completed?: boolean;
  // email: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  profileName: string;
  profilePicture: string;
  isPremium: boolean;
  accessToken: string;
  posts: Post[];
  timestamp: number;
  likes: Like[];
  followers: User[];
  following: User[];
};

export type Post = {
  id: string;
  content: string;
  author: User;
  authorId: string;
  likes: Like[];
  comments: Comment[];
  createdAt: number;
  updatedAT: number;
};

export type Comment = {
  id: string;
  content: string;
  author: User;
  post: Post;
  postId: string;
  authorId: string;
  createdAt: number;
  updatedAT: number;
  likes: Like[];
  parentComment?: Comment[];
  parentCommentId?: string;
  replies: Comment[];
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

export type Follow = {
  id: string;
  follower: User;
  following: User;
  followerId: string;
  followingId: string;
  createdAt: number;
};

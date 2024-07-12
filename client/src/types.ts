export type UserType = {
  id: string;
  username: string;
  email: string;
  profileName: string;
  profilePicture: string;
  isPremium: boolean;
  accessToken: string;
  posts: PostType[];
  timestamp: number;
  likes: LikeType[];
  followers: UserType[];
  following: UserType[];
};

export type PostType = {
  id: string;
  content: string;
  author: UserType;
  authorId: string;
  likes: LikeType[];
  comments: CommentType[];
  createdAt: number;
  updatedAT: number;
};

export type CommentType = {
  id: string;
  content: string;
  author: UserType;
  post: PostType;
  postId: string;
  authorId: string;
  createdAt: number;
  updatedAT: number;
  likes: LikeType[];
  parentComment?: CommentType[];
  parentCommentId?: string;
  replies: CommentType[];
};

export type LikeType = {
  id: string;
  user: UserType;
  userId: string;
  post?: PostType;
  postId?: string;
  comment?: CommentType;
  commentId?: string;
  createdAt: number;
};

export type FollowType = {
  id: string;
  follower: UserType;
  following: UserType;
  followerId: string;
  followingId: string;
  createdAt: number;
};

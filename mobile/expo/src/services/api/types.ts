import { AxiosResponse } from 'axios';

export type Guid = string;
export type ApiResponse<T, D = any> = Promise<AxiosResponse<T, D>>;
export type ApiDate = string;

export type User = {
  id: Guid;
  username: string;
  role: string;
  createdAt: ApiDate;
  updatedAt: ApiDate;
};
export type UpdateUser = {
  role: string;
};

export type Post = {
  id: Guid;
  content: string;
  likes: number;
  createdAt: ApiDate;
  updatedAt: ApiDate;
};
export type PostCreate = {
  content: string;
};

export type Comment = {
  id: Guid;
  content: string;
  likes: number;
  author?: User;
  commentParent?: Comment;
  postParent?: Post;
  createdAt: ApiDate;
  updatedAt: ApiDate;
};
export type CommentCreate = {
  content: string;
};

export type AuthLogin = {
  username: string;
  password: string;
};
export type AuthLoginResponse = {
  token: string;
  user: User;
};

export type AuthRegister = {
  username: string;
  password: string;
};

export type Api = {
  auth: {
    login: (body: AuthLogin) => ApiResponse<AuthLoginResponse>;
    register: (body: AuthRegister) => ApiResponse<User>;
  };
  posts: {
    findMany: (userId: Guid) => ApiResponse<Post[]>;
    create: (body: PostCreate) => ApiResponse<Post>;
    findComments: (postId: Guid) => ApiResponse<Comment[]>;
    createComment: (postId: Guid, body: CommentCreate) => ApiResponse<Comment>;
  };
  comments: {
    findOne: (commentId: Guid) => ApiResponse<Comment>;
    findAnswers: (commentId: Guid) => ApiResponse<Comment>;
  };
  users: {
    findMany: () => ApiResponse<User[]>;
    findOne: (userId: Guid) => ApiResponse<User>;
    update: (userId: Guid, data: Partial<UpdateUser>) => ApiResponse<User>;
  };
  enableAuthentication: (token: string) => void;
  disableAuthentication: () => void;
};

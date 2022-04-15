import { Api, ApiResponse } from '../types';

export const StatusCode = {
  Ok: 200,
  Created: 201,
};

type FakeResponse<T> = {
  data: T;
  status: number;
};

export function fakeResponse<T>(
  result: FakeResponse<T>,
  timeout = 500,
): ApiResponse<T> {
  return new Promise(resolve =>
    setTimeout(
      () =>
        resolve({
          data: result.data,
          status: result.status,
          statusText: null as any,
          config: null as any,
          headers: null as any,
          then: null as any,
        }),
      timeout,
    ),
  );
}

const fakeUser = {
  id: '1',
  role: 'user',
  username: 'user',
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};
const fakeComment = {
  id: '1',
  content: 'fake comment',
  likes: 100,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
const fakePost = {
  id: '1',
  content: 'fake post',
  likes: 99,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const api: Api = {
  auth: {
    login(body) {
      return fakeResponse({
        data: {
          token: 'fake-token',
          user: fakeUser,
        },
        status: StatusCode.Ok,
      });
    },
    register(body) {
      return fakeResponse({
        data: fakeUser,
        status: StatusCode.Created,
      });
    },
  },
  comments: {
    findOne(commentId) {
      return fakeResponse({
        data: fakeComment,
        status: StatusCode.Ok,
      });
    },
    findAnswers(commentId) {
      return fakeResponse({
        data: fakeComment,
        status: StatusCode.Ok,
      });
    },
  },
  posts: {
    create(body) {
      return fakeResponse({
        data: fakePost,
        status: StatusCode.Ok,
      });
    },
    createComment(postId, body) {
      return fakeResponse({
        data: {
          ...fakeComment,
          ...body,
        },
        status: StatusCode.Ok,
      });
    },
    findComments(postId) {
      return fakeResponse({
        data: [fakeComment],
        status: StatusCode.Ok,
      });
    },
    findMany(userId) {
      return fakeResponse({
        data: [fakePost],
        status: StatusCode.Ok,
      });
    },
  },
  users: {
    findMany() {
      return fakeResponse({
        data: [fakeUser],
        status: StatusCode.Ok,
      });
    },
    findOne(userId) {
      return fakeResponse({
        data: {
          ...fakeUser,
          id: userId,
        },
        status: StatusCode.Ok,
      });
    },
    update(userId, body) {
      return fakeResponse({
        data: {
          ...fakeUser,
          ...body,
          id: userId,
        },
        status: StatusCode.Ok,
      });
    },
  },
  enableAuthentication() {},
  disableAuthentication() {},
};

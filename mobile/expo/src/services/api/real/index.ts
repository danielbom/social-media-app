import { Api } from '../types';
import axios from './_axios';

export const api: Api = {
  auth: {
    login(body) {
      return axios.post('/Auth/Login', body);
    },
    register(body) {
      return axios.post('/Auth/Register', body);
    },
  },
  comments: {
    findOne(commentId) {
      return axios.get('/Comments/' + commentId);
    },
    findAnswers(commentId) {
      return axios.get('/Comments/' + commentId + '/Answers');
    },
  },
  posts: {
    create(body) {
      return axios.post('/Posts', body);
    },
    createComment(postId, body) {
      return axios.post('/Posts/' + postId + '/Comments', body);
    },
    findComments(postId) {
      return axios.get('/Posts/' + postId + '/Comments');
    },
    findMany(userId) {
      return axios.get('/Posts/' + userId);
    },
  },
  users: {
    findMany() {
      return axios.get('/Users');
    },
    findOne(userId) {
      return axios.get('/Users/' + userId);
    },
    update(userId, body) {
      return axios.post('/Users/' + userId, body);
    },
  },
  enableAuthentication(token: string) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  disableAuthentication() {
    delete axios.defaults.headers.common.Authorization;
  },
};

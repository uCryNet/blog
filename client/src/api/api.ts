import axios from 'axios';
import {RouteParamValue} from "vue-router";


const getPosts = () => {
  return axios.get(`post/get-all`);
}

const getOnePost = (uri: string | RouteParamValue[]) => {
  return axios.get(`post/get-one/${uri}`,);
}

const updatePost = (form: any) => {
  const formData = new FormData();

  formData.append('title', form.title);
  formData.append('text', form.text);
  formData.append('category', form.category);
  formData.append('id', form.id);
  // formData.append('image', form.image);

  return axios.put(`post/update/`, formData);
}

const createNews = (form: any) => {
  const formData = new FormData();

  formData.append('title', form.title);
  formData.append('text', form.text);
  formData.append('category', form.category);
  formData.append('image', form.image);

  return axios.post(`post/create`, formData);
}

const login = (auth: {login: string, password: string}) => {
  return axios.post(`user/login/`, auth);
}

const search = (search: string) => {
  return axios.post(`post/search`, {search});
}

const checkAccess = () => {
  return axios.get(`user/check-access`);
}

const getCategory = () => {
  return axios.get(`category/get-all`);
}

const deletePost = (id: string) => {
  return axios.delete(`/post/delete/${id}`);
}

export default {
  getPosts,
  getOnePost,
  updatePost,
  createNews,
  login,
  search,
  checkAccess,
  getCategory,
  deletePost,
}
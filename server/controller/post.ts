// Vendors
import jwt from "jsonwebtoken"

// Components
import PostService from '../services/post'
import FileService from '../services/file'

// Vars
import {SECRET_KEY} from "../config/config";
import UserService from "../services/login";


const checkLengthArticle = (res, title, text) => {
  if (title.length < 3 || title.length > 100) return res.status(400).json({message: "Check the length title"})
  if (text.length < 10 || text.length > 5000) return res.status(400).json({message: "Check the length text"})
}


class PostController {
  async getOne(req, res) {
    try {
      if (!req.params.id) return res.status(400).json({message: "Post not found"})

      const posts = await PostService.getOne(req.params.id)

      res.json(posts)
    } catch (e) {
      res.status(400).json({message: "Failed to get the post", e})
    }
  }

  async getAll(req, res) {
    try {
      const posts = await PostService.getAll()
      return res.json(posts)
    } catch (e) {
      res.status(400).json(e)
    }
  }

  async search(req, res) {
    try {
      const {search} = req.body

      if (search.trim() === "") return res.status(400).json({message: "Search filed is empty"})

      const posts = await PostService.search(search)

      return res.json(posts)
    } catch (e) {
      res.status(400).json(e)
    }
  }

  async create(req, res) {
    try {
      if (!req.body) return res.status(400).json({message: "Post create error"})

      const {title, text, category} = req.body
      const token = req.cookies.token
      const {role, id: _id} = jwt.verify(token, SECRET_KEY)

      if (!token) return res.status(400).json({message: "User is not authorized"})
      if (role !== "admin") return res.status(400).json({message: "No access"})
      if (!title || !text || !category) return res.status(400).json({message: "Fill in the required fields"})

      await checkLengthArticle(res, title, text)

      const {name} = await UserService.getUser(_id, "id")
      const imageName = req.files ? await FileService.saveImage(req.files.image) : ""
      const date = new Date().toLocaleDateString("ru-RU")

      await PostService.create({title, text, author: name, image: imageName, date, category})
      res.json({message: "Post create"})
    } catch (e) {
      res.status(400).json({message: "Post create failed", e})
    }
  }

  async delete(req, res) {
    try {
      const id = req?.params.id
      const token = req.cookies.token
      const {role} = jwt.verify(token, SECRET_KEY)

      if (!id) return res.status(400).json({message: "Post not found"})
      if (!token) return res.status(400).json({message: "User is not authorized"})
      if (role !== "admin") return res.status(400).json({message: "No access"})

      // TODO: добавить возможность удалить картинку. Для начала хотя бы только из шапки
      await PostService.delete(id)

      res.json({message: "Post deleted"})
    } catch (e) {
      res.status(400).json({message: "Post delete failed", e})
    }
  }

  async update(req, res) {
    try {
      if (!req.body) return res.status(400).json({message: "Post update error"})
      const {token, title, text, id: postId} = req.body
      const {role, id: userId} = jwt.verify(token, SECRET_KEY)

      if (!token) return res.status(400).json({message: "User is not authorized"})
      if (role !== "admin" || !userId) return res.status(400).json({message: "No access"})
      if (!title || !text || !postId) return res.status(400).json({message: "Fill in the required fields"})
      await checkLengthArticle(res, title, text)

      const getCurrentPost = await PostService.getOne(postId)
      if (!getCurrentPost._id) return res.status(400).json({message: "Post not found"})

      const imageName = req.files ? await FileService.saveImage(req.files.image) : ""
      const {name} = await UserService.getUser(userId, "id")

      const updatedPost = await PostService.update({title, text, author: name, image: imageName, id: postId})

      res.json({message: "Post updated", updatedPost})
    } catch (e) {
      res.status(400).json({message: "Post update failed", e})
    }
  }
}

export default new PostController();
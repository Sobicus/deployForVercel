import {Response, Request, Router} from "express";
import {checkAuthorization} from "../midlewares/authorization-check-middleware";
import {validationPostsMiddleware} from "../midlewares/input-posts-validation-middleware";
import {authMiddleware} from "../midlewares/auth-middleware";
import {validationCommentsContentMiddleware} from "../midlewares/input-comments-content-middleware";
import {softAuthMiddleware} from "../midlewares/soft-auth-middleware";
import {postsControllerInstance} from "./posts-controller";


export const postsRouter = Router()


postsRouter.get('/', postsControllerInstance.getAllPosts.bind(postsControllerInstance))
postsRouter.get('/:id', postsControllerInstance.findPostById.bind(postsControllerInstance))
postsRouter.post('/', checkAuthorization, ...validationPostsMiddleware, postsControllerInstance.createPost.bind(postsControllerInstance))
postsRouter.put('/:id', checkAuthorization, ...validationPostsMiddleware, postsControllerInstance.updatePost.bind(postsControllerInstance))
postsRouter.delete('/:id', checkAuthorization, postsControllerInstance.deletePost.bind(postsControllerInstance))
postsRouter.post('/:id/comments', authMiddleware, validationCommentsContentMiddleware, postsControllerInstance.createCommetByPostId.bind(postsControllerInstance))
postsRouter.get('/:id/comments', softAuthMiddleware, postsControllerInstance.findCommentsByPostId.bind(postsControllerInstance))
postsRouter.put('/:id/like-status', checkAuthorization, postsControllerInstance.likePostUpdate.bind(postsControllerInstance))





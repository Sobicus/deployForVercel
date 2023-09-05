import {Response, Request, Router} from "express";
import {checkAuthorization} from "../midlewares/authorization-check-middleware";
import {postRepository} from "../repositories/posts-repository";
import {validationPostsMidleware} from "../midlewares/input-posts-validation-middleware";

export const postsRouter = Router()

postsRouter.get('/', (req: Request, res: Response) => {
    const blogs = postRepository.findAllPosts()
    res.status(200).send(blogs)
})
postsRouter.get('/:id', (req: RequestWithParams<{ id: string }>, res: Response) => {
    const post = postRepository.findPostById(req.params.id)
    if (!post) {
        res.sendStatus(404)
        return
    }
    res.status(200).send(post)
})
postsRouter.post('/', checkAuthorization, ...validationPostsMidleware, (req: postRequestWithBody<postBodyRequest>, res: Response) => {
    let {title, shortDescription, content, blogId} = req.body
    const newPost = postRepository.createPost(title, shortDescription, content, blogId)
    res.status(201).send(newPost)
})
postsRouter.put('/:id', checkAuthorization, ...validationPostsMidleware, (req: putRequesrChangePost<{
    id: string
}, postBodyRequest>, res: Response) => {
    let {title, shortDescription, content, blogId} = req.body
    const postIsUpdated = postRepository.updatePost(req.params.id, {title, shortDescription, content, blogId})
    if (!postIsUpdated) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})
postsRouter.delete('/:id', checkAuthorization, (req: RequestWithParams<{ id: string }>, res: Response) => {
    const postIsDelete = postRepository.deletePost(req.params.id)
    if (!postIsDelete) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

type RequestWithParams<P> = Request<P, {}, {}, {}>
type postRequestWithBody<B> = Request<{}, {}, B, {}>
export type postBodyRequest = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}
type putRequesrChangePost<P, B> = Request<P, {}, B, {}>

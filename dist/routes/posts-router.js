"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const authorization_check_middleware_1 = require("../midlewares/authorization-check-middleware");
const input_posts_validation_middleware_1 = require("../midlewares/input-posts-validation-middleware");
const posts_service_1 = require("../domain/posts-service");
const pagination_helpers_1 = require("../helpers/pagination-helpers");
const auth_middleware_1 = require("../midlewares/auth-middleware");
const pagination_comments_1 = require("../helpers/pagination-comments");
const input_comments_content_middleware_1 = require("../midlewares/input-comments-content-middleware");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postsPagination = (0, pagination_helpers_1.getPostsPagination)(req.query);
    const posts = yield posts_service_1.postService.findAllPosts(postsPagination);
    res.status(200).send(posts);
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield posts_service_1.postService.findPostById(req.params.id);
    if (!post) {
        res.sendStatus(404);
        return;
    }
    return res.status(200).send(post);
}));
exports.postsRouter.post('/', authorization_check_middleware_1.checkAuthorization, ...input_posts_validation_middleware_1.validationPostsMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, shortDescription, content, blogId } = req.body;
    const newPost = yield posts_service_1.postService.createPost(title, shortDescription, content, blogId);
    if (!newPost)
        return res.sendStatus(404);
    return res.status(201).send(newPost);
}));
exports.postsRouter.put('/:id', authorization_check_middleware_1.checkAuthorization, ...input_posts_validation_middleware_1.validationPostsMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, shortDescription, content, blogId } = req.body;
    const postIsUpdated = yield posts_service_1.postService.updatePost(req.params.id, { title, shortDescription, content, blogId });
    if (!postIsUpdated) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));
exports.postsRouter.delete('/:id', authorization_check_middleware_1.checkAuthorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postIsDelete = yield posts_service_1.postService.deletePost(req.params.id);
    if (!postIsDelete) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));
exports.postsRouter.post('/:id/comments', auth_middleware_1.authMiddleware, input_comments_content_middleware_1.validationCommentsContentMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield posts_service_1.postService.findPostById(req.params.id);
    if (!post) {
        return res.sendStatus(404);
    }
    const newComment = yield posts_service_1.postService.createCommetByPostId(req.params.id, req.body.content, req.user);
    return res.status(201).send(newComment);
}));
exports.postsRouter.get('/:id/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query);
    const paggination = (0, pagination_comments_1.getCommentsPagination)(req.query);
    console.log(paggination);
    const post = yield posts_service_1.postService.findPostById(req.params.id);
    const query = req.query;
    if (!post) {
        res.sendStatus(404);
        return;
    }
    const comments = yield posts_service_1.postService.findCommentsById(req.params.id, paggination);
    return res.status(200).send(comments);
}));

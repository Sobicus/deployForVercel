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
const pagination_helpers_1 = require("../helpers/pagination-helpers");
const auth_middleware_1 = require("../midlewares/auth-middleware");
const pagination_comments_1 = require("../helpers/pagination-comments");
const input_comments_content_middleware_1 = require("../midlewares/input-comments-content-middleware");
const soft_auth_middleware_1 = require("../midlewares/soft-auth-middleware");
const composition_root_1 = require("../composition-root");
exports.postsRouter = (0, express_1.Router)();
class PostsController {
    constructor(postsQueryRepository, postService, likesPostsService) {
        this.postsQueryRepository = postsQueryRepository;
        this.postService = postService;
        this.likesPostsService = likesPostsService;
    }
    getAllPosts(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString();
            const postsPagination = (0, pagination_helpers_1.getPostsPagination)(req.query);
            const posts = yield this.postsQueryRepository.findAllPosts(postsPagination, userId);
            res.status(200).send(posts);
        });
    }
    findPostById(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString();
            const post = yield this.postsQueryRepository.findPostById(req.params.id, userId);
            if (!post) {
                res.sendStatus(404);
                return;
            }
            return res.status(200).send(post);
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { title, shortDescription, content, blogId } = req.body;
            const newPost = yield this.postService.createPost(title, shortDescription, content, blogId);
            if (!newPost)
                return res.sendStatus(404);
            return res.status(201).send(newPost);
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { title, shortDescription, content, blogId } = req.body;
            const postIsUpdated = yield this.postService.updatePost(req.params.id, {
                title,
                shortDescription,
                content,
                blogId
            });
            if (!postIsUpdated) {
                res.sendStatus(404);
                return;
            }
            res.sendStatus(204);
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postIsDelete = yield this.postService.deletePost(req.params.id);
            if (!postIsDelete) {
                res.sendStatus(404);
                return;
            }
            res.sendStatus(204);
        });
    }
    createCommetByPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = yield this.postService.createCommetByPostId(req.params.id, req.body.content, req.user);
            if (!newComment) {
                return res.sendStatus(404);
            }
            return res.status(201).send(newComment);
        });
    }
    findCommentsByPostId(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString();
            const paggination = (0, pagination_comments_1.getCommentsPagination)(req.query);
            const post = yield this.postsQueryRepository.doesPostExist(req.params.id);
            if (!post) {
                res.sendStatus(404);
                return;
            }
            const comments = yield this.postsQueryRepository.findCommentsByPostId(req.params.id, paggination, userId);
            return res.status(200).send(comments);
        });
    }
    likePostUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postLikeStatus = req.body.likeStatus;
            const userId = req.user._id.toString();
            const login = req.user.login;
            const postId = req.params.postId;
            const result = yield this.likesPostsService.likePostsUpdate(postId, userId, postLikeStatus, login);
            if (result === '404') {
                res.sendStatus(404);
                return;
            }
            return res.sendStatus(204);
        });
    }
}
const postsControllerInstance = new PostsController(composition_root_1.postQueryRepository, composition_root_1.postService, composition_root_1.likesPostsService);
exports.postsRouter.get('/', postsControllerInstance.getAllPosts.bind(postsControllerInstance));
exports.postsRouter.get('/:id', postsControllerInstance.findPostById.bind(postsControllerInstance));
exports.postsRouter.post('/', authorization_check_middleware_1.checkAuthorization, ...input_posts_validation_middleware_1.validationPostsMiddleware, postsControllerInstance.createPost.bind(postsControllerInstance));
exports.postsRouter.put('/:id', authorization_check_middleware_1.checkAuthorization, ...input_posts_validation_middleware_1.validationPostsMiddleware, postsControllerInstance.updatePost.bind(postsControllerInstance));
exports.postsRouter.delete('/:id', authorization_check_middleware_1.checkAuthorization, postsControllerInstance.deletePost.bind(postsControllerInstance));
exports.postsRouter.post('/:id/comments', auth_middleware_1.authMiddleware, input_comments_content_middleware_1.validationCommentsContentMiddleware, postsControllerInstance.createCommetByPostId.bind(postsControllerInstance));
exports.postsRouter.get('/:id/comments', soft_auth_middleware_1.softAuthMiddleware, postsControllerInstance.findCommentsByPostId.bind(postsControllerInstance));
exports.postsRouter.put('/:id/like-status', authorization_check_middleware_1.checkAuthorization, postsControllerInstance.likePostUpdate.bind(postsControllerInstance));

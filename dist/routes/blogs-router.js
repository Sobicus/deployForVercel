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
exports.blogsRouter = void 0;
const express_1 = require("express");
const authorization_check_middleware_1 = require("../midlewares/authorization-check-middleware");
const input_blogs_validation_middleware_1 = require("../midlewares/input-blogs-validation-middleware");
const pagination_helpers_1 = require("../helpers/pagination-helpers");
const input_postsByBlogId_validation_middleware_1 = require("../midlewares/input-postsByBlogId-validation-middleware");
const composition_root_1 = require("../composition-root");
const soft_auth_middleware_1 = require("../midlewares/soft-auth-middleware");
exports.blogsRouter = (0, express_1.Router)();
class BlogsController {
    constructor(blogService, blogsQueryRepository, postService) {
        this.blogsService = blogService;
        this.blogsQueryRepository = blogsQueryRepository;
        this.postService = postService;
    }
    getAllBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagination = (0, pagination_helpers_1.getBlogsPagination)(req.query);
            const blogs = yield this.blogsQueryRepository.findAllBlogs(pagination);
            res.status(200).send(blogs);
        });
    }
    getBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsQueryRepository.findBlogById(req.params.id);
            if (!blog) {
                res.sendStatus(404);
                return;
            }
            res.status(200).send(blog);
        });
    }
    getPostsByBlogId(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const blogId = req.params.id;
            const queryParam = req.query;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString();
            const posts = yield this.blogsQueryRepository.findPostByBlogId(blogId, queryParam, userId);
            if (!posts) {
                res.sendStatus(404);
                return;
            }
            res.status(200).send(posts);
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogId = req.params.id;
            const { title, shortDescription, content } = req.body;
            const post = yield this.postService.createPost(title, shortDescription, content, blogId);
            if (!post)
                return res.sendStatus(404);
            return res.status(201).send(post);
        });
    }
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = req.body;
            const createdBlog = yield this.blogsService.createBlog({ name, description, websiteUrl });
            res.status(201).send(createdBlog);
        });
    }
    updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { name, description, websiteUrl } = req.body;
            const blogIsUpdated = yield this.blogsService.updateBlog(req.params.id, { name, description, websiteUrl });
            if (!blogIsUpdated) {
                res.sendStatus(404);
                return;
            }
            res.sendStatus(204);
        });
    }
    deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogIsDeleted = yield this.blogsService.deleteBlog(req.params.id);
            if (!blogIsDeleted) {
                res.sendStatus(404);
                return;
            }
            res.sendStatus(204);
        });
    }
}
const blogsControllerInstance = new BlogsController(composition_root_1.blogService, composition_root_1.blogsQueryRepository, composition_root_1.postService);
exports.blogsRouter.get('/', blogsControllerInstance.getAllBlogs.bind(blogsControllerInstance));
exports.blogsRouter.get(':id', blogsControllerInstance.getBlogById.bind(blogsControllerInstance));
exports.blogsRouter.get('/:id/posts', soft_auth_middleware_1.softAuthMiddleware, blogsControllerInstance.getPostsByBlogId.bind(blogsControllerInstance));
exports.blogsRouter.post('/:id/posts', authorization_check_middleware_1.checkAuthorization, ...input_postsByBlogId_validation_middleware_1.validationPostsByBlogIdMidleware, blogsControllerInstance.createPost.bind(blogsControllerInstance));
exports.blogsRouter.post('/', authorization_check_middleware_1.checkAuthorization, ...input_blogs_validation_middleware_1.validationBlogsMiddleware, blogsControllerInstance.createBlog.bind(blogsControllerInstance));
exports.blogsRouter.put('/:id', authorization_check_middleware_1.checkAuthorization, ...input_blogs_validation_middleware_1.validationBlogsMiddleware, blogsControllerInstance.updateBlog.bind(blogsControllerInstance));
exports.blogsRouter.delete('/:id', authorization_check_middleware_1.checkAuthorization, blogsControllerInstance.deleteBlog.bind(blogsControllerInstance));

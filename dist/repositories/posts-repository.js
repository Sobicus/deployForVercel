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
exports.PostsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("./db");
class PostsRepository {
    findAllPosts(postsPagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield db_1.PostsModel
                .find({})
                .sort({ [postsPagination.sortBy]: postsPagination.sortDirection })
                .limit(postsPagination.pageSize)
                .skip(postsPagination.skip)
                .lean();
            const totalCount = yield db_1.PostsModel
                .countDocuments();
            const pagesCount = Math.ceil(totalCount / postsPagination.pageSize);
            const allPosts = posts.map(p => ({
                id: p._id.toString(),
                title: p.title,
                shortDescription: p.shortDescription,
                content: p.content,
                blogId: p.blogId,
                blogName: p.blogName,
                createdAt: p.createdAt
            }));
            return {
                pagesCount: pagesCount,
                page: postsPagination.pageNumber,
                pageSize: postsPagination.pageSize,
                totalCount: totalCount,
                items: allPosts
            };
        });
    }
    findPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            let post = yield db_1.PostsModel
                .findOne({ _id: new mongodb_1.ObjectId(postId) });
            if (!post) {
                return null;
            }
            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt
            };
        });
    }
    createPost(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            let blog = yield db_1.BlogsModel
                .findOne({ _id: new mongodb_1.ObjectId(newPost.blogId) });
            if (!blog)
                return null;
            let newPostByDb = yield db_1.PostsModel
                .create(Object.assign(Object.assign({}, newPost), { blogName: blog.name, _id: new mongodb_1.ObjectId() }));
            const blogName = blog.name;
            const postId = newPostByDb._id.toString();
            return { blogName, postId };
        });
    }
    updatePost(postId, updateModel) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultUpdateModel = yield db_1.PostsModel
                .updateOne({ _id: new mongodb_1.ObjectId(postId) }, { $set: updateModel });
            return resultUpdateModel.matchedCount === 1;
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultDeletePost = yield db_1.PostsModel
                .deleteOne({ _id: new mongodb_1.ObjectId(postId) });
            return resultDeletePost.deletedCount === 1;
        });
    }
    findCommentsByPostId(postId, paggination) {
        return __awaiter(this, void 0, void 0, function* () {
            // const paggination = getCommentsPagination(query)
            const commets = yield db_1.CommentsModel
                .find({ postId: postId })
                .sort({ [paggination.sortBy]: paggination.sortDirection })
                .limit(paggination.pageSize)
                .skip(paggination.skip).lean();
            const comments = commets.map(el => ({
                id: el._id.toString(),
                content: el.content,
                commentatorInfo: {
                    userId: el.userId,
                    userLogin: el.userLogin
                },
                createdAt: el.createdAt
            }));
            const totalCount = yield db_1.CommentsModel
                .countDocuments({ postId: postId });
            const pageCount = Math.ceil(totalCount / paggination.pageSize);
            return {
                pagesCount: pageCount,
                page: paggination.pageNumber,
                pageSize: paggination.pageSize,
                totalCount: totalCount,
                items: comments
            };
        });
    }
    createCommetByPostId(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = yield db_1.CommentsModel
                .create(Object.assign({}, comment)); //<CommentsRepositoryType> can not
            return {
                id: newComment._id.toString(),
                content: comment.content,
                commentatorInfo: {
                    userLogin: comment.userLogin,
                    userId: comment.userId
                },
                createdAt: comment.createdAt
            };
        });
    }
}
exports.PostsRepository = PostsRepository;

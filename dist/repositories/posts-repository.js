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
const likes_commets_repository_1 = require("./likes-commets-repository");
class PostsRepository {
    /*async findAllPosts(postsPagination: IPostPagination): Promise<PaginationType<postsViewType>> {
        const posts = await PostsModel
            .find({})
            .sort({[postsPagination.sortBy]: postsPagination.sortDirection})
            .limit(postsPagination.pageSize)
            .skip(postsPagination.skip)
            .lean()
        const totalCount = await PostsModel
            .countDocuments()
        const pagesCount = Math.ceil(totalCount / postsPagination.pageSize)
        const allPosts = posts.map(p => (
            {
                id: p._id.toString(),
                title: p.title,
                shortDescription: p.shortDescription,
                content: p.content,
                blogId: p.blogId,
                blogName: p.blogName,
                createdAt: p.createdAt
            }))
        return {
            pagesCount: pagesCount,
            page: postsPagination.pageNumber,
            pageSize: postsPagination.pageSize,
            totalCount: totalCount,
            items: allPosts
        }
    }
*/
    findPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.PostsModel.findOne({ _id: new mongodb_1.ObjectId(postId) });
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
    /*
        async findCommentsByPostId(postId: string, paggination: DefaultCommentsPaginationType, userId?: string): Promise<CommentsViewType> {
            // const paggination = getCommentsPagination(query)
            const commets = await CommentsModel
                .find({postId: postId})
                .sort({[paggination.sortBy]: paggination.sortDirection})
                .limit(paggination.pageSize)
                .skip(paggination.skip).lean()
            const comments = await Promise.all(commets.map(async el => {
                    let myStatus = LikesStatus.None

                    if (userId) {
                        const reaction = await LikesCommentsModel
                            .findOne({userId, commentId: el._id.toString()}).exec()
                        myStatus = reaction ? reaction.myStatus : LikesStatus.None
                    }
                    return {
                        id: el._id.toString(),
                        content: el.content,
                        commentatorInfo: {
                            userId: el.userId,
                            userLogin: el.userLogin
                        },
                        createdAt: el.createdAt,
                        likesInfo: {
                            likesCount: await LikesCommentsModel.countDocuments({
                                commentId: el._id.toString(),
                                myStatus: LikesStatus.Like
                            }),
                            dislikesCount: await LikesCommentsModel.countDocuments({
                                commentId: el._id.toString(),
                                myStatus: LikesStatus.Dislike
                            }),
                            myStatus: myStatus
                        }
                    }
                }
            ))
            const totalCount = await CommentsModel
                .countDocuments({postId: postId})
            const pageCount = Math.ceil(totalCount / paggination.pageSize)
            return {
                pagesCount: pageCount,
                page: paggination.pageNumber,
                pageSize: paggination.pageSize,
                totalCount: totalCount,
                items: comments
            }
        }
    */
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
                createdAt: comment.createdAt,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: likes_commets_repository_1.LikesStatus.None
                }
            };
        });
    }
}
exports.PostsRepository = PostsRepository;

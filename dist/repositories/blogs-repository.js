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
exports.BlogsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("./db");
class BlogsRepository {
    // async findAllBlogs(pagination: IBlockPagination): Promise<PaginationType<BlogViewType>> {
    //     const filter = {name: {$regex: pagination.searchNameTerm, $options: 'i'}}
    //     const blogs = await BlogsModel
    //         .find(filter)
    //         .sort({[pagination.sortBy]: pagination.sortDirection})
    //         .limit(pagination.pageSize)
    //         .skip(pagination.skip)
    //         .lean();
    //     const allBlogs = blogs.map(b => ({
    //         id: b._id.toString(),
    //         name: b.name,
    //         websiteUrl: b.websiteUrl,
    //         description: b.description,
    //         createdAt: b.createdAt,
    //         isMembership: b.isMembership
    //     }))
    //     const totalCount = await BlogsModel
    //         .countDocuments(filter)
    //     const pagesCount = Math.ceil(totalCount / pagination.pageSize)
    //
    //     return {
    //         pagesCount: pagesCount /*=== 0 ? 1 : pagesCount*/,
    //         page: pagination.pageNumber,
    //         pageSize: pagination.pageSize,
    //         totalCount: totalCount,
    //         items: allBlogs
    //     }
    // }
    /*async findBlogById(blogId: string): Promise<BlogViewType | null> {
        let blog = await BlogsModel
            .findOne({_id: new ObjectId(blogId)})
        if (!blog) {
            return null
        }
        return {
            id: blog._id.toString(),
            name: blog.name,
            websiteUrl: blog.websiteUrl,
            description: blog.description,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    }*/
    //
    // async findPostByBlogId(blogId: string, query: IQuery<SortBlogsByEnum>): Promise<PaginationType<PostsViewType> | null> {
    //     let blog = await BlogsModel
    //         .findOne({_id: new ObjectId(blogId)})
    //     if (!blog) {
    //         return null
    //     }
    //     /*const blogId = blog._id.toString()*/
    //     const pagination = getBlogsPagination(query)
    //     const posts = await PostsModel
    //         .find({blogId: blogId})
    //         .sort({[pagination.sortBy]: pagination.sortDirection})
    //         .skip(pagination.skip).limit(pagination.pageSize)
    //         .lean();
    //     const allPosts = posts.map(p => ({
    //         id: p._id.toString(),
    //         title: p.title,
    //         shortDescription: p.shortDescription,
    //         content: p.content,
    //         blogId: p.blogId,
    //         blogName: p.blogName,
    //         createdAt: p.createdAt
    //     }))
    //     const totalCount = await PostsModel
    //         .countDocuments({blogId: blogId})
    //     const pagesCount = Math.ceil(totalCount / pagination.pageSize)
    //     return {
    //         "pagesCount": pagesCount,
    //         "page": pagination.pageNumber,
    //         "pageSize": pagination.pageSize,
    //         "totalCount": totalCount,
    //         "items": allPosts
    //     }
    // }
    createBlog(createModel) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultNewBlog = yield db_1.BlogsModel
                .create(createModel);
            return resultNewBlog._id.toString();
            //.insertedId.toString()
        });
    }
    // async createPostByBlogId(title: string, shortDescription: string, content: string, blogId: string): Promise<postsViewType | null> {
    //     const createdPostByBlogId = await postService.createPost(title, shortDescription, content, blogId)
    //     if (!createdPostByBlogId) return null
    //     return createdPostByBlogId
    // }
    updateBlog(blogId, updateModel) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultUpdateModel = yield db_1.BlogsModel
                .updateOne({ _id: new mongodb_1.ObjectId(blogId) }, { $set: updateModel });
            return resultUpdateModel.matchedCount === 1;
        });
    }
    deleteBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultDeleteBlog = yield db_1.BlogsModel
                .deleteOne({ _id: new mongodb_1.ObjectId(blogId) });
            return resultDeleteBlog.deletedCount === 1;
        });
    }
}
exports.BlogsRepository = BlogsRepository;

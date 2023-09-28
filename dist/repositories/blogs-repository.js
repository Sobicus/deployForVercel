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
const db_1 = require("./db");
const mongodb_1 = require("mongodb");
class BlogsRepository {
    findAllBlogs(pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { name: { $regex: pagination.searchNameTerm, $options: 'i' } };
            const blogs = yield db_1.client.db(db_1.dataBaseName)
                .collection('blogs')
                .find(filter)
                .sort({ [pagination.sortBy]: pagination.sortDirection })
                .skip(pagination.skip)
                .limit(pagination.pageSize)
                .toArray();
            const allBlogs = blogs.map(b => ({
                id: b._id.toString(),
                name: b.name,
                websiteUrl: b.websiteUrl,
                description: b.description,
                createdAt: b.createdAt,
                isMembership: b.isMembership
            }));
            const totalCount = yield db_1.client.db(db_1.dataBaseName)
                .collection('blogs')
                .countDocuments(filter);
            const pagesCount = Math.ceil(totalCount / pagination.pageSize);
            return {
                pagesCount: pagesCount === 0 ? 1 : pagesCount,
                page: pagination.pageNumber,
                pageSize: pagination.pageSize,
                totalCount: totalCount,
                items: allBlogs
            };
        });
    }
    findBlogById(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let blog = yield db_1.client.db(db_1.dataBaseName)
                .collection('blogs')
                .findOne({ _id: new mongodb_1.ObjectId(blogId) });
            if (!blog) {
                return null;
            }
            return {
                id: blog._id.toString(),
                name: blog.name,
                websiteUrl: blog.websiteUrl,
                description: blog.description,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership
            };
        });
    }
    updateBlog(blogId, updateModel) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultUpdateModel = yield db_1.client.db(db_1.dataBaseName).collection('blogs').updateOne({ _id: new mongodb_1.ObjectId(blogId) }, { $set: updateModel });
            return resultUpdateModel.matchedCount === 1;
        });
    }
    createBlog(createModel) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultNewBlog = yield db_1.client.db(db_1.dataBaseName).collection('blogs')
                .insertOne(createModel);
            return resultNewBlog.insertedId.toString();
        });
    }
    deleteBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultDeleteBlog = yield db_1.client.db(db_1.dataBaseName).collection('blogs').deleteOne({ _id: new mongodb_1.ObjectId(blogId) });
            return resultDeleteBlog.deletedCount === 1;
        });
    }
}
exports.BlogsRepository = BlogsRepository;

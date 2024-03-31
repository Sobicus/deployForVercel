import { Controller, Delete } from "@nestjs/common";
import { UsersRepository } from "../../users/infrastructure/users.repository";
import { BlogsRepository } from "../../blogs/infrastructure/blogs.repository";
import { PostsRepository } from "../../posts/infrastructure/posts.repository";

@Controller("/testing/all-data")
export class TestingAllDataController {
  constructor(private userRepository: UsersRepository, private blogRepository: BlogsRepository, private postRepository: PostsRepository) {
  }

  @Delete()
  async deleteAllBD() {
    await this.blogRepository.deleteAll();
    await this.userRepository.deleteAll();
    await this.postRepository.deleteALl();
  }
}
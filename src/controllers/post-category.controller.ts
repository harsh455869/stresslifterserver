import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Post,
  Category,
} from '../models';
import {PostRepository} from '../repositories';

export class PostCategoryController {
  constructor(
    @repository(PostRepository)
    public postRepository: PostRepository,
  ) { }

  @get('/posts/{id}/category', {
    responses: {
      '200': {
        description: 'Category belonging to Post',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Category),
          },
        },
      },
    },
  })
  async getCategory(
    @param.path.string('id') id: typeof Post.prototype.postId,
  ): Promise<Category> {
    return this.postRepository.category(id);
  }
}

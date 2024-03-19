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
  User,
} from '../models';
import {PostRepository} from '../repositories';

export class PostUserController {
  constructor(
    @repository(PostRepository)
    public postRepository: PostRepository,
  ) { }

  @get('/posts/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Post',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Post.prototype.postId,
  ): Promise<User> {
    return this.postRepository.user(id);
  }
}

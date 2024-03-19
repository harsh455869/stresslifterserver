import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Category,
  User,
} from '../models';
import {CategoryRepository} from '../repositories';

export class CategoryUserController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
  ) { }

  @get('/categories/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Category',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Category.prototype.categoryId,
  ): Promise<User> {
    return this.categoryRepository.user(id);
  }
}

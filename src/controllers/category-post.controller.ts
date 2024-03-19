import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Category,
  Post,
} from '../models';
import {CategoryRepository} from '../repositories';

export class CategoryPostController {
  constructor(
    @repository(CategoryRepository) protected categoryRepository: CategoryRepository,
  ) { }

  @get('/categories/{id}/posts', {
    responses: {
      '200': {
        description: 'Array of Category has many Post',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Post)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Post>,
  ): Promise<Post[]> {
    return this.categoryRepository.posts(id).find(filter);
  }

  @post('/categories/{id}/posts', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {'application/json': {schema: getModelSchemaRef(Post)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Category.prototype.categoryId,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Post, {
            title: 'NewPostInCategory',
            exclude: ['postId'],
            optional: ['categoryId']
          }),
        },
      },
    }) post: Omit<Post, 'postId'>,
  ): Promise<Post> {
    return this.categoryRepository.posts(id).create(post);
  }

  @patch('/categories/{id}/posts', {
    responses: {
      '200': {
        description: 'Category.Post PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Post, {partial: true}),
        },
      },
    })
    post: Partial<Post>,
    @param.query.object('where', getWhereSchemaFor(Post)) where?: Where<Post>,
  ): Promise<Count> {
    return this.categoryRepository.posts(id).patch(post, where);
  }

  @del('/categories/{id}/posts', {
    responses: {
      '200': {
        description: 'Category.Post DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Post)) where?: Where<Post>,
  ): Promise<Count> {
    return this.categoryRepository.posts(id).delete(where);
  }
}

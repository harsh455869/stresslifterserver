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
  User,
  Follow,
} from '../models';
import {UserRepository} from '../repositories';

export class UserFollowController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/follows', {
    responses: {
      '200': {
        description: 'Array of User has many Follow',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Follow)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Follow>,
  ): Promise<Follow[]> {
    return this.userRepository.followers(id).find(filter);
  }

  @post('/users/{id}/follows', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Follow)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.userId,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Follow, {
            title: 'NewFollowInUser',
            exclude: ['followId'],
            optional: ['followedTo']
          }),
        },
      },
    }) follow: Omit<Follow, 'followId'>,
  ): Promise<Follow> {
    return this.userRepository.followers(id).create(follow);
  }

  @patch('/users/{id}/follows', {
    responses: {
      '200': {
        description: 'User.Follow PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Follow, {partial: true}),
        },
      },
    })
    follow: Partial<Follow>,
    @param.query.object('where', getWhereSchemaFor(Follow)) where?: Where<Follow>,
  ): Promise<Count> {
    return this.userRepository.followers(id).patch(follow, where);
  }

  @del('/users/{id}/follows', {
    responses: {
      '200': {
        description: 'User.Follow DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Follow)) where?: Where<Follow>,
  ): Promise<Count> {
    return this.userRepository.followers(id).delete(where);
  }
}

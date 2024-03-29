import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Follow} from '../models';
import {FollowRepository} from '../repositories';

export class FollowController {
  constructor(
    @repository(FollowRepository)
    public followRepository : FollowRepository,
  ) {}

  @post('/follows')
  @response(200, {
    description: 'Follow model instance',
    content: {'application/json': {schema: getModelSchemaRef(Follow)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Follow, {
            title: 'NewFollow',
            exclude: ['followId'],
          }),
        },
      },
    })
    follow: Omit<Follow, 'followId'>,
  ): Promise<Follow> {
    return this.followRepository.create(follow);
  }

  @get('/follows/count')
  @response(200, {
    description: 'Follow model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Follow) where?: Where<Follow>,
  ): Promise<Count> {
    return this.followRepository.count(where);
  }

  @get('/follows')
  @response(200, {
    description: 'Array of Follow model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Follow, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Follow) filter?: Filter<Follow>,
  ): Promise<Follow[]> {
    return this.followRepository.find(filter);
  }

  @patch('/follows')
  @response(200, {
    description: 'Follow PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Follow, {partial: true}),
        },
      },
    })
    follow: Follow,
    @param.where(Follow) where?: Where<Follow>,
  ): Promise<Count> {
    return this.followRepository.updateAll(follow, where);
  }

  @get('/follows/{id}')
  @response(200, {
    description: 'Follow model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Follow, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Follow, {exclude: 'where'}) filter?: FilterExcludingWhere<Follow>
  ): Promise<Follow> {
    return this.followRepository.findById(id, filter);
  }

  @patch('/follows/{id}')
  @response(204, {
    description: 'Follow PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Follow, {partial: true}),
        },
      },
    })
    follow: Follow,
  ): Promise<void> {
    await this.followRepository.updateById(id, follow);
  }

  @put('/follows/{id}')
  @response(204, {
    description: 'Follow PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() follow: Follow,
  ): Promise<void> {
    await this.followRepository.replaceById(id, follow);
  }

  @del('/follows/{id}')
  @response(204, {
    description: 'Follow DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.followRepository.deleteById(id);
  }
}

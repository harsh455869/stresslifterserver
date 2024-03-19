import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Follow,
  User,
} from '../models';
import {FollowRepository} from '../repositories';

export class FollowUserController {
  constructor(
    @repository(FollowRepository)
    public followRepository: FollowRepository,
  ) { }

  @get('/follows/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Follow',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Follow.prototype.followId,
  ): Promise<User> {
    return this.followRepository.follower(id);
  }
}

import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Follow, FollowRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class FollowRepository extends DefaultCrudRepository<
  Follow,
  typeof Follow.prototype.followId,
  FollowRelations
> {

  public readonly following: BelongsToAccessor<User, typeof Follow.prototype.followId>;

  public readonly follower: BelongsToAccessor<User, typeof Follow.prototype.followId>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Follow, dataSource);
    this.follower = this.createBelongsToAccessorFor('follower', userRepositoryGetter,);
    this.registerInclusionResolver('follower', this.follower.inclusionResolver);
    this.following = this.createBelongsToAccessorFor('following', userRepositoryGetter,);
    this.registerInclusionResolver('following', this.following.inclusionResolver);
  }
}

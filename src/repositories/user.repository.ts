import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Post, User, UserRelations, Follow} from '../models';
import {PostRepository} from './post.repository';
import {FollowRepository} from './follow.repository';

// import {UserRepository} from './user.repository';

// import {UserRepository} from './user.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.userId,
  UserRelations
> {
  public readonly posts: HasManyRepositoryFactory<
    Post,
    typeof User.prototype.userId
  >;

  public readonly followings: HasManyRepositoryFactory<Follow, typeof User.prototype.userId>;

  public readonly followers: HasManyRepositoryFactory<Follow, typeof User.prototype.userId>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('PostRepository')
    protected postRepositoryGetter: Getter<PostRepository>, @repository.getter('FollowRepository') protected followRepositoryGetter: Getter<FollowRepository>,
  ) {
    super(User, dataSource);
    this.followers = this.createHasManyRepositoryFactoryFor('followers', followRepositoryGetter,);
    this.registerInclusionResolver('followers', this.followers.inclusionResolver);
    this.followings = this.createHasManyRepositoryFactoryFor('followings', followRepositoryGetter,);
    this.registerInclusionResolver('followings', this.followings.inclusionResolver);

    this.posts = this.createHasManyRepositoryFactoryFor(
      'posts',
      postRepositoryGetter,
    );
    this.registerInclusionResolver('posts', this.posts.inclusionResolver);
  }
}

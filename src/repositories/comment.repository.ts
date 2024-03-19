import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Comment, CommentRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class CommentRepository extends DefaultCrudRepository<
  Comment,
  typeof Comment.prototype.commentId,
  CommentRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Comment.prototype.commentId>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Comment, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}

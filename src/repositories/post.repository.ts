import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Category, Comment, Post, PostRelations, User} from '../models';
import {CategoryRepository} from './category.repository';
import {CommentRepository} from './comment.repository';
import {UserRepository} from './user.repository';

// import {PostRepository} from './post.repository';

export class PostRepository extends DefaultCrudRepository<
  Post,
  typeof Post.prototype.postId,
  PostRelations
> {
  public readonly posts: HasManyRepositoryFactory<
    Post,
    typeof Post.prototype.postId
  >;

  public readonly comments: HasManyRepositoryFactory<
    Comment,
    typeof Post.prototype.postId
  >;

  public readonly category: BelongsToAccessor<
    Category,
    typeof Post.prototype.postId
  >;

  public readonly user: BelongsToAccessor<User, typeof Post.prototype.postId>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,

    @repository.getter('CommentRepository')
    protected commentRepositoryGetter: Getter<CommentRepository>,
    @repository.getter('CategoryRepository')
    protected categoryRepositoryGetter: Getter<CategoryRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Post, dataSource);

    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.category = this.createBelongsToAccessorFor(
      'category',
      categoryRepositoryGetter,
    );
    this.registerInclusionResolver('category', this.category.inclusionResolver);
    this.comments = this.createHasManyRepositoryFactoryFor(
      'comments',
      commentRepositoryGetter,
    );
    this.registerInclusionResolver('comments', this.comments.inclusionResolver);
  }
}

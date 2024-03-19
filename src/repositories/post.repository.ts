import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository, BelongsToAccessor, ReferencesManyAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Post, PostRelations, Comment, Category, User} from '../models';
import {CommentRepository} from './comment.repository';
import {CategoryRepository} from './category.repository';
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

  public readonly comments: HasManyRepositoryFactory<Comment, typeof Post.prototype.postId>;

  public readonly category: BelongsToAccessor<Category, typeof Post.prototype.postId>;

  public readonly user: BelongsToAccessor<User, typeof Post.prototype.postId>;

  public readonly likedBy: ReferencesManyAccessor<User, typeof Post.prototype.postId>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('PostRepository')
    protected postRepositoryGetter: Getter<PostRepository>, @repository.getter('CommentRepository') protected commentRepositoryGetter: Getter<CommentRepository>, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Post, dataSource);
    this.likedBy = this.createReferencesManyAccessorFor('likedBy', userRepositoryGetter,);
    this.registerInclusionResolver('likedBy', this.likedBy.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
    this.registerInclusionResolver('category', this.category.inclusionResolver);
    this.comments = this.createHasManyRepositoryFactoryFor('comments', commentRepositoryGetter,);
    this.registerInclusionResolver('comments', this.comments.inclusionResolver);
    this.posts = this.createHasManyRepositoryFactoryFor(
      'posts',
      postRepositoryGetter,
    );
    this.registerInclusionResolver('posts', this.posts.inclusionResolver);
  }
}

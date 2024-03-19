import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Category, CategoryRelations, Post, User} from '../models';
import {PostRepository} from './post.repository';
import {UserRepository} from './user.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.categoryId,
  CategoryRelations
> {

  public readonly posts: HasManyRepositoryFactory<Post, typeof Category.prototype.categoryId>;

  public readonly user: BelongsToAccessor<User, typeof Category.prototype.categoryId>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('PostRepository') protected postRepositoryGetter: Getter<PostRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Category, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.posts = this.createHasManyRepositoryFactoryFor('posts', postRepositoryGetter,);
    this.registerInclusionResolver('posts', this.posts.inclusionResolver);
  }
}

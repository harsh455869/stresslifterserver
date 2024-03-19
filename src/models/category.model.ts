import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Post} from './post.model';
import {User} from './user.model';

@model({settings: {strict: false}})
export class Category extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  categoryId?: string;

  @property({
    type: 'string',
  })
  name?: string;
  @property({
    type: 'array',
    itemType: 'string',
  })
  subCategories?: string[];

  @hasMany(() => Post)
  posts: Post[];

  @belongsTo(() => User, {name: 'user'})
  createdBy: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;

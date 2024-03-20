import {
  Entity,
  belongsTo,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Category} from './category.model';
import {Comment} from './comment.model';
import {User} from './user.model';

// import {Post} from './post.model';

@model({settings: {strict: false}})
export class Post extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  postId?: string;

  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
  })
  imageUrl?: string;

  @property({
    type: 'string',
  })
  videoUrl?: string;

  @property({
    type: 'number',
  })
  likes?: number;
  @property({
    type: 'date',
  })
  createdAt?: string;

  @hasMany(() => Comment)
  comments: Comment[];

  @belongsTo(() => Category)
  categoryId: string;

  @belongsTo(() => User)
  userId: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Post>) {
    super(data);
  }
}

export interface PostRelations {
  // describe navigational properties here
}

export type PostWithRelations = Post & PostRelations;

import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model({settings: {strict: false}})
export class Comment extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  commentId?: string;

  @property({
    type: 'string',
  })
  postId?: string;
  @property({
    type: 'string',
  })
  message?: string;

  @property({
    type: 'string',
  })
  likes?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  likedBy?: string[];

  @belongsTo(() => User)
  userId: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Comment>) {
    super(data);
  }
}

export interface CommentRelations {
  // describe navigational properties here
}

export type CommentWithRelations = Comment & CommentRelations;

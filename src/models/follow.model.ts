import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model({settings: {strict: false}})
export class Follow extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  followId?: string;
  @belongsTo(() => User, {name: 'following'})
  followedBy: string;

  @belongsTo(() => User, {name: 'follower'})
  followedTo: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Follow>) {
    super(data);
  }
}

export interface FollowRelations {
  // describe navigational properties here
}

export type FollowWithRelations = Follow & FollowRelations;

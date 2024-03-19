import {Entity, hasMany, model, property} from '@loopback/repository';
import {Follow} from './follow.model';
import {Post} from './post.model';

// import {User} from './user.model';

// import {User} from './user.model';

@model({settings: {strict: false}})
export class User extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  userId?: string;

  @property({
    type: 'string',
  })
  userProfilePic?: string;

  @property({
    type: 'object',
  })
  gender?: object;

  @property({
    type: 'string',
    required: true,
  })
  emailId: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
  })
  mobileNumber?: string;

  @property({
    type: 'date',
  })
  dateOfBirth?: string;

  @property({
    type: 'boolean',
  })
  isUserActive?: boolean;

  @property({
    type: 'string',
  })
  maritualStatus?: string;

  @hasMany(() => Post)
  posts: Post[];

  @hasMany(() => Follow, {keyTo: 'followedBy'})
  followings: Follow[];

  @hasMany(() => Follow, {keyTo: 'followedTo'})
  followers: Follow[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;

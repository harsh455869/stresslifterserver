import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import * as Jwt from 'jsonwebtoken';
import {User} from '../models';
import {UserRepository} from '../repositories';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['userId'],
          }),
        },
      },
    })
    user: Omit<User, 'userId'>,
  ): Promise<User> {
    return this.userRepository.create(user);
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  @post('/users/login')
  @response(200, {
    description: 'User login successfully',
    content: {'application/json': {schema: {token: 'string'}}},
  })
  async login(
    @requestBody() payload: {emailId: string; password: string},
  ): Promise<object> {
    const user = await this.userRepository.findOne({
      where: {
        emailId: payload.emailId,
      },
    });

    console.log(user);

    if (user) {
      const password = user.password;
      if (password == payload.password) {
        const token = Jwt.sign({emailId: payload.emailId}, 'MindSpot');
        return {
          description: 'Login Successfully',
          data: {
            token: token,
            userId: user.userId,
          },
        };
      } else {
        return {
          description: 'Invalid Password.',
        };
      }
    } else {
      return {
        description: 'User Not Found',
      };
    }
  }
  @post('/users/signup')
  @response(200, {
    description: 'User login Successfully',
    content: {'application/json': {schema: {token: 'string'}}},
  })
  async signup(
    @requestBody() payload: {emailId: string; password: string},
  ): Promise<object> {
    const user = await this.userRepository.findOne({
      where: {
        emailId: payload.emailId,
      },
    });

    console.log(user);

    if (user) {
      return {
        error: 'User Already Exists.',
      };
    } else {
      const user = await this.userRepository.create(payload);
      if (user) {
        const token = Jwt.sign({emailId: user.emailId}, 'MindSpot');
        return {
          description: 'Login Successfully',
          data: {
            token: token,
            userId: user.userId,
          },
        };
      }
      return {
        error: 'User Not Found',
      };
    }
  }
}

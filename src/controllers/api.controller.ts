import { transformAndValidate } from 'class-transformer-validator';
import { BadRequest } from 'ts-httpexceptions';

import { BodyParams, Controller, Get, Post, QueryParams, UseBefore } from '@tsed/common';

import { ActionResponse, LoginActionResponse, UserProfile } from '../../shared/models';
import auth from '../auth';
import { RegisterForm } from '../forms';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { UserProfileDbModel } from '../models';
import * as responses from '../responses';

@Controller('/')
export class ApiController {
  @Get('/test')
  test() {
    return Promise.resolve(responses.getOkayResponse());
  }

  @Get('/error-test')
  async errorTest() {
    throw new BadRequest('This is an error!');
  }

  @Get('/say-something')
  saySomething(@QueryParams('whatToSay') whatToSay: string): Promise<ActionResponse<string>> {
    return Promise.resolve(responses.getOkayResponse(whatToSay));
  }

  @Post('/login')
  login(
    @BodyParams('username') username: string,
    @BodyParams('password') password: string
  ): Promise<LoginActionResponse> {
    return auth.authenticate(username, password).then(user => {
      if (!user) throw new BadRequest(`Username or password are invalid!`);

      const token = auth.generateToken(user.toJSON());
      const response = responses.getOkayResponse();

      return {
        ...response,
        data: {
          token: token,
          profile: user
        }
      };
    });
  }

  @Get('/profile')
  @UseBefore(AuthMiddleware)
  getProfile(user: UserProfile): Promise<UserProfile> {
    return Promise.resolve(user);
  }

  @Get('/logout')
  @UseBefore(AuthMiddleware)
  logout(): Promise<ActionResponse<any>> {
    // TODO: Implement your own logout mechanisem (JWT token blacklists, etc...)
    return Promise.reject(`Logout has not been implemented!`);
  }

  @Post('/register')
  register(@BodyParams() userProfile: UserProfile): Promise<UserProfile> {
    return transformAndValidate(RegisterForm, userProfile).then((registerForm: RegisterForm) => {
      return registerForm.getHashedPassword().then(hashedPassword => {
        return UserProfileDbModel.create({
          ...registerForm,
          password: hashedPassword
        });
      });
    });
  }
}

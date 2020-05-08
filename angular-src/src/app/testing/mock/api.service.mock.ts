import { Observable, of, throwError } from 'rxjs';

import { Injectable } from '@angular/core';

import { LoginActionResponse, UserProfile } from '../../../../../shared/models';
import { generateMockRootUser } from '../../../../../shared/testing/mock/user.mock';

@Injectable()
export class MockApiService {
  // The root user
  rootUser: UserProfile = generateMockRootUser();

  // The list of users registered
  registeredUsers: UserProfile[] = [];

  login(username: string, password: string): Observable<LoginActionResponse> {
    return of({
      status: 'ok',
      data: {
        token: 'randomtoken',
        profile: this.rootUser,
      },
    });
  }

  socialLogin(provider: string, authToken: string): Observable<LoginActionResponse> {
    return throwError('Not implemented!');
  }

  register(user: UserProfile): Observable<UserProfile> {
    this.registeredUsers.push(user);
    return of(user);
  }

  getProfile(): Observable<UserProfile> {
    return of(this.rootUser);
  }
}

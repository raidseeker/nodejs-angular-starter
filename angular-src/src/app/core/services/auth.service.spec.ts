import { async, TestBed } from '@angular/core/testing';

import { getCommonTestBed } from '../../testing/test_utils';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(async(() => {
    getCommonTestBed([]).compileComponents();
    service = TestBed.inject(AuthService);
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should login with the correct credentials and emit userChanged', async () => {
    // User should be udefined at first
    expect(service.user).toBeUndefined();

    // Expect if userChanged was called
    const spy = spyOn(service.userChanged, 'next');

    const result = await service.login('admin', 'admin').toPromise();

    // Expect that the user was set
    expect(service.user).toBeTruthy();
    // Expect userChange to be called once
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should fail to login with incorrect credentials and userChanged should not be called', async () => {
    const spy = spyOn(service.userChanged, 'next');

    await expectAsync(service.login('incorrect', 'incorrect').toPromise()).toBeRejected();

    // User should be undefined and no userChanged should be called
    expect(service.user).toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(0);
  });
});

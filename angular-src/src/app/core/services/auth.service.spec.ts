import { async, TestBed } from '@angular/core/testing';

import { MockApiService } from '../../testing/mock/api.service.mock';
import { getCommonTestBed } from '../../testing/test_utils';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

fdescribe('AuthService', () => {
  let service: AuthService;
  beforeEach(async(() => {
    getCommonTestBed([]).compileComponents();
    service = TestBed.inject(AuthService);
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should login with the correct credentials and emit userChanged', async () => {
    // User should be null first
    expect(service.user).toBeUndefined();

    const result = await service.login('admin', 'admin').toPromise();

    // Expect that the user was set
    expect(service.user).toBeTruthy();
  });

  it('should fail to login with incorrect credentials', () => {});
});

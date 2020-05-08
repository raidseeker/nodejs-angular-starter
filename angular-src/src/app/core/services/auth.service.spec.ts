import { async, TestBed } from '@angular/core/testing';

import { getCommonTestBed } from '../../testing/test_utils';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(async(() => {
    getCommonTestBed([], [], [AuthService]).compileComponents();
    service = TestBed.inject(AuthService);
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should login with the correct credentials and emit userChanged', () => {});

  it('should fail to login with incorrect credentials', () => {});
});

import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { redirectIfAuthenticatedGuard } from './redirect-if-authenticated-guard';

describe('redirectIfAuthenticatedGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => redirectIfAuthenticatedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

import {TestBed} from '@angular/core/testing';

import {LoginExistGuard} from './login-exist.guard';

describe('LoginExistGuard', () => {
    let guard: LoginExistGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        guard = TestBed.inject(LoginExistGuard);
    });

    it('should be created', () => {
        expect(guard).toBeTruthy();
    });
});

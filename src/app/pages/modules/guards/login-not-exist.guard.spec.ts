import {TestBed} from '@angular/core/testing';

import {LoginNotExistGuard} from './login-not-exist.guard';

describe('LoginNotExistGuard', () => {
    let guard: LoginNotExistGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        guard = TestBed.inject(LoginNotExistGuard);
    });

    it('should be created', () => {
        expect(guard).toBeTruthy();
    });
});

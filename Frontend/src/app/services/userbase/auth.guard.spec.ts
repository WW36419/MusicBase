import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CanActivateFn } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';



describe('AuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let router: Router;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authService }
      ]
    });

    router = TestBed.inject(Router);
  });


  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access when user is logged in', () => {
    // Arrange
    authService.isLoggedIn.and.returnValue(true);

    // Act
    const result = executeGuard({} as any, {} as any);

    // Assert
    expect(authService.isLoggedIn).toHaveBeenCalled();
    expect(result).toBeTrue();
  });

  it('should redirect to "/login" when user is not logged in', () => {
    // Arrange
    authService.isLoggedIn.and.returnValue(false);

    // Act
    const result = executeGuard({} as any, {} as any);

    // Assert
    expect(authService.isLoggedIn).toHaveBeenCalled();
    expect(router.serializeUrl(result as UrlTree)).toBe('/login');
  });
});

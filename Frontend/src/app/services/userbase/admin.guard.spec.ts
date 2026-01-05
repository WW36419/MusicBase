import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CanActivateFn } from '@angular/router';

import { adminGuard } from './admin.guard';
import { AuthService } from './auth.service';



describe('AdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => adminGuard(...guardParameters));

  let router: Router;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['isAdmin']);

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

  it('should allow access when user is admin', () => {
    // Arrange
    authService.isAdmin.and.returnValue(true);

    // Act
    const result = executeGuard({} as any, {} as any);

    // Assert
    expect(authService.isAdmin).toHaveBeenCalled();
    expect(result).toBeTrue();
  });

  it('should redirect to "/" when user is not admin', () => {
    // Arrange
    authService.isAdmin.and.returnValue(false);

    // Act
    const result = executeGuard({} as any, {} as any);

    // Assert
    expect(authService.isAdmin).toHaveBeenCalled();
    expect(router.serializeUrl(result as UrlTree)).toBe('/');
  });
});

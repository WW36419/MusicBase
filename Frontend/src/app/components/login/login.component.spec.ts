import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/userbase/auth.service';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { HomepageComponent } from '../homepage/homepage.component';
import { Location } from '@angular/common';




describe('LoginComponent Unit Testing', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockLogin: string = "user@test.pl";
  const mockPassword: string = "PASS123"

  const mockAuthService = {
    isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(false),
    authenticate: jasmine.createSpy('authenticate').and.callFake((cred) => {
      if (cred !== null)
        return of(cred.login === mockLogin && cred.password === mockPassword);
      return of(false);
    })
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .overrideComponent(LoginComponent, {
      set: {
        providers: [{provide: AuthService, useValue: mockAuthService}]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });


  it('should create', () => {
    // Act
    fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  

  it('should be logged in when authentication is successful', () => {
    // Arrange
    const credentials = {
      login: 'user@test.pl',
      password: 'PASS123'
    }

    // Act
    component.loginForm.setValue(credentials);
    component.signIn();
    fixture.detectChanges();

    // Assert
    expect(component.loginForm.valid).toBeTrue();
    expect(component.loggedIn).toBeTrue();
  });

  it('should not be logged in when authentication is unsuccessful', () => {
    // Arrange
    const credentials = {
      login: 'user@test.pl',
      password: 'PASS321'
    }

    // Act
    component.loginForm.setValue(credentials);
    component.signIn();
    fixture.detectChanges();

    // Assert
    expect(component.loginForm.valid).toBeTrue();
    expect(component.loggedIn).toBeFalse();
    expect(component.hasTried).toBeTrue();
  })
});



describe('LoginComponent Routing Integration', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let location: Location;

  const mockLogin: string = "USER123";
  const mockPassword: string = "PASS123"

  const mockAuthService = {
    isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(false),
    authenticate: jasmine.createSpy('authenticate').and.callFake((cred) => {
      if (cred !== null)
        return of(cred.login === mockLogin && cred.password === mockPassword);
      return of(false);
    })
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([
          { path: '', component: HomepageComponent }
        ]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .overrideComponent(LoginComponent, {
      set: {
        providers: [{provide: AuthService, useValue: mockAuthService}]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
  });

  
  it('should create', () => {
    // Act
    fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  it ('should navigate to homepage when login is successful', () => {
    // Arrange
    const credentials = {
      login: 'user@test.pl',
      password: 'PASS123'
    }

    // Act
    component.loginForm.setValue(credentials);
    component.signIn();
    fixture.detectChanges();

    // Assert
    expect(component.loginForm.valid).toBeTrue();
    expect(location.path()).toBe('');
  });
});

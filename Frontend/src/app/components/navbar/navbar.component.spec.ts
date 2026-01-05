import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Location } from '@angular/common';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { NavbarComponent } from './navbar.component';
import { HomepageComponent } from '../homepage/homepage.component';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { FavouritesComponent } from '../favourites/favourites.component';
import { AdminPanelComponent } from '../admin-panel/admin-panel.component';
import { AuthService } from '../../services/userbase/auth.service';



describe('NavbarComponent Unit Testing', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  let isLoggedIn: boolean = false;
  
  const mockAuthService = {
    isLoggedIn: jasmine.createSpy('isLoggedIn').and.callFake(() => isLoggedIn),
    isAdmin: jasmine.createSpy('isAdmin').and.callFake(() => isLoggedIn),
    logout: jasmine.createSpy('logout').and.callFake(() => {
      isLoggedIn = false;
      return true;
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  
  it('should create', () => {
    // Act
    fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  it('should log out when logout button is clicked', fakeAsync(() => {
    // Arrange
    isLoggedIn = true;

    // Act
    fixture.detectChanges();
    const logoutButton = fixture.nativeElement?.querySelector('button[id="logout"]') as HTMLElement;
    logoutButton.click()
    tick();

    // Assert
    expect(isLoggedIn).toBeFalse();
  }));
});



describe('NavbarComponent Router Integration', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let location: Location;

  let isLoggedIn: boolean = false;
  
  const mockAuthService = {
    isLoggedIn: jasmine.createSpy('isLoggedIn').and.callFake(() => isLoggedIn),
    isAdmin: jasmine.createSpy('isAdmin').and.callFake(() => isLoggedIn)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([
          { path: '', component: HomepageComponent },
          { path: 'login', component: LoginComponent },
          { path: 'signup', component: SignupComponent },
          { path: 'favourites', component: FavouritesComponent },
          { path: 'admin', component: AdminPanelComponent },
        ]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
  });

  
  it('should create', () => {
    // Act
    fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  it('should navigate to home page when homepage button is clicked', fakeAsync(() => {
    // Arrange
    const homepage_path: string = ''

    // Act
    fixture.detectChanges();
    const logoutButton = fixture.nativeElement?.querySelector('a[id="homepage"]') as HTMLElement;
    logoutButton.click()
    tick();

    // Assert
    expect(location.path()).toBe(homepage_path);
  }));

  it('should navigate to favourites page when favourites button is clicked', fakeAsync(() => {
    // Arrange
    isLoggedIn = true;
    const favourites_path: string = '/favourites'
    
    // Act
    fixture.detectChanges();
    const favouritesButton = fixture.nativeElement?.querySelector('a[id="favourites"]') as HTMLElement;
    favouritesButton.click()
    tick();

    // Assert
    expect(isLoggedIn).toBeTrue();
    expect(location.path()).toBe(favourites_path);
  }));

  it('should navigate to admin panel when admin button is clicked', fakeAsync(() => {
    // Arrange
    isLoggedIn = true;
    const admin_path: string = '/admin'
    
    // Act
    fixture.detectChanges();
    const adminButton = fixture.nativeElement?.querySelector('a[id="admin"]') as HTMLElement;
    adminButton.click()
    tick();

    // Assert
    expect(location.path()).toBe(admin_path);
  }));

  it('should navigate to login page when login button is clicked', fakeAsync(() => {
    // Arrange
    isLoggedIn = false;
    const login_path: string = '/login'
    
    // Act
    fixture.detectChanges();
    const loginButton = fixture.nativeElement?.querySelector('a[id="login"]') as HTMLElement;
    loginButton.click()
    tick();

    // Assert
    expect(location.path()).toBe(login_path);
  }));

  it('should navigate to sign up page when signup button is clicked', fakeAsync(() => {
    // Arrange
    isLoggedIn = false;
    const signup_path: string = '/signup'
    
    // Act
    fixture.detectChanges();
    const signupButton = fixture.nativeElement?.querySelector('a[id="signup"]') as HTMLElement;
    signupButton.click()
    tick();

    // Assert
    expect(location.path()).toBe(signup_path);
  }));

});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { provideRouter } from '@angular/router';
import { HomepageComponent } from '../homepage/homepage.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Location } from '@angular/common';



describe('SignupComponent Routing Integration', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let location: Location;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [
        provideRouter([
          { path: '', component: HomepageComponent }
        ]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
  });


  it('should create', () => {
    // Act
    fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  it('should navigate to homepage after signup', () => {
    // Arrange
    const credentials = {
      username: 'USER123',
      email: 'test@mail.com',
      password: 'PASS123',
      repeatPassword: 'PASS123'
    }

    // Act
    component.signupForm.setValue(credentials);
    component.createUser();
    fixture.detectChanges();

    // Assert
    expect(component.signupForm.valid).toBeTrue();
    expect(location.path()).toBe('');
  });
});

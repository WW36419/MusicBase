import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './services/userbase/auth.interceptor';
import { AppComponent } from './app.component';


describe('AppComponent Unit Testing', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(routes), 
        provideClientHydration(withEventReplay()),
        provideHttpClient(withInterceptors([authInterceptor]))
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });
  

  it('should create the app', () => {
    // Act
    fixture.detectChanges();
    // Assert
    expect(component).toBeTruthy();
  });

  it(`should have the 'Music Base' title`, () => {
    // Arrange
    const title: string = 'Music Base'
    // Act
    fixture.detectChanges();
    // Assert
    expect(component.title).toEqual(title);
  });
});

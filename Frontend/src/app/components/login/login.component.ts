import {Component} from '@angular/core';
import { AuthService } from '../../services/userbase/auth.service';
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'login',
  imports: [FormsModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public credentials = {
    login: '',
    password: ''
  };
 
  public logged?: boolean;
  public logout?: boolean;
 
  constructor(public authService: AuthService, private router: Router) {}


  signIn() {
    return this.authService.authenticate(this.credentials).subscribe((result) => {
      if (!result) {
        this.logged = false;
      } else {
        this.logout = false;
        this.credentials = {
          login: '',
          password: ''
        };
        this.router.navigate(['/']);
      }
    });
  }
}

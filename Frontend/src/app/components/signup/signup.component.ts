import { Component } from '@angular/core';
import { AuthService } from '../../services/userbase/auth.service';
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'signup',
  imports: [FormsModule],
  providers: [AuthService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  public credentials = {
    name: '',
    email: '',
    password: '',
  };
 
  constructor(private authService: AuthService, public router: Router) {}


  create() {
    this.authService.createOrUpdate(this.credentials).subscribe((result) => {
      return result;
    });
    this.router.navigate(['/']);
  } 
}

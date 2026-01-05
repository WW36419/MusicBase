import { Component } from '@angular/core';
import { AuthService } from '../../services/userbase/auth.service';
import {Router} from "@angular/router";
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'signup',
  imports: [FormsModule, ReactiveFormsModule],
  providers: [AuthService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  signupForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)]),
    repeatPassword: new FormControl('', [Validators.required, Validators.minLength(3)])
  });
 
  public hasTried: boolean = false;


  constructor(private authService: AuthService, public router: Router) {}

  createUser() {
    const signupData = this.signupForm.value

    if (signupData.password !== signupData.repeatPassword) {
      this.hasTried = true;
      return;
    }

    const credentials = {
      name: signupData.username,
      email: signupData.email,
      password: signupData.password,
    };

    this.authService.createOrUpdate(credentials).subscribe((result) => {
      return result;
    });
    this.router.navigate(['/']);
  } 
}

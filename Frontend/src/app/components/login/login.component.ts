import {Component, OnInit} from '@angular/core';
import { AuthService } from '../../services/userbase/auth.service';
import {Router} from "@angular/router";
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'login',
  imports: [FormsModule, ReactiveFormsModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)])
  });
 
  public loggedIn: boolean = false;
  public hasTried: boolean = false;
 

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.isLoggedIn())
      this.router.navigate(['/']);
  }

  signIn() {
    const loginData = this.loginForm.value
    return this.authService.authenticate(loginData).subscribe((result) => {
      if (result) {
        this.loggedIn = true;
        this.router.navigate(['/']);
      } else {  
        this.hasTried = true;
      }
    });
  }
}

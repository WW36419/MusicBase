import { Component } from '@angular/core';
import { AuthService } from '../../services/userbase/auth.service';
import {Router, RouterModule} from "@angular/router";
//import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  
  constructor(public authService: AuthService, public router: Router) {}

  signOut() {
    this.authService.logout().subscribe((result: any) => {
      this.router.navigate(['/']);
      return result;
    });
  }
}

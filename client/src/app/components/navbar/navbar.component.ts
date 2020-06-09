import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private indexClass = 'nav-item';
  private controlPanelClass = 'nav-item';
  private notifyClass = 'nav-item';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  public setLocation(location: string) {
    switch (location) {
      case 'index':
        this.indexClass = 'nav-item active';
        break;
      case 'controlPanel':
        this.indexClass = 'nav-item active';
        break;
      case 'notify':
        this.notifyClass = 'nav-item active';
        break;
      default:
        this.indexClass = 'nav-item active';
    }
  }

  public logOut() {
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }
}

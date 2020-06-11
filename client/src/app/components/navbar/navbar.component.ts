import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { NotifyService } from 'src/app/services/notify.service';
import { IResponse } from 'src/app/interfaces/core.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private indexClass = 'nav-item';
  private controlPanelClass = 'nav-item';
  private notifyClass = 'nav-item';
  private news: boolean;
  constructor(
    private userService: UserService,
    private router: Router,
    private notifyService: NotifyService
  ) { }

  ngOnInit() {
    this.checkForNotifys();
  }

  public setLocation(location: string) {
    this.checkForNotifys();
    switch (location) {
      case 'index':
        this.indexClass = 'nav-item active';
        break;
      case 'controlPanel':
        this.controlPanelClass = 'nav-item active';
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

  private checkForNotifys() {
    this.notifyService.checkForNotifys(this.userService.getCodUser()).subscribe(
      (res) => {
        const response = res as IResponse;
        this.news = response.data.newNotifications;
      },
      (err) => {
        console.log(err);
      }
    )
  }
}

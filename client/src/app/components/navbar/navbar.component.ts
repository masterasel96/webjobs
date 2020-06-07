import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private indexClass = 'nav-item';
  private controlPanelClass = 'nav-item';
  private notifyClass = 'nav-item';

  constructor() { }

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
}

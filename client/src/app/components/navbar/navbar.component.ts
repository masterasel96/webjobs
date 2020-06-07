import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private location: string = null;
  constructor() { }

  public setLocation(location: string) {
    this.location = location;
  }
}

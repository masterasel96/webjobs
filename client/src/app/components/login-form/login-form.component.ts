import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(
    private userService: UserService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('WebJobs | Login');
    this.userService.getUsers().subscribe(
      res => console.log(res),
      err => console.log(err)
    );
  }

}

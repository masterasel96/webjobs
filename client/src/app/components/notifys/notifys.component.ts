import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoadScreemComponent } from '../load-screem/load-screem.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { IResponse, NotifysTypes } from 'src/app/interfaces/core.interface';
import { UserService } from '../../services/user.service';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'app-notifys',
  templateUrl: './notifys.component.html',
  styleUrls: ['./notifys.component.css']
})
export class NotifysComponent implements OnInit {
  @ViewChild(NavbarComponent, { static: true }) navBar: NavbarComponent;
  @ViewChild(LoadScreemComponent, { static: true }) loadScreem: LoadScreemComponent;
  private codUser: string;
  private notifys: any[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private titleService: Title,
    private userService: UserService,
    private notifyService: NotifyService
    ) {
    this.userService.checkUserSession().subscribe(
      (res) => {
        const response = res as IResponse;
        if (!response.data.keepLogin) {
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        this.router.navigate(['/login']);
      }
    );
    this.codUser = this.userService.getCodUser();
    }

  ngOnInit() {
    this.titleService.setTitle('WebJobs | Notificaciones');
    this.navBar.setLocation('notify');
    this.getNotifys();
  }

  private getNotifys(): void {
    this.notifyService.getNotifys(this.codUser).subscribe(
      (res) => {
        const response = res as IResponse;
        response.data.notifications.forEach(not => {
          let message = '';
          switch (not.message.split(':::')[0]) {
            case NotifysTypes.PENDING_WORK:
              message = `  te ha mandado una nueva petición de trabajo.`;
              break;
            case NotifysTypes.ACCEPT_WORK:
              message = `  a aceptado tu peticion de trabajo.`;
              break;
            case NotifysTypes.CANCEL_WORK:
              message = `  a rechazado tu peticion de trabajo.`;
              break;
            case NotifysTypes.FINISH_WORK:
              message = `  y tu habeis finalizado vuestro contrato.`;
          }
          if (message !== '') {
            this.notifys.push({
              indirectUserCode: not.indirectUser.codUser,
              indirectUserName: `${not.indirectUser.userName} ${not.indirectUser.lastName}`,
              message,
              see: not.see,
              date: not.createdDate,
              codContract: not.message.split(':::')[1]
            });
          }
        });
        console.log(this.notifys);
      },
      (err) => {
        console.log(err);
      }
    );
  }

}

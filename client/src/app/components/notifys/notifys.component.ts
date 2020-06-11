import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoadScreemComponent } from '../load-screem/load-screem.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { IResponse, NotifysTypes } from 'src/app/interfaces/core.interface';
import { UserService } from '../../services/user.service';
import { NotifyService } from '../../services/notify.service';
import * as $ from 'jquery';
import { ContractService } from 'src/app/services/contract.service';

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
  // VALORACIONES DE CONTRATOS
  private stars: string;
  private coment: string;
  private contract: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private titleService: Title,
    private userService: UserService,
    private notifyService: NotifyService,
    private contractService: ContractService,
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
    $('input[name=star_points]').on('change', (elem) => {
      $('#points img').attr('src', 'assets/icons/star.svg');
      for (const key in elem.target.nextSibling.children) {
        if (elem.target.nextSibling.children.hasOwnProperty(key)) {
          const element = elem.target.nextSibling.children[key];
          element.src = 'assets/icons/star_big.svg';
        }
      }
    });
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
              codContract: not.message.split(':::')[1],
              codNotify: not.codNotify,
              type: not.message.split(':::')[0],
              worker: false
            });
          }
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private seeContract(codNotify: string, codContract: string): void {
    this.notifyService.seeNotify(codNotify).subscribe(
      (res) => {
        const response = res as IResponse;
        if (response.data.see) {
          this.router.navigate(['/control_panel'], { fragment: `contract_${codContract}` });
        } else {
          this.toastr.error('Vaya parece que ha salido algo mal...');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private setComent(): void {
    this.contractService.getContract(this.contract).subscribe(
      (res) => {
        const response = res as IResponse;
        const isContractor: boolean = response.data.contracts.contractor.codUser === this.codUser ? true : false;
        let newValues: any;
        if (isContractor) {
          newValues = {
            contractorAssessment: this.coment,
            contractorPunctuation: this.stars
          };
        } else {
          newValues = {
            workerAssessment: this.coment,
            workerPunctuation: this.stars
          };
        }
        this.contractService.updateContract({codContract: this.contract, newValues}).subscribe(
          (res1) => {
            const response1 = res1 as IResponse;
            this.toastr.success('Comentarios y puntuacion registrados correctamente');
            this.stars = undefined;
            this.coment = null;
            $('#points img').attr('src', 'assets/icons/star.svg');
          },
          (err1) => {
            const errorData = err1.error as IResponse;
            this.toastr.error(errorData.data.error);
            this.stars = null;
            this.coment = null;
            $('#points img').attr('src', 'assets/icons/star.svg');
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private setContract(codContract): void {
    this.contract = codContract;
    this.contractService.getContract(this.contract).subscribe(
      (res) => {
        const response = res as IResponse;
        if (response.data.contracts.codContract !== undefined) {
          const isContractor: boolean = response.data.contracts.contractor.codUser === this.codUser ? true : false;
          if (isContractor) {
            this.coment = response.data.contracts.contractorAssessment;
            this.stars = response.data.contracts.contractorPunctuation;
          } else {
            this.coment = response.data.contracts.workerAssessment;
            this.stars = response.data.contracts.workerPunctuation;
          }
          switch (this.stars) {
            case '1':
              $('label[for=one_star]').click();
              break;
            case '2':
              $('label[for=two_star]').click();
              break;
            case '3':
              $('label[for=three_star]').click();
              break;
            case '4':
              $('label[for=four_star]').click();
              break;
            default:
              $('label[for=five_star]').click();
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

}

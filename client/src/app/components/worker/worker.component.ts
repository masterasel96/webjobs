import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoadScreemComponent } from '../load-screem/load-screem.component';
import { UserService } from 'src/app/services/user.service';
import { ContractService } from 'src/app/services/contract.service';
import { ExperienceService } from 'src/app/services/experience.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css']
})
export class WorkerComponent implements OnInit {
  @ViewChild(NavbarComponent, { static: true }) navBar: NavbarComponent;
  @ViewChild(LoadScreemComponent, { static: true }) loadScreem: LoadScreemComponent;
  private workerInfo: any = {};
  private codWorker: string;
  constructor(
    private userService: UserService,
    private contractService: ContractService,
    private experienceService: ExperienceService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.codWorker = params.worker;
      this.getWorkerInfo();
    });
  }

  private getWorkerInfo(): void {
    this.userService.getUser(this.codWorker).subscribe(
      (res) => {
        const response = res as any;
        const user = response.data.users;
        this.workerInfo = user;
        let s = 0;
        this.contractService.getContractsByUser(user.codUser.toString()).subscribe(
          (res1) => {
            const response1 = res1 as any;
            response1.data.contracts.forEach(contract => {
              s += contract.worker.codUser === user.codUser ? Number(contract.contractorPunctuation) : Number(contract.workerPunctuation);
            });
            if (response1.data.contracts.length > 0) {
              this.workerInfo.punctuation = s / response1.data.contracts.length;
            }
            this.experienceService.getExperiences(user.codUser.toString()).subscribe(
              (res2) => {
                const response2 = res2 as any;
                if (response2.data.profExp.length > 0) {
                  response2.data.profExp.sort((a: { startDate: number; }, b: { startDate: number; }) => {
                    if (a.startDate > b.startDate) { return 1; }
                    if (b.startDate > a.startDate) { return -1; }
                  });
                  this.workerInfo.experiences = response2.data.profExp;
                  this.workerInfo.profesion = response2.data.profExp[0].category.name;
                }
              },
              (err2) => {
                console.log(err2);
              }
            );
          },
          (err1) => {
            console.log(err1);
          }
        );
      },
      (err) => {
        console.log(err);
      });
  }

  public sendPetition(): void {

  }

}

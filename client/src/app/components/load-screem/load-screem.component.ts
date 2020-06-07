import { Component } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-load-screem',
  templateUrl: './load-screem.component.html',
  styleUrls: ['./load-screem.component.css']
})
export class LoadScreemComponent {

  constructor() { }

  public load(status: boolean, callback = () => { }): void {
    if (status) {
      $('body').css('overflow-y', 'hidden');
      $('#mask').fadeIn(500, () => {
        callback();
      });
    } else {
      $('#mask').fadeOut(500);
      $('body').css('overflow-y', 'auto');
    }
  }
}

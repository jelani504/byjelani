import { Component, OnInit } from '@angular/core';
import { IconService } from '../icon.service';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss']
})
export class HeadComponent implements OnInit {

  public locationOrigin = window.location.origin;
  constructor(public iconService: IconService, public router: Router) { console.log(window.location); }

  ngOnInit() {
  }

  handleIconClick(icon){
    this.router.navigate([`/${icon}`]);
  }

  navigateHome(){
    this.router.navigate(['/']);
  }

}

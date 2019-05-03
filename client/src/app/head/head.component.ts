import { Component, OnInit } from '@angular/core';
import { IconService } from '../icon.service';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss']
})
export class HeadComponent implements OnInit {

  public locationOrigin = window.location.origin;
  constructor(
    public iconService: IconService,
    public navigationService: NavigationService
  ) {}

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { IconService } from '../icon.service';
import { NavigationService } from '../navigation.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss']
})
export class HeadComponent implements OnInit {

  public locationOrigin = window.location.origin;
  public vmBagLength = 0;
  constructor(
    public iconService: IconService,
    public navigationService: NavigationService,
    private userService: UserService
  ) {
    userService.userBag.subscribe(bag => this.vmBagLength = bag.length);
  }

  ngOnInit() {
  }

}

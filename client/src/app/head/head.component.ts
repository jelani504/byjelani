import { Component, OnInit } from '@angular/core';
import { IconService } from '../icon.service';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss']
})
export class HeadComponent implements OnInit {

  constructor(public iconService: IconService) { }

  ngOnInit() {
  }

}

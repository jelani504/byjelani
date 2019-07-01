import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-preorder',
  templateUrl: './preorder.component.html',
  styleUrls: ['./preorder.component.scss']
})
export class PreorderComponent implements AfterViewInit, OnInit {

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'black';
 }
}

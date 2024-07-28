import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-filter-popover',
  templateUrl: './filter-popover.component.html',
  styleUrls: ['./filter-popover.component.scss']
})
export class FilterPopoverComponent implements OnInit {
  user: any;
  tabs: any;
  
  constructor(
    public nav: NavParams,
    public popover: PopoverController
  ) {
    this.user = this.nav.data.user;
    this.tabs = this.nav.data.tabs;
  }

  ngOnInit() {
  }

  process(type: string) {
    this.close(type);
  }

  close(flag) {
  	this.popover.dismiss(flag);
  }

}
